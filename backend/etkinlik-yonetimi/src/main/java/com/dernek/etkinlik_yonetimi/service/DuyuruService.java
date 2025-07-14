package com.dernek.etkinlik_yonetimi.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dernek.etkinlik_yonetimi.dto.request.CreateDuyuruDto;
import com.dernek.etkinlik_yonetimi.dto.response.DuyuruResponseDto;
import com.dernek.etkinlik_yonetimi.entity.Duyuru;
import com.dernek.etkinlik_yonetimi.mapper.DuyuruMapper;
import com.dernek.etkinlik_yonetimi.repository.DuyuruRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class DuyuruService {
    
    @Autowired
    private DuyuruRepository duyuruRepository;
    
    @Autowired
    private DuyuruMapper duyuruMapper;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    // MANUEL CACHE: In-memory cache
    private final Map<String, Object> manuelCache = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> cacheTimestamps = new ConcurrentHashMap<>();
    private final long CACHE_TTL_MINUTES = 15;
    
    // Manuel cache helper metodu
    private boolean isCacheValid(String key) {
        LocalDateTime timestamp = cacheTimestamps.get(key);
        if (timestamp == null) return false;
        return timestamp.plusMinutes(CACHE_TTL_MINUTES).isAfter(LocalDateTime.now());
    }
    
    private void putCache(String key, Object value) {
        manuelCache.put(key, value);
        cacheTimestamps.put(key, LocalDateTime.now());
        log.info(" Cache'e eklendi: {}", key);
    }
    
    @SuppressWarnings("unchecked")
    private <T> T getCache(String key, Class<T> type) {
        if (isCacheValid(key)) {
            log.info(" Cache HIT: {}", key);
            return (T) manuelCache.get(key);
        }
        return null;
    }
    
    private void clearCache() {
        manuelCache.clear();
        cacheTimestamps.clear();
        log.info(" Cache temizlendi");
    }
    
    // MANUEL CACHE: Aktif duyuruları cache'le
    public List<DuyuruResponseDto> getActiveDuyurular() {
        String cacheKey = "activeDuyurular";
        
        // Cache'den kontrol et
        List<DuyuruResponseDto> cached = getCache(cacheKey, List.class);
        if (cached != null) {
            return cached;
        }
        
        // Cache MISS - Database'den getir
        log.info(" Cache MISS - Database'den aktif duyurular getiriliyor...");
        List<Duyuru> duyurular = duyuruRepository.findActiveAnnouncements(LocalDateTime.now());
        log.info(" {} aktif duyuru bulundu", duyurular.size());
        
        List<DuyuruResponseDto> result = duyuruMapper.toResponseDtoList(duyurular);
        
        // Cache'e kaydet
        putCache(cacheKey, result);
        
        return result;
    }
    
    // MANUEL CACHE: Tüm duyuruları cache'le
    public List<DuyuruResponseDto> getAllDuyurular() {
        String cacheKey = "allDuyurular";
        
        // Cache'den kontrol et
        List<DuyuruResponseDto> cached = getCache(cacheKey, List.class);
        if (cached != null) {
            return cached;
        }
        
        // Cache MISS - Database'den getir
        log.info(" Cache MISS - Database'den tüm duyurular getiriliyor...");
        List<Duyuru> duyurular = duyuruRepository.findAll();
        log.info(" {} duyuru bulundu", duyurular.size());
        
        List<DuyuruResponseDto> result = duyuruMapper.toResponseDtoList(duyurular);
        
        // Cache'e kaydet
        putCache(cacheKey, result);
        
        return result;
    }
    
    // MANUEL CACHE: Tek duyuru cache'le
    public DuyuruResponseDto getDuyuruById(Long id) {
        String cacheKey = "duyuru_" + id;
        
        // Cache'den kontrol et
        DuyuruResponseDto cached = getCache(cacheKey, DuyuruResponseDto.class);
        if (cached != null) {
            return cached;
        }
        
        // Cache MISS - Database'den getir
        log.info(" Cache MISS - Database'den duyuru getiriliyor: {}", id);
        Duyuru duyuru = duyuruRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı: " + id));
        
        DuyuruResponseDto result = duyuruMapper.toResponseDto(duyuru);
        
        // Cache'e kaydet
        putCache(cacheKey, result);
        
        return result;
    }
    
    // CACHE INVALIDATION: Yeni duyuru eklendiğinde cache'i temizle
    public DuyuruResponseDto createDuyuru(CreateDuyuruDto createDto) {
        log.info(" Yeni duyuru oluşturuluyor: {}", createDto.getKonu());
        
        Duyuru duyuru = duyuruMapper.toEntity(createDto);
        duyuru.setCreatedBy("ADMIN");
        
        Duyuru savedDuyuru = duyuruRepository.save(duyuru);
        
        // Cache'i temizle
        clearCache();
        
        log.info(" Duyuru kaydedildi - Cache temizlendi");
        
        return duyuruMapper.toResponseDto(savedDuyuru);
    }
    
    // CACHE INVALIDATION: Resimli duyuru oluştur
    public DuyuruResponseDto createDuyuruWithImage(CreateDuyuruDto createDto, MultipartFile imageFile) throws IOException {
        log.info(" Resimli duyuru oluşturuluyor: {}", createDto.getKonu());
        
        Duyuru duyuru = duyuruMapper.toEntity(createDto);
        
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImageFile(imageFile);
            duyuru.setResimYolu("uploads/" + fileName);
            log.info(" Resim kaydedildi: {}", fileName);
        }
        
        duyuru.setCreatedBy("ADMIN");
        Duyuru savedDuyuru = duyuruRepository.save(duyuru);
        
        // Cache'i temizle
        clearCache();
        
        log.info(" Resimli duyuru kaydedildi - Cache temizlendi");
        
        return duyuruMapper.toResponseDto(savedDuyuru);
    }
    
    //  CACHE INVALIDATION: Duyuru güncellendiğinde cache'i temizle
    public DuyuruResponseDto updateDuyuru(Long id, CreateDuyuruDto updateDto) {
        log.info(" Duyuru güncelleniyor: {}", id);
        
        Duyuru existingDuyuru = duyuruRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı: " + id));
        
        duyuruMapper.updateEntityFromDto(existingDuyuru, updateDto);
        existingDuyuru.setUpdatedBy("ADMIN");
        
        Duyuru updatedDuyuru = duyuruRepository.save(existingDuyuru);
        
        // Cache'i temizle
        clearCache();
        
        log.info(" Duyuru güncellendi - Cache temizlendi");
        
        return duyuruMapper.toResponseDto(updatedDuyuru);
    }
    
    //  CACHE INVALIDATION: Resimli duyuru güncelle
    public DuyuruResponseDto updateDuyuruWithImage(Long id, CreateDuyuruDto updateDto, MultipartFile imageFile) throws IOException {
        log.info(" Resimli duyuru güncelleniyor: {}", id);
        
        Duyuru existingDuyuru = duyuruRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Duyuru bulunamadı: " + id));
        
        duyuruMapper.updateEntityFromDto(existingDuyuru, updateDto);
        
        if (imageFile != null && !imageFile.isEmpty()) {
            deleteOldImage(existingDuyuru.getResimYolu());
            String fileName = saveImageFile(imageFile);
            existingDuyuru.setResimYolu("uploads/" + fileName);
            log.info(" Yeni resim kaydedildi: {}", fileName);
        }
        
        existingDuyuru.setUpdatedBy("ADMIN");
        Duyuru updatedDuyuru = duyuruRepository.save(existingDuyuru);
        
        // Cache'i temizle
        clearCache();
        
        log.info(" Resimli duyuru güncellendi - Cache temizlendi");
        
        return duyuruMapper.toResponseDto(updatedDuyuru);
    }
    
    //  CACHE INVALIDATION: Duyuru silindiğinde cache'i temizle
    public void deleteDuyuru(Long id) {
        log.info(" Duyuru siliniyor: {}", id);
        
        duyuruRepository.findById(id).ifPresent(duyuru -> {
            deleteOldImage(duyuru.getResimYolu());
            duyuruRepository.delete(duyuru);
            
            // Cache'i temizle
            clearCache();
            
            log.info(" Duyuru silindi - Cache temizlendi");
        });
    }
    
    // Arama cache'lenmez çünkü dinamik
    public List<DuyuruResponseDto> searchDuyurular(String konu) {
        log.info(" Duyuru aranıyor: {}", konu);
        List<Duyuru> duyurular = duyuruRepository.findByKonuContainingIgnoreCase(konu);
        return duyuruMapper.toResponseDtoList(duyurular);
    }
    
    // Resim dosyası kaydetme
    private String saveImageFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return fileName;
    }
    
    // Eski resmi silme
    private void deleteOldImage(String imagePath) {
        if (imagePath != null && !imagePath.isEmpty()) {
            try {
                String fileName = imagePath.replace("uploads/", "");
                Path filePath = Paths.get(uploadDir, fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                log.error("Eski resim silinirken hata: {}", e.getMessage());
            }
        }
    }
}
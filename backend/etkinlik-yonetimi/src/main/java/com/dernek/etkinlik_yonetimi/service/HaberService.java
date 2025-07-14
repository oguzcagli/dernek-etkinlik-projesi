package com.dernek.etkinlik_yonetimi.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.dernek.etkinlik_yonetimi.dto.request.CreateHaberDto;
import com.dernek.etkinlik_yonetimi.dto.response.HaberResponseDto;
import com.dernek.etkinlik_yonetimi.entity.Haber;
import com.dernek.etkinlik_yonetimi.mapper.HaberMapper;
import com.dernek.etkinlik_yonetimi.repository.HaberRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class HaberService {

    @Autowired
    private HaberRepository haberRepository;

    @Autowired
    private HaberMapper haberMapper;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    //  REDIS CACHE: Aktif haberleri cache'le (bugün dahil yayınlanmış olanlar)
    @Cacheable(value = "activeHaberler")
    public List<HaberResponseDto> getActiveHaberler() {
        log.info(" Cache MISS - Database'den aktif haberler getiriliyor...");
        
        // Bugünün sonuna kadar olan haberleri göster (23:59:59)
        LocalDateTime endOfToday = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        
        List<Haber> haberler = haberRepository.findActiveNews(endOfToday);
        log.info(" {} aktif haber bulundu (bugün dahil: {})", haberler.size(), endOfToday);
        
        //  DEBUG LOG: Aktif haberler için kategori kontrolü
        haberler.forEach(h -> log.info(" Aktif haber: ID={}, Kategori={}", h.getId(), h.getKategori()));
        
        return haberMapper.toResponseDtoList(haberler);
    }

    //  YENİ: Zamanlanmış haberleri getir (yarından sonraki)
    @Cacheable(value = "scheduledHaberler")
    public List<HaberResponseDto> getScheduledHaberler() {
        log.info(" Cache MISS - Database'den zamanlanmış haberler getiriliyor...");
        
        // Bugünün sonundan sonraki haberleri getir
        LocalDateTime endOfToday = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        
        List<Haber> haberler = haberRepository.findScheduledNews(endOfToday);
        log.info(" {} zamanlanmış haber bulundu (yarından sonra: {})", haberler.size(), endOfToday);
        
        //  DEBUG LOG: Zamanlanmış haberler için kategori kontrolü
        haberler.forEach(h -> log.info(" Zamanlanmış haber: ID={}, Kategori={}", h.getId(), h.getKategori()));
        
        return haberMapper.toResponseDtoList(haberler);
    }

    //  REDIS CACHE: Tüm haberleri cache'le (admin için)
    @Cacheable(value = "allHaberler")
    public List<HaberResponseDto> getAllHaberler() {
        log.info(" Cache MISS - Database'den tüm haberler getiriliyor...");
        List<Haber> haberler = haberRepository.findAll();
        log.info(" {} haber bulundu", haberler.size());
        
        //  DEBUG LOG: Tüm haberler için kategori kontrolü
        haberler.forEach(h -> log.info(" DB'den gelen haber: ID={}, Kategori={}", h.getId(), h.getKategori()));
        
        List<HaberResponseDto> responseDtoList = haberMapper.toResponseDtoList(haberler);
        
        //  DEBUG LOG: Response DTO'larda kategori kontrolü
        responseDtoList.forEach(dto -> log.info(" Response DTO: ID={}, Kategori={}", dto.getId(), dto.getKategori()));
        
        return responseDtoList;
    }

    //  REDIS CACHE: Tek haber cache'le
    @Cacheable(value = "haber", key = "#id")
    public HaberResponseDto getHaberById(Long id) {
        log.info(" Cache MISS - Database'den haber getiriliyor: {}", id);
        Haber haber = haberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Haber bulunamadı: " + id));
        
        log.info(" Tekil haber kategori: {}", haber.getKategori());
        
        HaberResponseDto response = haberMapper.toResponseDto(haber);
        log.info(" Tekil haber response kategori: {}", response.getKategori());
        
        return response;
    }

    //  CACHE INVALIDATION: Yeni haber eklendiğinde cache'i temizle
    @CacheEvict(value = {"activeHaberler", "allHaberler", "scheduledHaberler"}, allEntries = true)
    public HaberResponseDto createHaber(CreateHaberDto createDto) {
        log.info(" Yeni haber oluşturuluyor: {}", createDto.getKonu());
        log.info(" Service'e gelen kategori (createHaber): {}", createDto.getKategori());
        
        Haber haber = haberMapper.toEntity(createDto);
        log.info(" Entity'deki kategori (createHaber): {}", haber.getKategori());
        
        //  YENİ LOJİK: Eğer geçerlilik tarihi belirtilmemişse, şu anki zamanı yayınlanma tarihi yap
        if (haber.getGecerlilikTarihi() == null) {
            haber.setGecerlilikTarihi(LocalDateTime.now());
            log.info(" Geçerlilik tarihi belirtilmediği için şu anki zaman yayınlanma tarihi olarak set edildi");
        }
        
        haber.setCreatedBy("ADMIN"); // TODO: Security context'ten al

        Haber savedHaber = haberRepository.save(haber);
        log.info(" Kaydedildikten sonra kategori (createHaber): {}", savedHaber.getKategori());
        
        HaberResponseDto response = haberMapper.toResponseDto(savedHaber);
        log.info(" Response'taki kategori (createHaber): {}", response.getKategori());
        
        // Yayınlanma durumunu logla
        if (savedHaber.getGecerlilikTarihi().isAfter(LocalDateTime.now())) {
            log.info(" Haber zamanlanmış olarak kaydedildi - Yayınlanma: {}", savedHaber.getGecerlilikTarihi());
        } else {
            log.info(" Haber aktif olarak kaydedildi - Redis cache temizlendi");
        }

        return response;
    }

    //  CACHE INVALIDATION: Resimli haber oluştur
    @CacheEvict(value = {"activeHaberler", "allHaberler", "scheduledHaberler"}, allEntries = true)
    public HaberResponseDto createHaberWithImage(CreateHaberDto createDto, MultipartFile imageFile) throws IOException {
        log.info(" Resimli haber oluşturuluyor: {}", createDto.getKonu());
        log.info(" Service'e gelen kategori (createHaberWithImage): {}", createDto.getKategori());
        
        Haber haber = haberMapper.toEntity(createDto);
        log.info(" Entity'deki kategori (createHaberWithImage): {}", haber.getKategori());

        // YENİ LOJİK: Eğer geçerlilik tarihi belirtilmemişse, şu anki zamanı yayınlanma tarihi yap
        if (haber.getGecerlilikTarihi() == null) {
            haber.setGecerlilikTarihi(LocalDateTime.now());
            log.info(" Geçerlilik tarihi belirtilmediği için şu anki zaman yayınlanma tarihi olarak set edildi");
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImageFile(imageFile);
            haber.setResimYolu("uploads/" + fileName);
            log.info(" Resim kaydedildi: {}", fileName);
        }

        haber.setCreatedBy("ADMIN");
        Haber savedHaber = haberRepository.save(haber);
        log.info(" Kaydedildikten sonra kategori (createHaberWithImage): {}", savedHaber.getKategori());
        
        HaberResponseDto response = haberMapper.toResponseDto(savedHaber);
        log.info(" Response'taki kategori (createHaberWithImage): {}", response.getKategori());
        
        // Yayınlanma durumunu logla
        if (savedHaber.getGecerlilikTarihi().isAfter(LocalDateTime.now())) {
            log.info(" Resimli haber zamanlanmış olarak kaydedildi - Yayınlanma: {}", savedHaber.getGecerlilikTarihi());
        } else {
            log.info(" Resimli haber aktif olarak kaydedildi - Redis cache temizlendi");
        }

        return response;
    }

    //  CACHE INVALIDATION: Haber güncellendiğinde cache'i temizle
    @CacheEvict(value = {"activeHaberler", "allHaberler", "haber", "scheduledHaberler"}, allEntries = true)
    public HaberResponseDto updateHaber(Long id, CreateHaberDto updateDto) {
        log.info(" Haber güncelleniyor: {}", id);
        log.info(" Güncelleme için gelen kategori: {}", updateDto.getKategori());
        
        Haber existingHaber = haberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Haber bulunamadı: " + id));

        log.info(" Güncellenmeden önce kategori: {}", existingHaber.getKategori());
        
        haberMapper.updateEntityFromDto(existingHaber, updateDto);
        log.info(" Mapper'dan sonra kategori: {}", existingHaber.getKategori());
        
        //  YENİ LOJİK: Eğer güncelleme sırasında geçerlilik tarihi belirtilmemişse, eskisini koru
        if (updateDto.getGecerlilikTarihi() == null && existingHaber.getGecerlilikTarihi() == null) {
            existingHaber.setGecerlilikTarihi(LocalDateTime.now());
            log.info(" Güncelleme sırasında geçerlilik tarihi şu anki zaman olarak set edildi");
        }
        
        existingHaber.setUpdatedBy("ADMIN");

        Haber updatedHaber = haberRepository.save(existingHaber);
        log.info(" Güncelleme sonrası kategori: {}", updatedHaber.getKategori());
        
        HaberResponseDto response = haberMapper.toResponseDto(updatedHaber);
        log.info(" Güncelleme response kategori: {}", response.getKategori());
        
        log.info(" Haber güncellendi - Redis cache temizlendi");

        return response;
    }

    //  CACHE INVALIDATION: Resimli haber güncelle
    @CacheEvict(value = {"activeHaberler", "allHaberler", "haber", "scheduledHaberler"}, allEntries = true)
    public HaberResponseDto updateHaberWithImage(Long id, CreateHaberDto updateDto, MultipartFile imageFile) throws IOException {
        log.info(" Resimli haber güncelleniyor: {}", id);
        log.info(" Resimli güncelleme için gelen kategori: {}", updateDto.getKategori());
        
        Haber existingHaber = haberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Haber bulunamadı: " + id));

        log.info(" Resimli güncellenmeden önce kategori: {}", existingHaber.getKategori());

        haberMapper.updateEntityFromDto(existingHaber, updateDto);
        log.info(" Resimli mapper'dan sonra kategori: {}", existingHaber.getKategori());

        //  YENİ LOJİK: Eğer güncelleme sırasında geçerlilik tarihi belirtilmemişse, eskisini koru
        if (updateDto.getGecerlilikTarihi() == null && existingHaber.getGecerlilikTarihi() == null) {
            existingHaber.setGecerlilikTarihi(LocalDateTime.now());
            log.info(" Güncelleme sırasında geçerlilik tarihi şu anki zaman olarak set edildi");
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            deleteOldImage(existingHaber.getResimYolu());
            String fileName = saveImageFile(imageFile);
            existingHaber.setResimYolu("uploads/" + fileName);
            log.info(" Yeni resim kaydedildi: {}", fileName);
        }

        existingHaber.setUpdatedBy("ADMIN");
        Haber updatedHaber = haberRepository.save(existingHaber);
        log.info(" Resimli güncelleme sonrası kategori: {}", updatedHaber.getKategori());
        
        HaberResponseDto response = haberMapper.toResponseDto(updatedHaber);
        log.info(" Resimli güncelleme response kategori: {}", response.getKategori());
        
        log.info(" Resimli haber güncellendi - Redis cache temizlendi");

        return response;
    }

    //  CACHE INVALIDATION: Haber silindiğinde cache'i temizle
    @CacheEvict(value = {"activeHaberler", "allHaberler", "haber", "scheduledHaberler"}, allEntries = true)
    public void deleteHaber(Long id) {
        log.info(" Haber siliniyor: {}", id);
        
        haberRepository.findById(id).ifPresent(haber -> {
            log.info(" Silinecek haber kategori: {}", haber.getKategori());
            deleteOldImage(haber.getResimYolu());
            haberRepository.delete(haber);
            log.info(" Haber silindi - Redis cache temizlendi");
        });
    }

    //  YENİ: Arama - sadece aktif haberler arasında (kullanıcı için) - bugün dahil
    public List<HaberResponseDto> searchHaberler(String konu) {
        log.info(" Aktif haberler arasında aranıyor: {}", konu);
        
        // Bugünün sonuna kadar olan haberleri ara
        LocalDateTime endOfToday = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        
        List<Haber> haberler = haberRepository.findByKonuContainingIgnoreCaseAndActive(konu, endOfToday);
        
        //  DEBUG LOG: Arama sonuçları için kategori kontrolü
        haberler.forEach(h -> log.info(" Arama sonucu haber: ID={}, Kategori={}", h.getId(), h.getKategori()));
        
        return haberMapper.toResponseDtoList(haberler);
    }

    //  YENİ: Arama - tüm haberler arasında (admin için)
    public List<HaberResponseDto> searchAllHaberler(String konu) {
        log.info(" Tüm haberler arasında aranıyor: {}", konu);
        List<Haber> haberler = haberRepository.findByKonuContainingIgnoreCase(konu);
        
        //  DEBUG LOG: Admin arama sonuçları için kategori kontrolü
        haberler.forEach(h -> log.info(" Admin arama sonucu: ID={}, Kategori={}", h.getId(), h.getKategori()));
        
        return haberMapper.toResponseDtoList(haberler);
    }

    // Resim dosyası kaydetme yardımcı metodu
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

    // Eski resmi silme yardımcı metodu
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
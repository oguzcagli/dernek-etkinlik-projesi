package com.dernek.etkinlik_yonetimi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dernek.etkinlik_yonetimi.dto.request.CreateHaberDto;
import com.dernek.etkinlik_yonetimi.dto.response.ApiResponse;
import com.dernek.etkinlik_yonetimi.dto.response.HaberResponseDto;
import com.dernek.etkinlik_yonetimi.service.HaberService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/haberler")
@RequiredArgsConstructor
public class HaberController {

    private final HaberService haberService;
    private final ObjectMapper objectMapper;

    // PUBLIC ENDPOINTS
    @GetMapping
    public ResponseEntity<ApiResponse<List<HaberResponseDto>>> getActiveHaberler() {
        log.info(" Aktif haberler getiriliyor...");
        List<HaberResponseDto> haberler = haberService.getActiveHaberler();
        log.info("{} aktif haber döndürüldü", haberler.size());
        return ResponseEntity.ok(ApiResponse.success(haberler));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HaberResponseDto>> getHaberById(@PathVariable Long id) {
        log.info(" Haber getiriliyor - ID: {}", id);
        HaberResponseDto haber = haberService.getHaberById(id);
        return ResponseEntity.ok(ApiResponse.success(haber));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<HaberResponseDto>>> searchHaberler(
            @RequestParam String konu) {
        log.info(" Haber aranıyor - Konu: {}", konu);
        List<HaberResponseDto> haberler = haberService.searchHaberler(konu);
        log.info(" {} haber bulundu", haberler.size());
        return ResponseEntity.ok(ApiResponse.success(haberler));
    }

    // ADMIN ENDPOINTS
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<HaberResponseDto>>> getAllHaberler() {
        log.info(" Tüm haberler getiriliyor (admin)...");
        List<HaberResponseDto> haberler = haberService.getAllHaberler();
        log.info(" {} haber döndürüldü", haberler.size());
        return ResponseEntity.ok(ApiResponse.success(haberler));
    }

    // JSON ile haber oluşturma (resim yok)
    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<HaberResponseDto>> createHaber(
            @Valid @RequestBody CreateHaberDto dto) {
        log.info(" Haber oluşturuluyor - Konu: {}", dto.getKonu());
        log.info(" Gelen kategori: {}", dto.getKategori());
        
        HaberResponseDto haber = haberService.createHaber(dto);
        
        log.info(" Haber başarıyla oluşturuldu - ID: {}", haber.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Haber başarıyla oluşturuldu", haber));
    }

    // Resimli haber oluşturma - @RequestPart kullanılıyor
    @PostMapping(value = "/admin/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HaberResponseDto>> createHaberWithImage(
            @RequestPart("haber") String haberJson,
            @RequestPart(value = "resim", required = false) MultipartFile resim) {

        try {
            log.info(" Gelen JSON: {}", haberJson);
            
            // ObjectMapper'ı Java Time ile yapılandır
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            
            // JSON string'i CreateHaberDto'ya çevir
            CreateHaberDto dto = mapper.readValue(haberJson, CreateHaberDto.class);
            
            log.info(" Parse edilen kategori: {}", dto.getKategori());
            log.info(" Resimli haber oluşturuluyor - Konu: {}", dto.getKonu());
            
            if (resim != null && !resim.isEmpty()) {
                log.info(" Resim dosyası alındı: {} ({})", resim.getOriginalFilename(), resim.getSize());
            }

            HaberResponseDto haber = haberService.createHaberWithImage(dto, resim);
            
            log.info(" Resimli haber başarıyla oluşturuldu - ID: {}", haber.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Resimli haber başarıyla oluşturuldu", haber));

        } catch (Exception e) {
            log.error(" Resimli haber oluşturma hatası: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Haber oluşturulurken hata oluştu: " + e.getMessage(), 400));
        }
    }

    // JSON ile haber güncelleme (resim yok)
    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<HaberResponseDto>> updateHaber(
            @PathVariable Long id,
            @Valid @RequestBody CreateHaberDto updateDto) {
        log.info(" Haber güncelleniyor - ID: {}, Konu: {}", id, updateDto.getKonu());
        log.info(" Güncellenecek kategori: {}", updateDto.getKategori());
        
        HaberResponseDto dto = haberService.updateHaber(id, updateDto);
        
        log.info(" Haber başarıyla güncellendi - ID: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Haber başarıyla güncellendi", dto));
    }

    // Resimli haber güncelleme - @RequestPart kullanılıyor
    @PutMapping(value = "/admin/{id}/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HaberResponseDto>> updateHaberWithImage(
            @PathVariable Long id,
            @RequestPart("haber") String haberJson,
            @RequestPart(value = "resim", required = false) MultipartFile resim) {

        try {
            log.info(" Güncelleme için gelen JSON: {}", haberJson);
            
            // ObjectMapper'ı Java Time ile yapılandır
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            
            // JSON string'i CreateHaberDto'ya çevir
            CreateHaberDto dto = mapper.readValue(haberJson, CreateHaberDto.class);
            
            log.info(" Parse edilen kategori: {}", dto.getKategori());
            log.info(" Resimli haber güncelleniyor - ID: {}, Konu: {}", id, dto.getKonu());
            
            if (resim != null && !resim.isEmpty()) {
                log.info(" Yeni resim dosyası alındı: {} ({})", resim.getOriginalFilename(), resim.getSize());
            } else {
                log.info(" Resim güncellenmeyecek");
            }

            HaberResponseDto haber = haberService.updateHaberWithImage(id, dto, resim);
            
            log.info(" Resimli haber başarıyla güncellendi - ID: {}", id);
            return ResponseEntity.ok(ApiResponse.success("Haber başarıyla güncellendi", haber));

        } catch (Exception e) {
            log.error(" Resimli haber güncelleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Haber güncellenirken hata oluştu: " + e.getMessage(), 400));
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHaber(@PathVariable Long id) {
        log.info(" Haber siliniyor - ID: {}", id);
        haberService.deleteHaber(id);
        log.info(" Haber başarıyla silindi - ID: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Haber başarıyla silindi"));
    }

    @GetMapping("/admin/scheduled")
    public ResponseEntity<ApiResponse<List<HaberResponseDto>>> getScheduledHaberler() {
        log.info(" Zamanlanmış haberler getiriliyor...");
        List<HaberResponseDto> haberler = haberService.getScheduledHaberler();
        log.info(" {} zamanlanmış haber döndürüldü", haberler.size());
        return ResponseEntity.ok(ApiResponse.success(haberler));
    }

    @GetMapping("/admin/search")
    public ResponseEntity<ApiResponse<List<HaberResponseDto>>> searchAllHaberler(
            @RequestParam String konu) {
        log.info(" Tüm haberler arasında aranıyor - Konu: {}", konu);
        List<HaberResponseDto> haberler = haberService.searchAllHaberler(konu);
        log.info(" {} haber bulundu", haberler.size());
        return ResponseEntity.ok(ApiResponse.success(haberler));
    }
}
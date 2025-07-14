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

import com.dernek.etkinlik_yonetimi.dto.request.CreateDuyuruDto;
import com.dernek.etkinlik_yonetimi.dto.response.ApiResponse;
import com.dernek.etkinlik_yonetimi.dto.response.DuyuruResponseDto;
import com.dernek.etkinlik_yonetimi.service.DuyuruService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/duyurular")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DuyuruController {
    
    private final DuyuruService duyuruService;
    private final ObjectMapper objectMapper;
    
    // Sadece yayınlanmış duyuruları getir (geçerlilik tarihi bugün veya öncesi)
    @GetMapping
    public ResponseEntity<ApiResponse<List<DuyuruResponseDto>>> getActiveDuyurular() {
        List<DuyuruResponseDto> duyurular = duyuruService.getActiveDuyurular();
        return ResponseEntity.ok(ApiResponse.success(duyurular));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DuyuruResponseDto>> getDuyuruById(@PathVariable Long id) {
        DuyuruResponseDto duyuru = duyuruService.getDuyuruById(id);
        return ResponseEntity.ok(ApiResponse.success(duyuru));
    }

    // Sadece aktif duyurular arasında arama yap
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DuyuruResponseDto>>> searchDuyurular(@RequestParam String konu) {
        List<DuyuruResponseDto> duyurular = duyuruService.searchDuyurular(konu);
        return ResponseEntity.ok(ApiResponse.success(duyurular));
    }

    
    // Tüm duyuruları getir (aktif + zamanlanmış)
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<DuyuruResponseDto>>> getAllDuyurular() {
        List<DuyuruResponseDto> duyurular = duyuruService.getAllDuyurular();
        return ResponseEntity.ok(ApiResponse.success(duyurular));
    }

    // JSON ile duyuru oluşturma (resim yok)
    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<DuyuruResponseDto>> createDuyuru(
            @Valid @RequestBody CreateDuyuruDto createDto,
            HttpServletRequest request) {
        DuyuruResponseDto dto = duyuruService.createDuyuru(createDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Duyuru oluşturuldu", dto));
    }

    // YENİ: JSON + File ayrı ayrı yaklaşımı
    @PostMapping(value = "/admin/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DuyuruResponseDto>> createDuyuruWithImage(
            @RequestPart("duyuru") String duyuruJson,
            @RequestPart(value = "resim", required = false) MultipartFile resim) {

        try {
            // JSON string'i CreateDuyuruDto'ya çevir
            CreateDuyuruDto dto = objectMapper.readValue(duyuruJson, CreateDuyuruDto.class);

            log.info(" Resimli duyuru oluşturuluyor - Konu: {}, Yayınlanma: {}", 
                dto.getKonu(), dto.getGecerlilikTarihi());

            DuyuruResponseDto duyuru = duyuruService.createDuyuruWithImage(dto, resim);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Resimli duyuru başarıyla oluşturuldu", duyuru));

        } catch (Exception e) {
            log.error(" Duyuru oluşturma hatası: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Duyuru oluşturulurken hata oluştu: " + e.getMessage(), 400));
        }
    }

    // JSON ile duyuru güncelleme (resim yok)
    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<DuyuruResponseDto>> updateDuyuru(
            @PathVariable Long id,
            @Valid @RequestBody CreateDuyuruDto updateDto,
            HttpServletRequest request) {
        DuyuruResponseDto dto = duyuruService.updateDuyuru(id, updateDto);
        return ResponseEntity.ok(ApiResponse.success("Duyuru güncellendi", dto));
    }

    // YENİ: JSON + File ayrı ayrı yaklaşımı (update)
    @PutMapping(value = "/admin/{id}/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DuyuruResponseDto>> updateDuyuruWithImage(
            @PathVariable Long id,
            @RequestPart("duyuru") String duyuruJson,
            @RequestPart(value = "resim", required = false) MultipartFile resim) {

        try {
            // JSON string'i CreateDuyuruDto'ya çevir
            CreateDuyuruDto dto = objectMapper.readValue(duyuruJson, CreateDuyuruDto.class);

            log.info(" Resimli duyuru güncelleniyor - ID: {}, Konu: {}, Yayınlanma: {}", 
                id, dto.getKonu(), dto.getGecerlilikTarihi());

            DuyuruResponseDto duyuru = duyuruService.updateDuyuruWithImage(id, dto, resim);
            return ResponseEntity.ok(ApiResponse.success("Duyuru başarıyla güncellendi", duyuru));

        } catch (Exception e) {
            log.error(" Duyuru güncelleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Duyuru güncellenirken hata oluştu: " + e.getMessage(), 400));
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDuyuru(@PathVariable Long id) {
        duyuruService.deleteDuyuru(id);
        return ResponseEntity.ok(ApiResponse.success("Duyuru silindi"));
    }
}
package com.dernek.etkinlik_yonetimi.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Duyuru response için DTO
 * Lombok ile getter/setter otomatik oluşturuluyor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DuyuruResponseDto {
    
    private Long id;
    private String konu;
    private String icerik;
    private LocalDateTime gecerlilikTarihi;
    private String resimYolu;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private Boolean isActive;
}
package com.dernek.etkinlik_yonetimi.dto.response;

import java.time.LocalDateTime;

import com.dernek.etkinlik_yonetimi.entity.Kategori;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Haber response için DTO
 * Lombok ile getter/setter otomatik oluşturuluyor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class HaberResponseDto {
    
    private Long id;
    private String konu;
    private String icerik;
    private LocalDateTime gecerlilikTarihi;
    private String haberLinki;
    private String resimYolu;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private Boolean isActive;
    private Kategori kategori;
}
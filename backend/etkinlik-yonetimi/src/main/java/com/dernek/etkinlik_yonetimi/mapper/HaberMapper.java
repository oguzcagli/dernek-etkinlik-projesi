package com.dernek.etkinlik_yonetimi.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.dernek.etkinlik_yonetimi.dto.request.CreateHaberDto;
import com.dernek.etkinlik_yonetimi.dto.response.HaberResponseDto;
import com.dernek.etkinlik_yonetimi.entity.Haber;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class HaberMapper {
    
    // Service'deki hatalı çağrılar için - sadece DTO parametre alan
    public Haber toEntity(CreateHaberDto dto) {
        log.info(" MAPPER toEntity - Input DTO Kategori: {}", dto.getKategori());
        
        Haber haber = new Haber();
        haber.setKonu(dto.getKonu());
        haber.setIcerik(dto.getIcerik());
        haber.setGecerlilikTarihi(dto.getGecerlilikTarihi());
        haber.setHaberLinki(dto.getHaberLinki());
        haber.setKategori(dto.getKategori());
        
        log.info(" MAPPER toEntity - Output Haber Kategori: {}", haber.getKategori());
        return haber;
    }
    
    // Overload - createdBy ile
    public Haber toEntity(CreateHaberDto dto, String createdBy) {
        Haber haber = toEntity(dto);
        haber.setCreatedBy(createdBy);
        return haber;
    }
    
    public HaberResponseDto toResponseDto(Haber haber) {
        log.info(" MAPPER toResponseDto - Input Haber ID: {}, Kategori: {}", haber.getId(), haber.getKategori());
        
        HaberResponseDto dto = HaberResponseDto.builder()
                .id(haber.getId())
                .konu(haber.getKonu())
                .icerik(haber.getIcerik())
                .gecerlilikTarihi(haber.getGecerlilikTarihi())
                .haberLinki(haber.getHaberLinki())
                .resimYolu(haber.getResimYolu())
                .createdTime(haber.getCreatedTime())
                .updatedTime(haber.getUpdatedTime())
                .isActive(haber.getIsActive())
                .kategori(haber.getKategori())  // Bu field var
                .build();
        
        log.info(" MAPPER toResponseDto - Output DTO ID: {}, Kategori: {}", dto.getId(), dto.getKategori());
        return dto;
    }
    
    public List<HaberResponseDto> toResponseDtoList(List<Haber> haberList) {
        log.info(" MAPPER toResponseDtoList - {} haber işlenecek", haberList.size());
        
        List<HaberResponseDto> dtoList = haberList.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
        
        log.info(" MAPPER toResponseDtoList - {} DTO oluşturuldu", dtoList.size());
        
        // İlk birkaç DTO'nun kategori durumunu kontrol et
        dtoList.stream().limit(3).forEach(dto -> 
            log.info(" MAPPER List içinde - DTO ID: {}, Kategori: {}", dto.getId(), dto.getKategori())
        );
        
        return dtoList;
    }
    
    public void updateEntityFromDto(Haber entity, CreateHaberDto dto) {
        log.info(" MAPPER updateEntityFromDto - Input DTO Kategori: {}", dto.getKategori());
        log.info(" MAPPER updateEntityFromDto - Entity öncesi Kategori: {}", entity.getKategori());
        
        entity.setKonu(dto.getKonu());
        entity.setIcerik(dto.getIcerik());
        entity.setGecerlilikTarihi(dto.getGecerlilikTarihi());
        entity.setHaberLinki(dto.getHaberLinki());
        entity.setKategori(dto.getKategori());
        
        log.info(" MAPPER updateEntityFromDto - Entity sonrası Kategori: {}", entity.getKategori());
    }
}
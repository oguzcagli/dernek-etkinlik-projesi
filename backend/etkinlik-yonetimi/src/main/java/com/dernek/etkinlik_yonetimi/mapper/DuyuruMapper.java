package com.dernek.etkinlik_yonetimi.mapper;

import com.dernek.etkinlik_yonetimi.dto.request.CreateDuyuruDto;
import com.dernek.etkinlik_yonetimi.dto.response.DuyuruResponseDto;
import com.dernek.etkinlik_yonetimi.entity.Duyuru;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DuyuruMapper {
    
    // Service'deki hatalı çağrılar için - sadece DTO parametre alan
    public Duyuru toEntity(CreateDuyuruDto dto) {
        Duyuru duyuru = new Duyuru();
        duyuru.setKonu(dto.getKonu());
        duyuru.setIcerik(dto.getIcerik());
        duyuru.setGecerlilikTarihi(dto.getGecerlilikTarihi());
        return duyuru;
    }
    
    // Overload - createdBy ile
    public Duyuru toEntity(CreateDuyuruDto dto, String createdBy) {
        Duyuru duyuru = toEntity(dto);
        duyuru.setCreatedBy(createdBy);
        return duyuru;
    }
    
    public DuyuruResponseDto toResponseDto(Duyuru duyuru) {
        return DuyuruResponseDto.builder()
                .id(duyuru.getId())
                .konu(duyuru.getKonu())
                .icerik(duyuru.getIcerik())
                .gecerlilikTarihi(duyuru.getGecerlilikTarihi())
                .resimYolu(duyuru.getResimYolu())
                .createdTime(duyuru.getCreatedTime())
                .updatedTime(duyuru.getUpdatedTime())
                .isActive(duyuru.getIsActive())
                .build();
    }
    
    public List<DuyuruResponseDto> toResponseDtoList(List<Duyuru> duyuruList) {
        return duyuruList.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }
    
    public void updateEntityFromDto(Duyuru entity, CreateDuyuruDto dto) {
        entity.setKonu(dto.getKonu());
        entity.setIcerik(dto.getIcerik());
        entity.setGecerlilikTarihi(dto.getGecerlilikTarihi());
    }
}
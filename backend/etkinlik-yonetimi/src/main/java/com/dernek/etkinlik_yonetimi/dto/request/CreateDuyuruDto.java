// CreateDuyuruDto.java
package com.dernek.etkinlik_yonetimi.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDuyuruDto {
    @NotBlank(message = "Konu boş olamaz")
    @Size(max = 1000, message = "Konu maksimum 1000 karakter olabilir")
    private String konu;

    @NotBlank(message = "İçerik boş olamaz")
    private String icerik;

    private LocalDateTime gecerlilikTarihi;
}

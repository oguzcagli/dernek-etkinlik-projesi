package com.dernek.etkinlik_yonetimi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
// @AllArgsConstructor'ı kaldırdım - inheritance'da problem yaratıyor
@Entity
@DiscriminatorValue("HABER")
public class Haber extends Etkinlik {
    
    @Column(name = "haber_linki")
    private String haberLinki;
    
    // Manuel constructor gerekirse buraya yazabilirsin
    public Haber(String konu, String icerik, String haberLinki) {
        super();
        this.setKonu(konu);
        this.setIcerik(icerik);
        this.haberLinki = haberLinki;
    }
}
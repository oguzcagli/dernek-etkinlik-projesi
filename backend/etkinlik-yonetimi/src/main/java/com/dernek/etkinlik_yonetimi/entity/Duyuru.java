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
@DiscriminatorValue("DUYURU")
public class Duyuru extends Etkinlik {
    
    @Column(name = "oncelik_seviyesi")
    private Integer oncelikSeviyesi = 1;
    
    @Column(name = "hedef_grup", length = 200)
    private String hedefGrup;
    
    // Manuel constructor gerekirse buraya yazabilirsin
    public Duyuru(String konu, String icerik) {
        super();
        this.setKonu(konu);
        this.setIcerik(icerik);
    }
}
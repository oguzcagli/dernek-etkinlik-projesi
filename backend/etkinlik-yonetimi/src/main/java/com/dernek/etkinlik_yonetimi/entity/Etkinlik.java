package com.dernek.etkinlik_yonetimi.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "etkinlikler")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tur")
public class Etkinlik {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "konu", nullable = false, length = 1000)
    private String konu;
    
    @Column(name = "icerik", nullable = false, columnDefinition = "TEXT")
    private String icerik;
    
    @Column(name = "gecerlilik_tarihi")
    private LocalDateTime gecerlilikTarihi;
    
    @Column(name = "resim_yolu")
    private String resimYolu;

    // İlişki düzeltildi
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "kategori_id", nullable = true)
    private Kategori kategori;
    
    @CreationTimestamp
    @Column(name = "created_time", nullable = false, updatable = false)
    private LocalDateTime createdTime;
    
    @UpdateTimestamp
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
    
    @Column(name = "created_by", length = 100)
    private String createdBy;
    
    @Column(name = "updated_by", length = 100)
    private String updatedBy;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
}
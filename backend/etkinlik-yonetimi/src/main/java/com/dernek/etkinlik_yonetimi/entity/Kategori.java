package com.dernek.etkinlik_yonetimi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "kategoriler")  // Table name ekledim
public class Kategori {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Strategy ekledim
    private Long id;
    
    @Column(name = "ad", nullable = false, length = 100)  // Column constraint ekledim
    private String ad;
}
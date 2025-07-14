package com.dernek.etkinlik_yonetimi.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dernek.etkinlik_yonetimi.entity.Duyuru;

@Repository
public interface DuyuruRepository extends JpaRepository<Duyuru, Long> {
    
    // YAYINLANMIŞ DUYURULAR: Yayın tarihi şu an veya öncesi olan duyurular
    @Query("SELECT d FROM Duyuru d WHERE DATE(d.gecerlilikTarihi) <= DATE(:now) ORDER BY d.gecerlilikTarihi DESC")
    List<Duyuru> findActiveAnnouncements(@Param("now") LocalDateTime now);
    
    List<Duyuru> findByKonuContainingIgnoreCase(String konu);
}
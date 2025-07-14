package com.dernek.etkinlik_yonetimi.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dernek.etkinlik_yonetimi.entity.Haber;

@Repository
public interface HaberRepository extends JpaRepository<Haber, Long> {
    
    // YENİ: Bugün ve önceki tarihlerdeki haberler (saat gözetmeksizin)
    @Query("SELECT h FROM Haber h WHERE DATE(h.gecerlilikTarihi) <= DATE(:now) ORDER BY h.gecerlilikTarihi DESC")
    
    List<Haber> findActiveNews(LocalDateTime now);
    
    // YENİ: Yarından sonraki haberler (zamanlanmış)
    @Query("SELECT h FROM Haber h WHERE DATE(h.gecerlilikTarihi) > DATE(:now) ORDER BY h.gecerlilikTarihi ASC")
    List<Haber> findScheduledNews(LocalDateTime now);
    
    // YENİ: Belirli tarih aralığındaki haberler
    @Query("SELECT h FROM Haber h WHERE h.gecerlilikTarihi BETWEEN :startDate AND :endDate ORDER BY h.gecerlilikTarihi DESC")
    List<Haber> findNewsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Konu ile arama - sadece bugün ve önceki günlerdeki haberler
    @Query("SELECT h FROM Haber h WHERE h.konu LIKE %:konu% AND DATE(h.gecerlilikTarihi) <= DATE(:now) ORDER BY h.gecerlilikTarihi DESC")
    List<Haber> findByKonuContainingIgnoreCaseAndActive(String konu, LocalDateTime now);
    
    // Konu ile arama - tüm haberler (admin için)
    List<Haber> findByKonuContainingIgnoreCase(String konu);
}
-- Bu dosya src/main/resources/data.sql olarak kaydedilmeli
-- Spring Boot başlarken otomatik çalışacak
-- Kategoriler tablosu için temel veriler
INSERT INTO kategoriler (id, ad)
VALUES (1, 'Genel'),
    (2, 'Spor'),
    (3, 'Kültür'),
    (4, 'Eğitim'),
    (5, 'Teknoloji'),
    (6, 'Sanat'),
    (7, 'Bilim'),
    (8, 'Sağlık'),
    (9, 'Sosyal'),
    (10, 'Ekonomi') ON CONFLICT (id) DO NOTHING;
-- Kategoriler sequence'ını güncelle
SELECT setval(
        'kategoriler_id_seq',
        (
            SELECT MAX(id)
            FROM kategoriler
        )
    );
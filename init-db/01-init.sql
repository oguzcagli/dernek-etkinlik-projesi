-- Bu dosya init-db/01-init.sql olarak kaydedilmeli
-- Docker container ilk başladığında çalışacak
-- Kategoriler tablosu için temel veriler
CREATE TABLE IF NOT EXISTS kategoriler (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(255) NOT NULL UNIQUE
);
-- Temel kategorileri ekle
INSERT INTO kategoriler (id, ad)
VALUES (1, 'Genel'),
    (2, 'Spor'),
    (3, 'Kültür'),
    (4, 'Eğitim'),
    (5, 'Sağlık'),
    (6, 'Sanat'),
    (7, 'Bilim'),
    (8, 'Sağlık'),
    (9, 'Sosyal'),
    (10, 'Ekonomi') ON CONFLICT (id) DO NOTHING;
-- Sequence'ı güncelle
SELECT setval(
        'kategoriler_id_seq',
        (
            SELECT MAX(id)
            FROM kategoriler
        )
    );
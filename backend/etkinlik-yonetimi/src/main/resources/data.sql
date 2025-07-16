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
-- Örnek haberler (opsiyonel - kaldırabilirsiniz)
INSERT INTO etkinlikler (
        konu,
        icerik,
        gecerlilik_tarihi,
        kategori_id,
        tur,
        is_active,
        created_time,
        created_by,
        updated_time,
        updated_by
    )
VALUES (
        'Dernek Sistemi Açıldı',
        'Dernek yönetim sistemi başarıyla hayata geçirildi. Artık tüm etkinliklerimizi bu sistemden takip edebilirsiniz.',
        '2025-12-31 23:59:59',
        1,
        'HABER',
        true,
        NOW(),
        'sistem',
        NOW(),
        'sistem'
    ),
    (
        'Hoş Geldiniz Duyurusu',
        'Dernek üyelerimize sistemin açılış duyurusudur. Sistemi aktif olarak kullanmaya başlayabilirsiniz.',
        '2025-12-31 23:59:59',
        1,
        'DUYURU',
        true,
        NOW(),
        'sistem',
        NOW(),
        'sistem'
    ) ON CONFLICT DO NOTHING;
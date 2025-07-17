Dernek Etkinlik Yönetim Sistemi
Bu proje, bir dernek için haber ve duyuru yönetim sistemi olarak geliştirilmiş tam stack web uygulamasıdır. Modern teknolojiler kullanılarak Single Table Inheritance pattern ile tasarlanmıştır.
📋 Proje Özeti
Dernek üyeleri için haber ve duyuru paylaşım platformu. Admin paneli üzerinden içerik yönetimi, kullanıcı dostu arayüz ile içerik görüntüleme ve arama funktionalitesi sunmaktadır.
🏗️ Teknoloji Stack
Backend

Java 17
Spring Boot 3.1.0
Spring Data JPA / Hibernate
PostgreSQL 15
Redis (Cache)
Maven (Dependency Management)
Lombok (Code Generation)

Frontend

React 18 + TypeScript
Vite (Build Tool)
Material-UI (MUI)
React Router DOM
Slick Carousel
Context API (State Management)

DevOps & Database

Docker & Docker Compose
PostgreSQL (Ana Veritabanı)
Redis (Cache Layer)

🎯 Ana Özellikler
Kullanıcı Özellikleri

✅ Haberler listeleme ve detay görüntüleme
✅ Duyurular listeleme ve detay görüntüleme
✅ Gelişmiş arama functionalitesi
✅ Responsive (mobil uyumlu) tasarım
✅ Modern carousel slider
✅ Popülerlik tabanlı sorting
✅ Real-time image loading

Admin Panel Özellikleri

🔐 Güvenli admin girişi (admin/dernek123)
➕ CRUD Operasyonları: Oluştur, Oku, Güncelle, Sil
🖼️ Resim yükleme desteği (preview ile)
📅 Zamanlanmış yayınlama
🏷️ Kategori yönetimi (Haberler için)
📊 İstatistik görüntüleme
🎨 Dark theme admin paneli

Teknik Özellikler

🏛️ Single Table Inheritance pattern
🗄️ Redis Cache entegrasyonu
📱 Responsive Design (xs, sm, md, lg breakpoints)
🔍 Global search functionality
🛡️ Input validation ve error handling
📦 File upload sistemi
🔄 Real-time updates
💾 LocalStorage integration (popularite tracking)

📊 Veritabanı Tasarımı
Single Table Inheritance Yapısı
sql-- Etkinlikler tablosu (Base entity)
CREATE TABLE etkinlikler (
    id BIGSERIAL PRIMARY KEY,
    tur VARCHAR(31) NOT NULL, -- Discriminator (HABER/DUYURU)
    konu VARCHAR(1000) NOT NULL,
    icerik TEXT NOT NULL,
    gecerlilik_tarihi TIMESTAMP,
    resim_yolu VARCHAR(255),
    kategori_id BIGINT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Haber-specific fields
    haber_linki VARCHAR(500),
    
    -- Duyuru-specific fields  
    oncelik_seviyesi INTEGER DEFAULT 1,
    hedef_grup VARCHAR(200),
    
    FOREIGN KEY (kategori_id) REFERENCES kategoriler(id)
);

-- Kategoriler tablosu
CREATE TABLE kategoriler (
    id BIGSERIAL PRIMARY KEY,
    ad VARCHAR(100) NOT NULL UNIQUE
);
Entity İlişkileri
Etkinlik (Base)
├── Haber extends Etkinlik
│   ├── haberLinki: String
│   └── kategori: ManyToOne → Kategori
└── Duyuru extends Etkinlik
    ├── oncelikSeviyesi: Integer
    └── hedefGrup: String
🚀 Kurulum ve Çalıştırma
Ön Gereksinimler

Java 17+
Node.js 18+
Docker & Docker Compose
Git

1. Projeyi Klonlayın
bashgit clone <repository-url>
cd DERNEK-ETKINLIK-YONETIMI
2. Docker Servisleri Başlatın
bash# PostgreSQL ve Redis'i başlat
docker-compose up -d

# Servis durumunu kontrol et
docker-compose ps
3. Backend'i Çalıştırın
bashcd backend/etkinlik-yonetimi

# Maven dependencies'i indir
./mvnw clean install

# Spring Boot uygulamasını başlat
./mvnw spring-boot:run
Backend şu adreste çalışacak: http://localhost:8080
4. Frontend'i Çalıştırın
bashcd frontend/vite-project

# NPM dependencies'i indir
npm install

# Development server'ı başlat
npm run dev
Frontend şu adreste çalışacak: http://localhost:5173
🔧 Konfigürasyon
Backend Konfigürasyonu (application.properties)
properties# Database
spring.datasource.url=jdbc:postgresql://localhost:5433/dernek_db
spring.datasource.username=dernek_user
spring.datasource.password=dernek123

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Redis Cache
spring.cache.type=redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# File Upload
spring.servlet.multipart.max-file-size=10MB
file.upload-dir=uploads
Frontend Konfigürasyonu
typescript// API Base URL
const BASE_URL = "http://localhost:8080/api";

// Admin Credentials
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "dernek123"
};
📚 API Endpoints
Haber Endpoints
http# Public Endpoints
GET    /api/haberler                    # Aktif haberleri listele
GET    /api/haberler/{id}               # Tek haber detayı
GET    /api/haberler/search?konu=query  # Haber arama

# Admin Endpoints  
GET    /api/haberler/admin              # Tüm haberler (admin)
POST   /api/haberler/admin              # Yeni haber oluştur
POST   /api/haberler/admin/with-image   # Resimli haber oluştur
PUT    /api/haberler/admin/{id}         # Haber güncelle
PUT    /api/haberler/admin/{id}/with-image # Resimli haber güncelle
DELETE /api/haberler/admin/{id}         # Haber sil
Duyuru Endpoints
http# Public Endpoints
GET    /api/duyurular                   # Aktif duyuruları listele  
GET    /api/duyurular/{id}              # Tek duyuru detayı
GET    /api/duyurular/search?konu=query # Duyuru arama

# Admin Endpoints
GET    /api/duyurular/admin             # Tüm duyurular (admin)
POST   /api/duyurular/admin             # Yeni duyuru oluştur
POST   /api/duyurular/admin/with-image  # Resimli duyuru oluştur  
PUT    /api/duyurular/admin/{id}        # Duyuru güncelle
PUT    /api/duyurular/admin/{id}/with-image # Resimli duyuru güncelle
DELETE /api/duyurular/admin/{id}        # Duyuru sil
🎨 UI/UX Özellikleri
Renk Paleti

Primary: #b5a174 (Altın/Bronz)
Secondary: #d4c49a (Açık Altın)
Background: #121212 (Koyu Siyah)
Paper: #1e1e1e (Koyu Gri)
Text: #ffffff / #b0b0b0

Responsive Breakpoints

xs: 0px+ (Mobile)
sm: 600px+ (Tablet)
md: 900px+ (Desktop)
lg: 1200px+ (Large Desktop)

Component Library

Material-UI Cards - İçerik gösterimi
Slick Carousel - Hero slider
MUI Dialogs - Modal popups
Snackbar - Toast notifications
Fab Button - Floating action button

🔒 Güvenlik
Authentication

Role-based access control
Protected routes (admin paneli)
LocalStorage session management
CORS configuration

Admin Panel Erişimi
Username: admin
Password: dernek123
⚠️ Not: Production'da bu bilgiler environment variables'dan alınmalıdır.
📁 Proje Yapısı
DERNEK-ETKINLIK-YONETIMI/
│
├── backend/etkinlik-yonetimi/          # Spring Boot Backend
│   ├── src/main/java/com/dernek/etkinlik_yonetimi/
│   │   ├── config/                     # Redis, Static File Config
│   │   ├── controller/                 # REST Controllers
│   │   ├── dto/                        # Request/Response DTOs
│   │   ├── entity/                     # JPA Entities
│   │   ├── exception/                  # Global Exception Handler
│   │   ├── mapper/                     # Entity-DTO Mappers
│   │   ├── repository/                 # JPA Repositories
│   │   ├── service/                    # Business Logic
│   │   └── EtkinlikYonetimiApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties      # Configuration
│   │   └── data.sql                    # Initial Data
│   └── pom.xml                        # Maven Dependencies
│
├── frontend/vite-project/              # React Frontend
│   ├── src/
│   │   ├── api/                       # API Service Functions
│   │   ├── auth/                      # Authentication Context
│   │   ├── components/                # Reusable Components
│   │   ├── models/                    # TypeScript Interfaces
│   │   ├── pages/                     # Page Components
│   │   ├── assets/                    # Static Assets
│   │   ├── App.tsx                    # Main App Component
│   │   └── main.tsx                   # Entry Point
│   ├── package.json                   # NPM Dependencies
│   └── vite.config.ts                 # Vite Configuration
│
├── init-db/                           # Database Initialization
│   └── 01-init.sql                    # Database Setup Script
│
├── uploads/                           # File Upload Directory
├── docker-compose.yml                 # Docker Services
└── README.md                          # Documentation
🧪 Test Verisi
Sistem başlatıldığında aşağıdaki test verileri otomatik olarak eklenir:
Kategoriler

Genel - Genel haberler
Spor - Spor haberleri
Kültür - Kültürel etkinlikler
Eğitim - Eğitim haberleri
Teknoloji - Teknoloji haberleri

Sample Data

3 örnek haber (farklı kategorilerde)
2 örnek duyuru (resimli ve resimsiz)

🚀 Deployment
Production Build (Frontend)
bashcd frontend/vite-project
npm run build
# Build dosyaları dist/ klasörüne oluşturulur
Production Configuration
Backend için production profili:
properties# application-prod.properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
🔧 Design Patterns Kullanılan

Single Table Inheritance - Etkinlik base entity'si
Repository Pattern - Data access layer
DTO Pattern - Data transfer objects
Mapper Pattern - Entity-DTO dönüşümleri
Builder Pattern - ApiResponse construction
Factory Pattern - Cache manager configuration
Provider Pattern - React context (AuthProvider)

📈 Performance Optimizations

Redis Cache - Database sorgu cache'leme
Image Optimization - Responsive image loading
Lazy Loading - Component-based code splitting
Pagination - Large dataset handling (ready for future)
Compressed Assets - Optimized build output
Database Indexes - Query performance optimization

🐛 Bilinen Limitasyonlar

File Storage: Dosyalar local filesystem'de saklanıyor (production'da cloud storage önerilir)
Authentication: Basic authentication (JWT token tabanlı sistem önerilir)
Pagination: Frontend'de henüz pagination yok (büyük veri setleri için gerekebilir)
Email Notifications: Yeni içerik bildirimleri yok
Image Compression: Yüklenen resimler otomatik sıkıştırılmıyor

🤝 Katkıda Bulunma

Fork'layın
Feature branch oluşturun (git checkout -b feature/AmazingFeature)
Commit'leyin (git commit -m 'Add some AmazingFeature')
Push'layın (git push origin feature/AmazingFeature)
Pull Request açın

# GÖRÜNÜM AŞAĞIDAKİ GİBİ OLMALIDIR
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/5ef723dd-a5cf-4c91-92a1-568d33b03df5" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/861a218f-b742-4526-b2ee-f46e8578d9e2" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/84ec13d7-c4e0-4807-a516-1d2735195a1a" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/3c64ae45-dcff-48f0-bba7-f20399b1a875" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/07c32ac0-0e22-4c20-b66e-46e7825ec6f1" />

<img width="1916" height="1072" alt="image" src="https://github.com/user-attachments/assets/b5af7498-b09f-4700-b2c2-8212fe8ca10d" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/266840ec-0e25-4551-b7b8-e394dd4f0547" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/97d38045-05c7-4f94-b5ee-654faadd4ece" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/7114d634-c4d6-4049-b07a-4f289f160177" />

<img width="1919" height="1074" alt="image" src="https://github.com/user-attachments/assets/a89a799c-f7b5-4583-ab11-dca4db09ca49" />

<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/2df5ac4d-bee2-426d-a63b-321368ad4f8a" />

<img width="1919" height="1076" alt="image" src="https://github.com/user-attachments/assets/ee1b4698-5ca4-4486-81ee-7edc07ac0e84" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0b8d8945-232c-403b-ac7d-c518f7335b1c" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0e798812-4679-4fff-bc4c-991e31e1c895" />

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/96ab843a-3fbe-4348-99ce-e4eede83f838" />

<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/f453fd53-5a13-4ac0-93db-ace51530f0f8" />

Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

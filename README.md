# dernek-etkinlik-projesi
Dernek Etkinlik Yönetimi” projesi, Spring Boot + Hibernate tabanlı bir backend ile React + TypeScript frontend’i bir araya getirir. PostgreSQL ve Redis önbellekleme kullanılan uygulama, Haberler ve Duyuruların admin paneli üzerinden CRUD işlemlerini; kullanıcı tarafında listeleme, detay görüntüleme ve arama özelliklerini destekler.

# Dernek Etkinlik Yönetimi

Bu proje, bir derneğin web sitesi için Haberler ve Duyurular modüllerini içeren tam yığın (full-stack) bir uygulamadır.

## Özellikler

Admin Panel

Haberler: Oluşturma, güncelleme, silme (CRUD) + resim yükleme

Duyurular: Oluşturma, güncelleme, silme (CRUD) + resim yükleme

Rol tabanlı erişim (admin)

# Kullanıcı Arayüzü

- Haberler: Listeleme, detay görüntüleme, arama, son eklenen ve popüler slider

- Duyurular: Listeleme, detay modal

# Backend

- Java + Spring Boot + Hibernate

- PostgreSQL veritabanı

- Redis önbellekleme (@Cacheable, manuel cache)

- Dosya sistemi tabanlı resim yükleme

- Global exception handling ve validation

- Tek tablo inheritance (Etkinlik base entity)

# Frontend

- React + TypeScript

- Material-UI (MUI) dark theme

- React Router v6

- Fetch API wrapper

- FormData ile resim upload

- Context API tabanlı authentication

# Backend:

- Java 17

- Spring Boot 3.1.0

- Spring Data JPA (Hibernate)

- PostgreSQL

- Redis

- Lombok

# Frontend:

- React 18

- TypeScript

- Material-UI (MUI)

- React Router

- Slick Carousel

Kurulum

Depoları klonlayın:

git clone https://github.com/oguzcagli/dernek-etkinlik-projesi.git

cd dernek-etkinlik-projesi

## Docker ile PostgreSQL ve Redis’i ayağa kaldırın:

docker-compose up -d

# Backend:

cd backend\etkinlik-yonetimi

./mvnw spring-boot:run

# Frontend:

cd frontend\vite-project

npm install

npm run dev

# Kullanım

# Admin:

Giriş: /admin → 

Kullanıcı adı: admin

Şifre: dernek123

Haberler: /admin/haberler

Duyurular: /admin/duyurular

# Kullanıcı:

Haberler: /haberler

Duyurular: /duyurular

## Çevresel Değişkenler

spring.datasource.* (PostgreSQL bağlantısı)

spring.data.redis.* (Redis ayarları)

file.upload-dir (Dosya yükleme dizini)

Frontend: VITE_API_BASE_URL

Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

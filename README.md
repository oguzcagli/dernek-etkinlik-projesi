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

# GÖRÜNÜM AŞAĞIDAKİ GİBİ OLMALIDIR

<img width="711" height="400" alt="image" src="https://github.com/user-attachments/assets/4aa07e3b-6701-491f-8c61-45fc2726eca5" />

<img width="716" height="403" alt="image" src="https://github.com/user-attachments/assets/3276dd59-1327-42b2-883b-3954e83af97f" />

<img width="729" height="410" alt="image" src="https://github.com/user-attachments/assets/415d1705-2222-4aef-87b9-98b95b49fb64" />

<img width="728" height="409" alt="image" src="https://github.com/user-attachments/assets/b00670ab-af3f-43d6-8c98-2d972b150512" />

<img width="730" height="411" alt="image" src="https://github.com/user-attachments/assets/4148b61f-dbff-4c07-a6b3-abdb789d329e" />

<img width="734" height="413" alt="image" src="https://github.com/user-attachments/assets/3897836d-a0a3-4e16-939d-2318a1872e75" />

<img width="744" height="418" alt="image" src="https://github.com/user-attachments/assets/0da62864-48aa-498e-b23d-ba6c768bb261" />

<img width="669" height="376" alt="image" src="https://github.com/user-attachments/assets/04bc8ccd-f6c4-449a-a496-98f2295aa2ca" />

<img width="669" height="376" alt="image" src="https://github.com/user-attachments/assets/39b1d7a3-de86-4a82-a906-d267e80732cf" />

<img width="648" height="364" alt="image" src="https://github.com/user-attachments/assets/03881ed5-ff91-4f09-b870-5643a9d5576f" />

<img width="676" height="380" alt="image" src="https://github.com/user-attachments/assets/b1f9ebdc-f09d-4e22-9cfe-33bbc67224c4" />

<img width="692" height="390" alt="image" src="https://github.com/user-attachments/assets/6a4cd645-85d0-4d8e-8fe2-8151f80df864" />

<img width="708" height="398" alt="image" src="https://github.com/user-attachments/assets/0d942a36-a6b1-48e0-b3c8-40264064756b" />

<img width="671" height="378" alt="image" src="https://github.com/user-attachments/assets/a2d8d3b1-d01b-4eae-8b6c-4771174676b2" />

<img width="640" height="360" alt="image" src="https://github.com/user-attachments/assets/6fe0e654-1e01-4dda-b2e8-de48d7829beb" />

<img width="704" height="395" alt="image" src="https://github.com/user-attachments/assets/290eae5f-3af0-4e57-bb6f-09ffa19b8efc" />

<img width="670" height="377" alt="image" src="https://github.com/user-attachments/assets/0b4b716b-d937-4f8d-be37-d3e0784f6eec" />

Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

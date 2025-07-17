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

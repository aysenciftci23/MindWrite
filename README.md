# 📝 MindWrite – Full Stack Blog Platform

MindWrite, kullanıcıların blog yazıları oluşturabildiği, etkileşime girebildiği ve yönetebildiği
tam kapsamlı bir blog platformudur.  
Proje, modern web teknolojileri kullanılarak **full-stack** olarak geliştirilmiştir.

---

## 🚀 Canlı Demo & Kaynak Kod

**Frontend (Vercel)**  
https://mindwrite-frontend.vercel.app

**Backend API (Render)**  
https://mindwrite-api.onrender.com

**GitHub Repository**  
https://github.com/aysenciftci23/MindWrite

---

## 🔐 Admin Paneli Erişimi

Admin paneli, güvenlik gerekçeleriyle herkese açık değildir.  
Değerlendirme amacıyla erişim talep edenlere, benimle iletişime geçmeleri halinde
geçici erişim bilgileri sağlanacaktır.

---

## 🎯 Proje Amacı

MindWrite’ın amacı;

- Kullanıcıların içerik üretebildiği,
- Yazı ve yorumlar üzerinden etkileşime girebildiği,
- Rol bazlı yetkilendirme ile güvenli bir yönetim sunan  
modern bir blog platformu oluşturmaktır.

---

## 🧩 Kullanılan Teknolojiler

### Frontend
- React (Vite)
- Modern CSS & Responsive Tasarım
- JWT tabanlı kimlik doğrulama

### Backend
- NestJS
- PostgreSQL
- TypeORM (Code-First)
- RESTful API mimarisi
- JWT Authentication & Role-Based Authorization

---

## 👥 Kullanıcı Rolleri

### ✍️ Editor (Standart Kullanıcı)
- Yazı oluşturma, düzenleme ve silme
- Yorum yapma
- Kendi profilini güncelleme

### 🛡️ Admin
- Tüm kullanıcıları listeleme
- Kullanıcı rollerini değiştirme
- Kullanıcı silme
- Tüm yazıları düzenleme / silme

---

## 🗄️ Veritabanı Mimarisi

Veritabanı **PostgreSQL** kullanılarak tasarlanmıştır.

### Entities
- **Users** – Kullanıcı bilgileri ve roller
- **Posts** – Blog yazıları
- **Comments** – Yazılara yapılan yorumlar
- **Tags** – Yazı etiketleri

### İlişkiler

**One-to-Many**
- User → Post
- User → Comment
- Post → Comment

**Many-to-Many**
- Post ↔ Tag (pivot tablo ile)

<img width="1234" height="633" alt="ER Diagram" src="https://github.com/user-attachments/assets/084b4be7-4e5f-4793-b658-3817e873220e" />

---

## 🔌 API Endpointleri (Özet)

### Auth
- `POST /auth/register` – Kullanıcı kaydı
- `POST /auth/login` – Giriş & JWT üretimi
- `GET /auth/profile` – Oturum bilgisi
- `PUT /auth/me` – Profil güncelleme

### Admin
- `GET /admin/users` – Tüm kullanıcılar
- `PUT /admin/users/:id/role` – Rol değiştirme
- `DELETE /admin/users/:id` – Kullanıcı silme

### Posts
- `GET /posts` – Yazıları listele
- `GET /posts/:id` – Yazı detayı
- `POST /posts` – Yeni yazı
- `PUT /posts/:id` – Güncelle
- `DELETE /posts/:id` – Sil

### Comments & Tags
- `POST /comments` – Yorum ekleme
- `GET /comments/post/:postId` – Yorumları listele
- `GET /tags` – Etiketler
- `GET /tags/with-count` – Etiket & yazı sayısı

---

## 🖥️ Frontend Yapısı

### Pages
- Homepage – Yazı akışı
- Login / Register
- PostDetail – Yazı & yorumlar
- Write / EditPost – Markdown editörlü yazı sayfaları
- AdminPanel – Yönetici işlemleri

### Components
- Navbar – Auth durumuna göre dinamik
- ProtectedRoute – Yetkilendirme katmanı
- Layout – Ortak sayfa yapısı

---

## 📸 Uygulama Görselleri

### Ana Sayfa
<img width="831" height="808" alt="Ana Sayfa" src="https://github.com/user-attachments/assets/68304294-950e-4663-974b-f4401f050812" />

### Yazı Detay & Yorumlar
<img width="643" height="314" alt="Yazı Detay" src="https://github.com/user-attachments/assets/3d70e707-c515-4bd7-a463-df82d18c6be7" />
<img width="642" height="310" alt="Yorumlar" src="https://github.com/user-attachments/assets/e02b726b-726c-4467-8529-0625c9f21b89" />

### Profil Sayfası
<img width="647" height="310" alt="Profil" src="https://github.com/user-attachments/assets/7358f42c-e215-4ae5-9488-1a8bb79a2950" />

### Admin Paneli
<img width="648" height="621" alt="Admin Paneli" src="https://github.com/user-attachments/assets/76651b6f-7cbd-431f-8d54-2c86f08c92f5" />

> Görseller proje raporundan alınmıştır ve canlı uygulamada da mevcuttur.

---

## 📌 Notlar

- Proje **CENG 307 – Web Mühendisliği** dersi kapsamında geliştirilmiştir.
- Kod yapısı ölçeklenebilir ve geliştirilmeye açıktır.
- Deployment süreçleri gerçek ortamda test edilmiştir.

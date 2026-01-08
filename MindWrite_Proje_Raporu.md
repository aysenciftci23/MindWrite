# CENG 307 2025-2026 Dönemi Dönem Sonu Projesi Raporu

**Ders:** CENG 307
**Dönem:** 2025-2026
**Proje Adı:** MindWrite

---

## 1. Proje Paylaşım Linkleri

Proje, bulut tabanlı sistemlere deploy edilmiş ve herkesin erişimine açık hale getirilmiştir.

- **Frontend (Canlı Site):** [https://mindwrite-frontend.vercel.app](https://mindwrite-frontend.vercel.app)
- **Backend (API):** [https://mindwrite-api.onrender.com](https://mindwrite-api.onrender.com)
- **GitHub Deposu:** [https://github.com/aysenciftci23/MindWrite](https://github.com/aysenciftci23/MindWrite)

**(Not: Hocanın giriş yapabilmesi için Admin Hesabı: `hoca_test` / `123456`)**

---

## 2. Proje Özeti

**MindWrite**, kullanıcıların fikirlerini özgürce paylaşabildiği, blog yazıları yazabildiği ve diğer kullanıcılarla etkileşime girebildiği modern bir web uygulamasıdır. Proje, **React (Vite)** ile geliştirilen dinamik bir önyüz ve **NestJS** ile geliştirilen güçlü bir arka uç mimarisinden oluşmaktadır.

Sistemde **Admin** ve **Editor** (Standart Kullanıcı) olmak üzere iki temel rol bulunmaktadır:
- **Editor:** Yazı paylaşabilir, güncelleyebilir, silebilir ve diğer yazılara yorum yapabilir.
- **Admin:** Tüm Editor yetkilerine sahiptir. Ek olarak, "Admin Paneli" üzerinden kullanıcıları listeleyebilir, rollerini değiştirebilir veya kullanıcıları silebilir.

---

## 3. Veritabanı Tasarımı ve İlişkiler

Projede **PostgreSQL** veritabanı kullanılmıştır. Veri bütünlüğünü sağlamak adına TypeORM kullanılarak "Code-First" yaklaşımı ile tablolar oluşturulmuştur.

### Varlıklar (Entities) ve Tablolar
Projede toplam **4 ana tablo** bulunmaktadır:

1.  **Users (Kullanıcılar):** Kullanıcı adı, şifre, rol (admin/editor) bilgilerini tutar.
2.  **Posts (Yazılar):** Başlık, içerik, oluşturulma tarihi ve yazar bilgisini tutar.
3.  **Comments (Yorumlar):** Yorum içeriği, yorumu yapan kullanıcı ve ilgili yazı bilgisini tutar.
4.  **Tags (Etiketler):** Yazıları kategorize etmek için kullanılan etiket isimlerini tutar.

### İlişkiler (Relationships)
Proje isterlerini karşılayan ilişkiler şunlardır:

*   **Bire-Çok (One-to-Many):**
    *   **User - Post:** Bir kullanıcının birden fazla yazısı olabilir. (`User` -> `Post[]`)
    *   **User - Comment:** Bir kullanıcı birden fazla yorum yapabilir. (`User` -> `Comment[]`)
    *   **Post - Comment:** Bir yazıya birden fazla yorum yapılabilir. (`Post` -> `Comment[]`)
    
*   **Çoka-Çok (Many-to-Many):**
    *   **Post - Tag:** Bir yazının birden fazla etiketi olabilir. Aynı şekilde, bir etiket birden fazla yazıda kullanılabilir. Bu ilişki için veritabanında ara bir tablo (pivot table) otomatik olarak oluşturulmuştur.

> **(Buraya Veritabanı ER Diyagramı Görseli Eklenecek)**
> *Lütfen DBeaver veya benzeri bir araçtan aldığınız diyagramı buraya ekleyiniz.*

---

## 4. Backend Endpoint Açıklamaları

Backend, RESTful API prensiplerine uygun olarak geliştirilmiştir. Aşağıda controller bazlı endpoint açıklamaları yer almaktadır.

### Auth & Kullanıcı İşlemleri (`AuthController`)
*   `POST /auth/register`: Yeni kullanıcı kaydı oluşturur.
*   `POST /auth/login`: Kullanıcı girişi yapar ve JWT (erişim anahtarı) döner.
*   `GET /auth/check-username`: Kayıt esnasında kullanıcı adının müsait olup olmadığını kontrol eder.
*   `GET /auth/users/:username`: Belirtilen kullanıcı adının profil bilgilerini getirir.
*   `PUT /auth/me`: Giriş yapmış kullanıcının kendi profil bilgilerini güncellemesini sağlar.
*   `GET /auth/profile`: Giriş yapmış kullanıcının oturum bilgilerini doğrular.

### Yönetici İşlemleri (`AdminController`)
*   `GET /admin/users`: Sistemdeki tüm kullanıcıları listeler (Sadece Admin yetkisi ile).
*   `PUT /admin/users/:id/role`: Kullanıcının rolünü (Admin/Editor) değiştirir.
*   `DELETE /admin/users/:id`: Kullanıcıyı süresiz olarak siler/pasifleştirir.

### Yazı İşlemleri (`PostsController`)
*   `GET /posts`: Tüm yayınlanmış yazıları listeler. (Filtreleme destekler).
*   `GET /posts/:id`: ID'si verilen tek bir yazının detaylarını getirir.
*   `POST /posts`: Yeni bir yazı oluşturur. (Etiketler ile birlikte).
*   `PUT /posts/:id`: Var olan bir yazıyı günceller.
*   `DELETE /posts/:id`: Var olan bir yazıyı siler.

### Yorum İşlemleri (`CommentsController`)
*   `POST /comments`: Bir yazıya yeni yorum ekler.
*   `GET /comments/post/:postId`: Bir yazıya ait tüm yorumları listeler.

### Etiket İşlemleri (`TagsController`)
*   `GET /tags`: Sistemdeki tüm etiketleri listeler.
*   `GET /tags/with-count`: Hangi etikette kaç yazı olduğunu sayarak listeler.

---

## 5. Frontend Bileşen Açıklamaları

Frontend tarafında modüler bir yapı kurulmuş, **React** bileşenleri (components) ve sayfalar (pages) ayrılmıştır.

### Sayfalar (`/src/pages`)
*   **Homepage (`Homepage.tsx`):** Ana sayfa. Tüm yazıların listelendiği, etiketlere göre filtreleme yapılabilen akış sayfasıdır.
*   **Login (`login.tsx`):** Kullanıcı giriş sayfası. Başarılı girişte token'ı saklar.
*   **Register (`Register.tsx`):** Yeni üye kayıt formu. Anlık kullanıcı adı kontrolü yapar.
*   **PostDetail (`PostDetail.tsx`):** Yazının tamamının okunduğu sayfadır. Yorumlar burada listelenir ve yeni yorum eklenebilir.
*   **Write (`write.tsx`):** Yeni yazı oluşturma sayfası. Markdown editörü ve etiket seçimi içerir.
*   **EditPost (`EditPost.tsx`):** Kullanıcının kendi yazısını düzenlediği sayfadır.
*   **Profile (`profile.tsx`):** Kullanıcı profili. Kişinin kendi yazılarını listeler ve profil bilgilerini günceller.
*   **AdminPanel (`AdminPanel.tsx`):** Sadece Adminlerin görebildiği yönetim sayfasıdır. Kullanıcı listesi, rol değiştirme ve silme butonları burada bulunur.

### Bileşenler (`/src/components`)
*   **Navbar (`Navbar.tsx`):** Uygulamanın üst menüsü. Giriş durumuna göre (Giriş Yap/Çıkış Yap, Yazı Yaz, Admin Paneli) linklerini dinamik olarak gösterir.
*   **Layout (`Layout.tsx`):** Tüm sayfaların ortak şablonunu (Navbar ve içerik alanı) oluşturur.
*   **ProtectedRoute (`ProtectedRoute.tsx`):** Giriş yapmamış kullanıcıların yetki gerektiren sayfalara (Örn: Yazı Yaz) erişmesini engelleyen güvenlik bileşenidir.

---

> **(Ekran Görüntüleri)**
> *Lütfen uygulamanızdan aldığınız Ana Sayfa, Admin Paneli ve Yazı Detay sayfası gibi ekran görüntülerini raporun sonuna ekleyiniz.*

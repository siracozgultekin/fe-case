# Next.js Case Project

Bu proje Next.js 15, TypeScript, Material-UI ve NextAuth kullanılarak geliştirilmiş bir koleksiyon yönetim uygulamasıdır.

## 🚀 Hızlı Başlangıç

### Docker ile Çalıştırma (Önerilen)

1. **Projeyi klonlayın:**

   ```bash
   git clone [REPO_URL]
   cd nextjs-case
   ```

2. **Docker ile çalıştırın:**

   ```bash
   docker-compose up
   ```

   _İlk kez çalıştırırken veya kod değişikliği yaptıysanız:_

   ```bash
   docker-compose up --build
   ```

3. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

### Manuel Kurulum

Eğer Docker kullanmak istemiyorsanız:

1. **Node.js 18+ yüklü olduğundan emin olun**

2. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

3. **Environment dosyasını oluşturun:**

   ```bash
   cp .env.example .env.local
   ```

4. **Projeyi build edin:**

   ```bash
   npm run build
   ```

5. **Uygulamayı çalıştırın:**
   ```bash
   npm start
   ```

## 🛠 Geliştirme Modu

Geliştirme yapmak için:

```bash
npm run dev
```

## 📦 Kullanılan Teknolojiler

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Material-UI** - UI komponentleri
- **NextAuth.js** - Authentication
- **Zustand** - State management
- **dnd-kit** - Drag and drop
- **Tailwind CSS** - Styling
- **Docker** - Containerization

## 🔧 Özellikler

- ✅ Kullanıcı girişi/çıkışı
- ✅ Koleksiyon listesi görüntüleme
- ✅ Ürün düzenleme ve yönetimi
- ✅ Drag & drop ile sıralama
- ✅ Responsive tasarım
- ✅ TypeScript desteği
- ✅ Docker ile kolay deployment

## 📋 Gereksinimler

- Node.js 18+
- Docker (opsiyonel ama önerilen)
- Modern web tarayıcı

## 🐳 Docker Bilgileri

Proje Docker ile konteynerize edilmiştir:

- **Port:** 3000
- **Base Image:** node:18-alpine
- **Multi-stage build** ile optimize edilmiş

## 📝 Notlar

- Uygulama production mode'da çalıştırılmaktadır
- Tüm TypeScript hatalar çözülmüş ve build başarılıdır
- ESLint kurallarına uygun kod yapısı

---

**Test için:** Projeyi klonladıktan sonra `docker-compose up` komutunu çalıştırın ve http://localhost:3000 adresinden erişin.

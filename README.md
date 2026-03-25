# 📄 PDF Studio

> Modern, tarayıcı tabanlı PDF düzenleme uygulaması. ilovepdf'e benzer şekilde, tüm işlemler doğrudan tarayıcınızda gerçekleşir — dosyalarınız hiçbir sunucuya yüklenmez.

![PDF Studio](https://img.shields.io/badge/PDF%20Studio-v1.0-7c5cfc?style=for-the-badge&logo=adobeacrobatreader)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![pdf-lib](https://img.shields.io/badge/pdf--lib-latest-fc974a?style=for-the-badge)

---

## ✨ Özellikler

| Araç | Açıklama |
|------|----------|
| 🔵 **PDF Birleştir** | Birden fazla PDF'i tek dosyada birleştirin, sıralamasını ayarlayın |
| ✂️ **PDF Böl** | Sayfa aralığına göre veya her sayfayı ayrı dosya olarak kaydedin |
| 💧 **Filigran Ekle** | Metin filigranı ekleyin — renk, şeffaflık ve boyutu ayarlayın |
| 📦 **PDF Sıkıştır** | Dosya boyutunu küçültün, önce/sonra karşılaştırmasını görün |
| 🔄 **Sayfaları Döndür** | Sayfaları 90°/180°/270° döndürün, belirli sayfaları seçin |

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- [Node.js](https://nodejs.org/) v18 veya üzeri

### Adımlar

```bash
# 1. Repoyu klonlayın
git clone https://github.com/efk4roon/pdfudio.git
cd pdfudio

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda **http://localhost:5173** adresini açın.

### Production Build

```bash
npm run build
# Çıktı: dist/ klasörü
```

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Routing | [react-router-dom v6](https://reactrouter.com/) |
| PDF İşleme | [pdf-lib](https://pdf-lib.js.org/) |
| İkonlar | [lucide-react](https://lucide.dev/) |
| Stil | Vanilla CSS (özel tasarım sistemi) |

---

## 📁 Proje Yapısı

```
pdf-studio/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Yapışkan navigasyon çubuğu
│   │   ├── Footer.jsx       # Alt bilgi
│   │   ├── Dropzone.jsx     # Sürükle-bırak yükleme alanı
│   │   └── Toast.jsx        # Bildirim balonu
│   ├── pages/
│   │   ├── Home.jsx         # Ana sayfa — araç tanıtımı
│   │   ├── MergePdf.jsx     # PDF Birleştir
│   │   ├── SplitPdf.jsx     # PDF Böl
│   │   ├── WatermarkPdf.jsx # Filigran Ekle
│   │   ├── CompressPdf.jsx  # PDF Sıkıştır
│   │   └── RotatePdf.jsx    # Sayfaları Döndür
│   ├── App.jsx              # Yönlendirici kök bileşen
│   ├── main.jsx             # React giriş noktası
│   └── index.css            # Global stil sistemi
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔒 Gizlilik

PDF Studio, gizliliğinizi ön planda tutar:

- ✅ **Sıfır sunucu yüklemesi** — tüm işlemler tarayıcıda gerçekleşir
- ✅ **İnternet bağlantısı gerektirmez** — kurulumdan sonra offline çalışır
- ✅ **Veri toplamaz** — analitik veya izleme yoktur

---

## 📜 Lisans

MIT © 2024 [efk4roon](https://github.com/efk4roon)

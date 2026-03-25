import { Link } from 'react-router-dom'
import {
  Layers, Scissors, Droplets, Archive, RotateCw,
  Shield, Zap, Lock, ArrowRight, Star
} from 'lucide-react'

const tools = [
  {
    icon: Layers,
    title: 'PDF Birleştir',
    desc: 'Birden fazla PDF dosyasını tek bir belgede birleştirin. Sıralamayı dilediğiniz gibi ayarlayın.',
    gradient: 'linear-gradient(135deg, #7c5cfc, #5b8dee)',
    to: '/merge',
    badge: 'Popüler',
  },
  {
    icon: Scissors,
    title: 'PDF Böl',
    desc: 'PDF dosyanızı sayfa aralığına göre veya her sayfayı ayrı dosya olarak kaydedin.',
    gradient: 'linear-gradient(135deg, #fc5c9c, #fc974a)',
    to: '/split',
  },
  {
    icon: Droplets,
    title: 'Filigran Ekle',
    desc: "PDF sayfalarınıza metin filigranı ekleyin. Şeffaflık ve rengi dilediğiniz gibi ayarlayın.",
    gradient: 'linear-gradient(135deg, #3ecf8e, #5b8dee)',
    to: '/watermark',
  },
  {
    icon: Archive,
    title: 'PDF Sıkıştır',
    desc: "PDF dosyasının boyutunu küçültün. Kaliteyi koruyarak e-posta veya paylaşım için hazırlayın.",
    gradient: 'linear-gradient(135deg, #fc974a, #fc5c9c)',
    to: '/compress',
    badge: 'Yeni',
  },
  {
    icon: RotateCw,
    title: 'Sayfaları Döndür',
    desc: 'PDF içindeki belirli sayfaları 90°, 180° veya 270° döndürün, düzgünce hizalayın.',
    gradient: 'linear-gradient(135deg, #5b8dee, #3ecf8e)',
    to: '/rotate',
  },
]

const features = [
  {
    icon: Lock,
    title: 'Tamamen Güvenli',
    desc: 'Dosyalarınız hiçbir zaman sunucuya yüklenmez. Tüm işlemler tarayıcınızda gerçekleşir.',
  },
  {
    icon: Zap,
    title: 'Yıldırım Hızı',
    desc: 'İşlemler anında gerçekleşir. Bekleme süreniz sadece birkaç saniyedir.',
  },
  {
    icon: Shield,
    title: 'Gizliliğiniz Önceliğimiz',
    desc: 'Dosyalarınıza asla erişmeyiz. İndirdikten sonra her şey otomatik silinir.',
  },
]

export default function Home() {
  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <div className="hero-badge">
            <Star size={13} /> Her şey ücretsiz ve gizli
          </div>
          <h1 className="hero-title">
            PDF ile her şeyi<br /><span>saniyeler içinde</span> yapın
          </h1>
          <p className="hero-subtitle">
            Dosyalarınız yüklenmez, sunucuya gönderilmez. Tüm işlemler doğrudan tarayıcınızda, anında ve güvenle.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">5+</div>
              <div className="hero-stat-label">PDF Aracı</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">%100</div>
              <div className="hero-stat-label">Ücretsiz</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">∞</div>
              <div className="hero-stat-label">Güvenli</div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Tools */}
        <p className="section-title">Tüm Araçlar</p>
        <div className="tools-grid">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link to={tool.to} key={tool.to} className="tool-card">
                {tool.badge && (
                  <span style={{
                    position: 'absolute', top: 16, right: 16,
                    fontSize: 10, fontWeight: 700, letterSpacing: 1,
                    background: 'rgba(124,92,252,0.18)', color: 'var(--accent-primary)',
                    padding: '3px 8px', borderRadius: 100, border: '1px solid rgba(124,92,252,0.3)',
                    textTransform: 'uppercase',
                  }}>{tool.badge}</span>
                )}
                <div className="tool-icon" style={{ background: tool.gradient }}>
                  <Icon />
                </div>
                <div>
                  <div className="tool-card-title">{tool.title}</div>
                  <div className="tool-card-desc">{tool.desc}</div>
                </div>
                <div className="tool-card-arrow">
                  Başla <ArrowRight size={14} />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="section-divider" />

        {/* Features */}
        <section className="features">
          <p className="section-title">Neden PDF Studio?</p>
          <div className="features-grid">
            {features.map(f => {
              const Icon = f.icon
              return (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon"><Icon /></div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

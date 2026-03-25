import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-logo">
          <div className="footer-logo-icon">PDF</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>PDF Studio</span>
        </Link>
        <p className="footer-copy">© 2024 PDF Studio. Tüm işlemler tarayıcınızda yapılır.</p>
        <ul className="footer-links">
          <li><Link to="/merge">Birleştir</Link></li>
          <li><Link to="/split">Böl</Link></li>
          <li><Link to="/watermark">Filigran</Link></li>
          <li><Link to="/compress">Sıkıştır</Link></li>
          <li><Link to="/rotate">Döndür</Link></li>
        </ul>
      </div>
    </footer>
  )
}

import { Link, useLocation } from 'react-router-dom'
import { FileText, ChevronRight } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/merge', label: 'Birleştir' },
    { to: '/split', label: 'Böl' },
    { to: '/watermark', label: 'Filigran' },
    { to: '/compress', label: 'Sıkıştır' },
    { to: '/rotate', label: 'Döndür' },
  ]

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">PDF</div>
          <span className="navbar-logo-text">PDF Studio</span>
        </Link>
        <ul className="navbar-links">
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                style={location.pathname === l.to ? { color: 'var(--text-primary)', background: 'rgba(255,255,255,0.07)' } : {}}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/" className="navbar-cta">
              <span>Araçlar</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

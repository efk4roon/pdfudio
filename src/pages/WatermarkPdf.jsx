import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'
import { Droplets, ArrowLeft, FileText, X, Download, CheckCircle, Settings } from 'lucide-react'
import Dropzone from '../components/Dropzone'
import Toast from '../components/Toast'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return { r, g, b }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function WatermarkPdf() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('GİZLİ')
  const [color, setColor] = useState('#7c5cfc')
  const [opacity, setOpacity] = useState(30)
  const [fontSize, setFontSize] = useState(56)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)

  const addWatermark = async () => {
    if (!file) return
    if (!text.trim()) { setToast({ msg: 'Filigran metni boş olamaz.', type: 'error' }); return }
    setProcessing(true)
    try {
      const buf = await file.arrayBuffer()
      const doc = await PDFDocument.load(buf)
      const font = await doc.embedFont(StandardFonts.HelveticaBold)
      const { r, g, b } = hexToRgb(color)

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: opacity / 100,
          rotate: degrees(-30),
        })
      }

      const bytes = await doc.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: formatBytes(bytes.length) })
    } catch {
      setToast({ msg: 'Filigran eklenirken hata oluştu.', type: 'error' })
    } finally {
      setProcessing(false)
    }
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = result.url
    a.download = 'filigranli.pdf'
    a.click()
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" className="back-btn"><ArrowLeft size={16} /> Ana Sayfa</Link>

        <div className="tool-page-header">
          <div className="tool-page-icon" style={{ background: 'linear-gradient(135deg, #3ecf8e, #5b8dee)' }}>
            <Droplets />
          </div>
          <h1 className="tool-page-title">Filigran Ekle</h1>
          <p className="tool-page-desc">Tüm PDF sayfalarına metin filigranı ekleyin. Renk ve şeffaflığı ayarlayın.</p>
        </div>

        {!file && <Dropzone onFiles={(f) => setFile(f[0])} label="PDF dosyasını buraya sürükleyin" />}

        {file && !result && (
          <>
            <div className="file-list">
              <div className="file-item">
                <div className="file-item-icon"><FileText /></div>
                <div className="file-item-info">
                  <div className="file-item-name">{file.name}</div>
                  <div className="file-item-meta">{formatBytes(file.size)}</div>
                </div>
                <button className="file-item-remove" onClick={() => setFile(null)}><X /></button>
              </div>
            </div>

            {/* Preview */}
            <div className="wm-preview" style={{ marginTop: 20 }}>
              <div className="wm-preview-bg">
                <span className="wm-preview-text" style={{ color, opacity: opacity / 100 }}>
                  {text || 'Filigran Metni'}
                </span>
              </div>
              <span className="wm-preview-label">Önizleme</span>
            </div>

            <div className="action-panel">
              <div className="action-panel-title"><Settings size={16} /> Ayarlar</div>

              <div className="input-group">
                <label>Filigran Metni</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="GİZLİ"
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Renk</label>
                <div className="color-row">
                  <div className="color-swatch">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{color.toUpperCase()}</span>
                </div>
              </div>

              <div className="input-group">
                <label>Şeffaflık: {opacity}%</label>
                <input
                  type="range" min={5} max={100} value={opacity}
                  onChange={e => setOpacity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="input-group">
                <label>Yazı Boyutu: {fontSize}px</label>
                <input
                  type="range" min={20} max={120} value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>
            </div>

            {!processing && (
              <div className="action-footer">
                <button className="btn btn-primary btn-lg" onClick={addWatermark}>
                  <Droplets size={18} /> Filigran Ekle
                </button>
              </div>
            )}
          </>
        )}

        {processing && (
          <div className="processing-overlay">
            <div className="spinner" />
            <div className="processing-title">Filigran ekleniyor…</div>
            <div className="processing-subtitle">Lütfen bekleyin</div>
          </div>
        )}

        {result && (
          <div className="result-panel">
            <div className="result-panel-icon"><CheckCircle /></div>
            <div className="result-panel-title">Filigran Eklendi!</div>
            <div className="result-panel-meta">{result.size}</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-success" onClick={download}><Download size={16} /> İndir</button>
              <button className="btn btn-secondary" onClick={() => { setFile(null); setResult(null) }}>Yeni İşlem</button>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

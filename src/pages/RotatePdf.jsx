import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PDFDocument, degrees } from 'pdf-lib'
import { RotateCw, ArrowLeft, FileText, X, Download, CheckCircle, Settings } from 'lucide-react'
import Dropzone from '../components/Dropzone'
import Toast from '../components/Toast'

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function RotatePdf() {
  const [file, setFile] = useState(null)
  const [rotation, setRotation] = useState(90)
  const [target, setTarget] = useState('all') // 'all' | 'range'
  const [rangeInput, setRangeInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)

  const rotate = async () => {
    if (!file) return
    setProcessing(true)
    try {
      const buf = await file.arrayBuffer()
      const doc = await PDFDocument.load(buf)
      const pages = doc.getPages()

      let indices = pages.map((_, i) => i)
      if (target === 'range') {
        const parts = rangeInput.split(',').map(s => s.trim()).filter(Boolean)
        indices = []
        for (const p of parts) {
          if (p.includes('-')) {
            const [a, b] = p.split('-').map(Number)
            for (let i = a; i <= b && i <= pages.length; i++) indices.push(i - 1)
          } else {
            const n = Number(p)
            if (!isNaN(n) && n >= 1 && n <= pages.length) indices.push(n - 1)
          }
        }
        if (!indices.length) {
          setToast({ msg: 'Geçerli sayfa aralığı girin.', type: 'error' })
          setProcessing(false)
          return
        }
      }

      for (const i of indices) {
        const page = pages[i]
        const currentRot = page.getRotation().angle
        page.setRotation(degrees((currentRot + rotation) % 360))
      }

      const bytes = await doc.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setResult({ url: URL.createObjectURL(blob), size: formatBytes(bytes.length) })
    } catch {
      setToast({ msg: 'Döndürme sırasında hata oluştu.', type: 'error' })
    } finally {
      setProcessing(false)
    }
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = result.url
    a.download = 'dondurulmus.pdf'
    a.click()
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" className="back-btn"><ArrowLeft size={16} /> Ana Sayfa</Link>

        <div className="tool-page-header">
          <div className="tool-page-icon" style={{ background: 'linear-gradient(135deg, #5b8dee, #3ecf8e)' }}>
            <RotateCw />
          </div>
          <h1 className="tool-page-title">Sayfaları Döndür</h1>
          <p className="tool-page-desc">PDF sayfalarını 90°, 180° veya 270° döndürün. Tüm sayfaları veya belirli aralığı seçin.</p>
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

            <div className="action-panel" style={{ marginTop: 20 }}>
              <div className="action-panel-title"><Settings size={16} /> Döndürme Ayarları</div>

              <div className="input-group">
                <label>Açı</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[90, 180, 270].map(deg => (
                    <button
                      key={deg}
                      className={`split-option ${rotation === deg ? 'selected' : ''}`}
                      style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
                      onClick={() => setRotation(deg)}
                    >
                      <RotateCw size={16} style={{ transform: `rotate(${deg === 270 ? '-90' : deg === 180 ? '180' : '0'}deg)` }} />
                      <span className="split-option-title">{deg}°</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group" style={{ marginTop: 16 }}>
                <label>Sayfalar</label>
                <div className="split-options">
                  <button className={`split-option ${target === 'all' ? 'selected' : ''}`} onClick={() => setTarget('all')}>
                    <div className="split-option-title">Tüm Sayfalar</div>
                    <div className="split-option-desc">Her sayfayı döndür</div>
                  </button>
                  <button className={`split-option ${target === 'range' ? 'selected' : ''}`} onClick={() => setTarget('range')}>
                    <div className="split-option-title">Sayfa Aralığı</div>
                    <div className="split-option-desc">Belirli sayfaları seç</div>
                  </button>
                </div>
              </div>

              {target === 'range' && (
                <div className="input-group">
                  <label>Sayfa aralıkları (örn: 1-3, 5)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="1-3, 5"
                    value={rangeInput}
                    onChange={e => setRangeInput(e.target.value)}
                  />
                </div>
              )}
            </div>

            {!processing && (
              <div className="action-footer">
                <button className="btn btn-primary btn-lg" onClick={rotate}>
                  <RotateCw size={18} /> {rotation}° Döndür
                </button>
              </div>
            )}
          </>
        )}

        {processing && (
          <div className="processing-overlay">
            <div className="spinner" />
            <div className="processing-title">Döndürülüyor…</div>
            <div className="processing-subtitle">Lütfen bekleyin</div>
          </div>
        )}

        {result && (
          <div className="result-panel">
            <div className="result-panel-icon"><CheckCircle /></div>
            <div className="result-panel-title">Döndürme Tamamlandı!</div>
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

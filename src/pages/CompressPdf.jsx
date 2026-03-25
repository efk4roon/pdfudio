import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PDFDocument } from 'pdf-lib'
import { Archive, ArrowLeft, FileText, X, Download, CheckCircle, Zap } from 'lucide-react'
import Dropzone from '../components/Dropzone'
import Toast from '../components/Toast'

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function CompressPdf() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)

  const compress = async () => {
    if (!file) return
    setProcessing(true)
    try {
      const buf = await file.arrayBuffer()
      // pdf-lib re-saves PDF which removes redundant data
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true })
      const bytes = await doc.save({ useObjectStreams: true, addDefaultPage: false })
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const savings = ((file.size - bytes.length) / file.size * 100).toFixed(1)
      setResult({
        url: URL.createObjectURL(blob),
        originalSize: formatBytes(file.size),
        newSize: formatBytes(bytes.length),
        savings,
      })
    } catch {
      setToast({ msg: 'Sıkıştırma sırasında hata oluştu.', type: 'error' })
    } finally {
      setProcessing(false)
    }
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = result.url
    a.download = 'sikistirilmis.pdf'
    a.click()
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" className="back-btn"><ArrowLeft size={16} /> Ana Sayfa</Link>

        <div className="tool-page-header">
          <div className="tool-page-icon" style={{ background: 'linear-gradient(135deg, #fc974a, #fc5c9c)' }}>
            <Archive />
          </div>
          <h1 className="tool-page-title">PDF Sıkıştır</h1>
          <p className="tool-page-desc">PDF dosyanızı optimize edin, dosya boyutunu küçültün. Kalite korunur.</p>
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
              <div className="action-panel-title"><Zap size={16} /> Sıkıştırma Hakkında</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                PDF dokümanınız optimize edilir ve gereksiz veri katmanları temizlenir.
                Gömülü fontlar ve görseller korunarak dosya boyutu küçültülür.
              </p>
            </div>

            {!processing && (
              <div className="action-footer">
                <button className="btn btn-primary btn-lg" onClick={compress}>
                  <Archive size={18} /> Sıkıştır
                </button>
              </div>
            )}
          </>
        )}

        {processing && (
          <div className="processing-overlay">
            <div className="spinner" />
            <div className="processing-title">Sıkıştırılıyor…</div>
            <div className="processing-subtitle">Lütfen bekleyin</div>
          </div>
        )}

        {result && (
          <div className="result-panel">
            <div className="result-panel-icon"><CheckCircle /></div>
            <div className="result-panel-title">Sıkıştırma Tamamlandı!</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, margin: '16px 0 24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Önce</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{result.originalSize}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-green)', fontWeight: 700, fontSize: 18 }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Sonra</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>{result.newSize}</div>
              </div>
            </div>
            {parseFloat(result.savings) > 0
              ? <div className="result-panel-meta">%{result.savings} tasarruf edildi</div>
              : <div className="result-panel-meta">Bu dosya zaten optimize edilmiş</div>}
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

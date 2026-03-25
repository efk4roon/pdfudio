import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PDFDocument } from 'pdf-lib'
import { Scissors, ArrowLeft, FileText, X, Download, CheckCircle } from 'lucide-react'
import Dropzone from '../components/Dropzone'
import Toast from '../components/Toast'

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function SplitPdf() {
  const [file, setFile] = useState(null)
  const [mode, setMode] = useState('range') // 'range' | 'each'
  const [rangeInput, setRangeInput] = useState('')
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState([])
  const [toast, setToast] = useState(null)

  const handleFile = (files) => {
    setFile(files[0])
    setResults([])
  }

  const parseRanges = (input, maxPage) => {
    const ranges = []
    const parts = input.split(',').map(s => s.trim()).filter(Boolean)
    for (const part of parts) {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number)
        if (!isNaN(a) && !isNaN(b) && a >= 1 && b <= maxPage && a <= b) {
          ranges.push([a - 1, b - 1])
        }
      } else {
        const n = Number(part)
        if (!isNaN(n) && n >= 1 && n <= maxPage) {
          ranges.push([n - 1, n - 1])
        }
      }
    }
    return ranges
  }

  const split = async () => {
    if (!file) return
    setProcessing(true)
    setResults([])
    try {
      const buf = await file.arrayBuffer()
      const srcDoc = await PDFDocument.load(buf)
      const total = srcDoc.getPageCount()
      const outs = []

      if (mode === 'each') {
        for (let i = 0; i < total; i++) {
          const newDoc = await PDFDocument.create()
          const [page] = await newDoc.copyPages(srcDoc, [i])
          newDoc.addPage(page)
          const bytes = await newDoc.save()
          const blob = new Blob([bytes], { type: 'application/pdf' })
          outs.push({ url: URL.createObjectURL(blob), name: `sayfa-${i + 1}.pdf`, size: formatBytes(bytes.length) })
        }
      } else {
        const ranges = parseRanges(rangeInput, total)
        if (!ranges.length) {
          setToast({ msg: 'Geçerli sayfa aralığı girin. Örnek: 1-3, 5, 7-9', type: 'error' })
          setProcessing(false)
          return
        }
        for (const [from, to] of ranges) {
          const newDoc = await PDFDocument.create()
          const indices = []
          for (let j = from; j <= to; j++) indices.push(j)
          const pages = await newDoc.copyPages(srcDoc, indices)
          pages.forEach(p => newDoc.addPage(p))
          const bytes = await newDoc.save()
          const blob = new Blob([bytes], { type: 'application/pdf' })
          outs.push({ url: URL.createObjectURL(blob), name: `sayfa-${from + 1}-${to + 1}.pdf`, size: formatBytes(bytes.length) })
        }
      }
      setResults(outs)
    } catch (e) {
      setToast({ msg: 'Bölme sırasında hata oluştu.', type: 'error' })
    } finally {
      setProcessing(false)
    }
  }

  const downloadAll = () => {
    results.forEach(r => {
      const a = document.createElement('a')
      a.href = r.url
      a.download = r.name
      a.click()
    })
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" className="back-btn"><ArrowLeft size={16} /> Ana Sayfa</Link>

        <div className="tool-page-header">
          <div className="tool-page-icon" style={{ background: 'linear-gradient(135deg, #fc5c9c, #fc974a)' }}>
            <Scissors />
          </div>
          <h1 className="tool-page-title">PDF Böl</h1>
          <p className="tool-page-desc">PDF sayfalarını aralığa göre veya her sayfayı ayrı dosya olarak dışa aktarın.</p>
        </div>

        {!file && <Dropzone onFiles={handleFile} label="PDF dosyasını buraya sürükleyin" />}

        {file && !results.length && (
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
              <div className="action-panel-title"><Scissors size={16} /> Bölme Yöntemi</div>
              <div className="split-options">
                <button className={`split-option ${mode === 'range' ? 'selected' : ''}`} onClick={() => setMode('range')}>
                  <div className="split-option-title">Sayfa Aralığı</div>
                  <div className="split-option-desc">Belirli sayfaları veya aralıkları seçin</div>
                </button>
                <button className={`split-option ${mode === 'each' ? 'selected' : ''}`} onClick={() => setMode('each')}>
                  <div className="split-option-title">Her Sayfayı Ayır</div>
                  <div className="split-option-desc">Her sayfa ayrı bir PDF olarak çıkar</div>
                </button>
              </div>

              {mode === 'range' && (
                <div className="input-group">
                  <label>Sayfa aralıkları (örn: 1-3, 5, 7-9)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="1-3, 5, 7-9"
                    value={rangeInput}
                    onChange={e => setRangeInput(e.target.value)}
                  />
                </div>
              )}
            </div>

            {!processing && (
              <div className="action-footer">
                <button className="btn btn-primary btn-lg" onClick={split}>
                  <Scissors size={18} /> Böl
                </button>
              </div>
            )}
          </>
        )}

        {processing && (
          <div className="processing-overlay">
            <div className="spinner" />
            <div className="processing-title">PDF bölünüyor…</div>
            <div className="processing-subtitle">Lütfen bekleyin</div>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="result-panel" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div className="result-panel-icon" style={{ flexShrink: 0, margin: 0 }}><CheckCircle /></div>
                <div>
                  <div className="result-panel-title">{results.length} dosya oluşturuldu!</div>
                  <div className="result-panel-meta">İndirmek için her birine tıklayın.</div>
                </div>
              </div>
              <div className="file-list" style={{ marginTop: 0 }}>
                {results.map((r, i) => (
                  <div className="file-item" key={i}>
                    <div className="file-item-icon" style={{ background: 'rgba(62,207,142,0.1)' }}>
                      <FileText style={{ color: 'var(--accent-green)' }} />
                    </div>
                    <div className="file-item-info">
                      <div className="file-item-name">{r.name}</div>
                      <div className="file-item-meta">{r.size}</div>
                    </div>
                    <a href={r.url} download={r.name}>
                      <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                        <Download size={14} /> İndir
                      </button>
                    </a>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                <button className="btn btn-success" onClick={downloadAll}><Download size={16} /> Tümünü İndir</button>
                <button className="btn btn-secondary" onClick={() => { setFile(null); setResults([]) }}>Yeni İşlem</button>
              </div>
            </div>
          </>
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

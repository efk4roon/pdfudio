import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PDFDocument } from 'pdf-lib'
import { Layers, ArrowLeft, FileText, X, Download, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react'
import Dropzone from '../components/Dropzone'
import Toast from '../components/Toast'

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function MergePdf() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)

  const addFiles = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...newFiles])
    setDone(false)
    setResult(null)
  }, [])

  const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index))

  const moveUp = (index) => {
    if (index === 0) return
    setFiles(prev => {
      const arr = [...prev]
      ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      return arr
    })
  }

  const moveDown = (index) => {
    setFiles(prev => {
      if (index === prev.length - 1) return prev
      const arr = [...prev]
      ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      return arr
    })
  }

  const merge = async () => {
    if (files.length < 2) {
      setToast({ msg: 'En az 2 PDF dosyası seçin.', type: 'error' })
      return
    }
    setProcessing(true)
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const buf = await file.arrayBuffer()
        const doc = await PDFDocument.load(buf)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const bytes = await merged.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setResult({ url, size: formatBytes(bytes.length), pages: merged.getPageCount() })
      setDone(true)
    } catch (e) {
      setToast({ msg: 'Birleştirme sırasında hata oluştu.', type: 'error' })
    } finally {
      setProcessing(false)
    }
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = result.url
    a.download = 'birlestirilmis.pdf'
    a.click()
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" className="back-btn"><ArrowLeft size={16} /> Ana Sayfa</Link>

        <div className="tool-page-header">
          <div className="tool-page-icon" style={{ background: 'linear-gradient(135deg, #7c5cfc, #5b8dee)' }}>
            <Layers />
          </div>
          <h1 className="tool-page-title">PDF Birleştir</h1>
          <p className="tool-page-desc">Birden fazla PDF dosyasını tek belgede birleştirin. Sıralamayı sürükleyerek ayarlayın.</p>
        </div>

        {!processing && !done && (
          <>
            <Dropzone onFiles={addFiles} multiple label="PDF dosyalarını buraya sürükleyin" />
            {files.length > 0 && (
              <div className="file-list">
                {files.map((f, i) => (
                  <div className="file-item" key={i}>
                    <div className="file-item-icon"><FileText /></div>
                    <div className="file-item-info">
                      <div className="file-item-name">{f.name}</div>
                      <div className="file-item-meta">{formatBytes(f.size)}</div>
                    </div>
                    <button className="file-item-remove" onClick={() => moveUp(i)} title="Yukarı taşı" style={{ color: 'var(--text-secondary)' }}>
                      <ArrowUp size={14} />
                    </button>
                    <button className="file-item-remove" onClick={() => moveDown(i)} title="Aşağı taşı" style={{ color: 'var(--text-secondary)' }}>
                      <ArrowDown size={14} />
                    </button>
                    <button className="file-item-remove" onClick={() => removeFile(i)}><X /></button>
                  </div>
                ))}
              </div>
            )}
            {files.length > 0 && (
              <div className="action-footer">
                <button className="btn btn-primary btn-lg" onClick={merge} disabled={files.length < 2}>
                  <Layers size={18} /> {files.length} Dosyayı Birleştir
                </button>
              </div>
            )}
          </>
        )}

        {processing && (
          <div className="processing-overlay">
            <div className="spinner" />
            <div className="processing-title">PDF'ler birleştiriliyor…</div>
            <div className="processing-subtitle">Lütfen bekleyin</div>
          </div>
        )}

        {done && result && (
          <div className="result-panel">
            <div className="result-panel-icon"><CheckCircle /></div>
            <div className="result-panel-title">Başarıyla Birleştirildi!</div>
            <div className="result-panel-meta">{result.pages} sayfa · {result.size}</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-success" onClick={download}><Download size={16} /> İndir</button>
              <button className="btn btn-secondary" onClick={() => { setFiles([]); setDone(false); setResult(null) }}>Yeni İşlem</button>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

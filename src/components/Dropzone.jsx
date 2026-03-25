import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

export default function Dropzone({ onFiles, multiple = false, label = 'PDF dosyaları sürükleyin' }) {
  const inputRef = useRef()
  const [active, setActive] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setActive(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    if (files.length) onFiles(files)
  }

  const handleChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf')
    if (files.length) onFiles(files)
  }

  return (
    <div
      className={`dropzone-wrapper ${active ? 'active' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setActive(true) }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
    >
      <div className="dropzone-icon">
        <Upload />
      </div>
      <p className="dropzone-title">{label}</p>
      <p className="dropzone-subtitle">veya tıklayarak seçin</p>
      <button className="dropzone-btn" onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}>
        <Upload size={16} />
        PDF Seç
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple={multiple}
        className="dropzone-input"
        onChange={handleChange}
      />
    </div>
  )
}

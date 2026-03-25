import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MergePdf from './pages/MergePdf'
import SplitPdf from './pages/SplitPdf'
import WatermarkPdf from './pages/WatermarkPdf'
import CompressPdf from './pages/CompressPdf'
import RotatePdf from './pages/RotatePdf'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merge" element={<MergePdf />} />
        <Route path="/split" element={<SplitPdf />} />
        <Route path="/watermark" element={<WatermarkPdf />} />
        <Route path="/compress" element={<CompressPdf />} />
        <Route path="/rotate" element={<RotatePdf />} />
      </Routes>
      <Footer />
    </>
  )
}

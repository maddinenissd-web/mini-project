import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import XrayAnalyzer from './pages/XrayAnalyzer'
import LabReport from './pages/LabReport'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/xray" element={<XrayAnalyzer />} />
            <Route path="/lab-report" element={<LabReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

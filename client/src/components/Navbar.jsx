import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, MessageSquare, ScanLine, FileText, LayoutDashboard, Menu, X } from 'lucide-react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-brand">
        <div className="logo-icon">🧬</div>
        <span>MedAI</span>
      </Link>

      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`navbar-nav ${isOpen ? 'open' : ''}`}>
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link to="/chat" className={`nav-link ${isActive('/chat')}`}>
          <MessageSquare size={18} />
          AI Chat
        </Link>
        <Link to="/xray" className={`nav-link ${isActive('/xray')}`}>
          <ScanLine size={18} />
          X-Ray
        </Link>
        <Link to="/lab-report" className={`nav-link ${isActive('/lab-report')}`}>
          <FileText size={18} />
          Lab Reports
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

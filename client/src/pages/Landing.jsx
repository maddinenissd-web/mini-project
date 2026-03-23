import { Link } from 'react-router-dom'
import { MessageSquare, ScanLine, Brain, FileText, Activity, Shield, Sparkles, ArrowRight, Zap } from 'lucide-react'

function Landing() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 15 + 10}s`,
    delay: `${Math.random() * 10}s`,
    opacity: Math.random() * 0.3 + 0.1,
  }))

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-particles">
          {particles.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            AI-Powered Medical Intelligence
          </div>

          <h1>
            Personalized Medicine<br />
            Through <span className="gradient-text">AI & Big Data</span>
          </h1>

          <p>
            Integrating machine learning with big data analytics for intelligent diagnosis,
            treatment optimization, and personalized healthcare insights.
          </p>

          <div className="hero-actions">
            <Link to="/chat" className="btn btn-primary btn-lg">
              <MessageSquare size={20} />
              Start AI Consultation
            </Link>
            <Link to="/xray" className="btn btn-secondary btn-lg">
              <ScanLine size={20} />
              Analyze X-Ray
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <div className="overline">
            <Sparkles size={16} />
            Platform Features
          </div>
          <h2>AI-Driven Healthcare Intelligence</h2>
          <p>
            Comprehensive tools powered by machine learning for accurate diagnosis 
            and personalized treatment recommendations.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon teal">
              <Brain size={26} />
            </div>
            <h3>AI Medical Consultant</h3>
            <p>
              Chat with our AI powered by Google Gemini for medication guidance, 
              symptom analysis, and disease information with real-world medical reasoning.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <ScanLine size={26} />
            </div>
            <h3>Pneumonia Detection</h3>
            <p>
              Upload chest X-ray images for instant AI-powered pneumonia detection 
              using our trained CNN model with confidence scoring.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <FileText size={26} />
            </div>
            <h3>Lab Report Analysis</h3>
            <p>
              Submit lab results for comprehensive AI analysis — identify abnormal values, 
              clinical significance, and recommended follow-up actions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">
              <Activity size={26} />
            </div>
            <h3>Vitals Dashboard</h3>
            <p>
              Track patient vitals, medications, medical history, and symptoms 
              in an intuitive dashboard for holistic health monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>98.7%</h3>
            <p>Model Accuracy</p>
          </div>
          <div className="stat-item">
            <h3>5,000+</h3>
            <p>X-Rays Analyzed</p>
          </div>
          <div className="stat-item">
            <h3>&lt;3s</h3>
            <p>Prediction Time</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>AI Availability</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to Experience AI-Powered Healthcare?</h2>
          <p>
            Start with an AI consultation, upload an X-ray for analysis, 
            or explore your health data in the dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary">
              <Zap size={18} />
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          <Shield size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          MedAI — For educational & research purposes only. Not a substitute for professional medical advice.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          IEEE Research: Integrating ML & Big Data Analytics for Personalized Medicine
        </p>
      </footer>
    </div>
  )
}

export default Landing

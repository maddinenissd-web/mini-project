import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { FileText, Send, Loader, AlertTriangle, Beaker } from 'lucide-react'

const API_BASE = import.meta.env.PROD ? '' : ''

function LabReport() {
  const [reportData, setReportData] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPatientContext = () => {
    try {
      const data = localStorage.getItem('medai_patient_data')
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  const analyzeReport = async () => {
    if (!reportData.trim()) return
    setLoading(true)
    setError(null)

    try {
      const patientContext = getPatientContext()
      const response = await axios.post(`${API_BASE}/api/analyze`, {
        reportData,
        patientContext,
      })
      setAnalysis(response.data.analysis)
    } catch (err) {
      setError(err.response?.data?.details || err.message || 'Failed to analyze report')
    } finally {
      setLoading(false)
    }
  }

  const sampleReport = `Complete Blood Count (CBC):
- WBC: 12.5 x10^3/μL (Normal: 4.5-11.0)  
- RBC: 4.2 x10^6/μL (Normal: 4.7-6.1)
- Hemoglobin: 11.2 g/dL (Normal: 13.5-17.5)
- Hematocrit: 34% (Normal: 38.3-48.6)
- Platelets: 280 x10^3/μL (Normal: 150-400)
- MCV: 78 fL (Normal: 80-100)

Metabolic Panel:
- Glucose (Fasting): 126 mg/dL (Normal: 70-100)
- BUN: 22 mg/dL (Normal: 7-20)
- Creatinine: 1.4 mg/dL (Normal: 0.7-1.3)
- Sodium: 140 mEq/L (Normal: 136-145)
- Potassium: 4.5 mEq/L (Normal: 3.5-5.0)
- ALT: 55 U/L (Normal: 7-56)
- AST: 62 U/L (Normal: 10-40)
- Total Cholesterol: 245 mg/dL (Normal: <200)
- LDL: 165 mg/dL (Normal: <100)
- HDL: 38 mg/dL (Normal: >40)
- HbA1c: 7.2% (Normal: <5.7%)`

  return (
    <div className="lab-report-page">
      <div className="page-header">
        <h1>Lab Report Analysis</h1>
        <p>Enter your lab report values for AI-powered clinical analysis</p>
      </div>

      {/* Input Section */}
      <div className="lab-input-section">
        <h3>
          <Beaker size={20} style={{ color: 'var(--primary)' }} />
          Lab Report Data
        </h3>
        <div className="form-group">
          <textarea
            className="form-textarea"
            style={{ minHeight: '200px' }}
            placeholder="Enter your lab report values here...&#10;&#10;Example:&#10;WBC: 12.5 x10^3/μL&#10;Hemoglobin: 11.2 g/dL&#10;Glucose (Fasting): 126 mg/dL"
            value={reportData}
            onChange={(e) => setReportData(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={analyzeReport}
            disabled={!reportData.trim() || loading}
          >
            {loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <Send size={16} /> Analyze Report
              </>
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setReportData(sampleReport)}
          >
            <FileText size={16} /> Load Sample Data
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-spinner" style={{ padding: '3rem' }}>
          <div className="spinner"></div>
          <p>Analyzing lab report with AI...</p>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>
            Comparing values against reference ranges
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="prediction-disclaimer" style={{ background: 'rgba(255,82,82,0.08)', borderColor: 'rgba(255,82,82,0.2)', marginBottom: '1.5rem' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--danger)' }} />
          <span style={{ color: 'var(--danger)' }}>{error}</span>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="lab-results-section">
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} style={{ color: 'var(--primary)' }} />
            AI Analysis
          </h3>
          <div className="analysis-content">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
          <div className="prediction-disclaimer" style={{ marginTop: '1.5rem' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              This AI analysis is for educational purposes only. Always consult your 
              healthcare provider for interpretation of lab results and medical decisions.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LabReport

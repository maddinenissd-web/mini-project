import { useState, useRef } from 'react'
import axios from 'axios'
import { Upload, ScanLine, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const API_BASE = "http://127.0.0.1:5000"
function XrayAnalyzer() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragover, setDragover] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.match(/image\/(jpeg|png|bmp)/)) {
      setError('Please upload a valid image file (JPEG, PNG, BMP)')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragover(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragover(true)
  }

  const handleDragLeave = () => setDragover(false)

  const analyzeImage = async () => {
    if (!image) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', image)

      const response = await axios.post(`${API_BASE}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })

      setResult(response.data)
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.error || err.message
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isPneumonia = result?.prediction?.toLowerCase() === 'pneumonia'
  const confidence = result?.confidence ? (result.confidence * 100).toFixed(1) : 0

  return (
    <div className="xray-page">
      <div className="page-header">
        <h1>Chest X-Ray Analyzer</h1>
        <p>Upload a chest X-ray image for AI-powered pneumonia detection</p>
      </div>

      {/* Upload Zone */}
      {!preview && (
        <div
          className={`upload-zone ${dragover ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="upload-zone-icon">
            <Upload size={28} />
          </div>
          <h3>Upload Chest X-Ray</h3>
          <p>Drag & drop your X-ray image here, or click to browse</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Supported formats: JPEG, PNG, BMP • Max size: 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/bmp"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Results */}
      {preview && (
        <>
          <div className="xray-results">
            {/* Image Preview */}
            <div className="xray-preview">
              <img src={preview} alt="X-Ray Preview" />
              <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={analyzeImage} disabled={loading} style={{ flex: 1 }}>
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="spinning" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <ScanLine size={16} /> Analyze X-Ray
                    </>
                  )}
                </button>
                <button className="btn btn-secondary" onClick={reset}>
                  <RefreshCw size={16} /> New
                </button>
              </div>
            </div>

            {/* Prediction Results */}
            <div className="xray-prediction">
              {loading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Analyzing X-ray with AI model...</p>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    CNN deep learning model processing
                  </p>
                </div>
              )}

              {result && !loading && (
                <>
                  <div className="prediction-result">
                    <div className="prediction-label">AI Prediction</div>
                    <div className={`prediction-value ${isPneumonia ? 'pneumonia' : 'normal'}`}>
                      {isPneumonia ? (
                        <><XCircle size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} /> PNEUMONIA</>
                      ) : (
                        <><CheckCircle size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} /> NORMAL</>
                      )}
                    </div>
                  </div>

                  <div className="confidence-bar">
                    <div className="confidence-bar-label">
                      <span>Confidence</span>
                      <span>{confidence}%</span>
                    </div>
                    <div className="confidence-bar-track">
                      <div
                        className={`confidence-bar-fill ${isPneumonia ? 'pneumonia' : 'normal'}`}
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>

                  {result.details && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Details
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {result.details}
                      </p>
                    </div>
                  )}

                  <div className="prediction-disclaimer">
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>
                      This is an AI-assisted analysis for educational purposes only.
                      Always consult a qualified radiologist for medical imaging interpretation.
                    </span>
                  </div>
                </>
              )}

              {!result && !loading && (
                <div className="loading-spinner">
                  <ScanLine size={40} style={{ color: 'var(--text-muted)' }} />
                  <p className="text-muted">Click "Analyze X-Ray" to start prediction</p>
                </div>
              )}

              {error && (
                <div className="prediction-disclaimer" style={{ background: 'rgba(255,82,82,0.08)', borderColor: 'rgba(255,82,82,0.2)' }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--danger)' }} />
                  <span style={{ color: 'var(--danger)' }}>
                    {error}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Info Section */}
      <div style={{ marginTop: '3rem' }}>
        <div className="card-glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ScanLine size={20} style={{ color: 'var(--primary)' }} />
            About the Pneumonia Detection Model
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            Our CNN (Convolutional Neural Network) model is trained on the Kaggle
            Chest X-Ray Images (Pneumonia) dataset, consisting of 5,863 validated X-ray images.
            The model uses deep learning to identify patterns associated with bacterial and
            viral pneumonia in chest radiographs. It performs binary classification
            (Normal vs. Pneumonia) and provides a confidence score for each prediction.
          </p>
        </div>
      </div>
    </div>
  )
}

export default XrayAnalyzer

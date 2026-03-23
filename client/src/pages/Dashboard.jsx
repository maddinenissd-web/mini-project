import { useState } from 'react'
import { Activity, Pill, Heart, Thermometer, Wind, Droplets, Plus, X, Stethoscope, AlertCircle } from 'lucide-react'

function Dashboard() {
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    spo2: '',
    respiratoryRate: '',
    weight: '',
  })

  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    bloodGroup: '',
  })

  const [medications, setMedications] = useState([])
  const [newMed, setNewMed] = useState('')
  const [conditions, setConditions] = useState([])
  const [newCondition, setNewCondition] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [saved, setSaved] = useState(false)

  const handleVitalChange = (key, value) => {
    setVitals(prev => ({ ...prev, [key]: value }))
  }

  const handlePatientChange = (key, value) => {
    setPatientInfo(prev => ({ ...prev, [key]: value }))
  }

  const addMedication = () => {
    if (newMed.trim()) {
      setMedications(prev => [...prev, newMed.trim()])
      setNewMed('')
    }
  }

  const removeMedication = (index) => {
    setMedications(prev => prev.filter((_, i) => i !== index))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions(prev => [...prev, newCondition.trim()])
      setNewCondition('')
    }
  }

  const removeCondition = (index) => {
    setConditions(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const patientData = { ...patientInfo, vitals, medications, conditions, symptoms }
    localStorage.setItem('medai_patient_data', JSON.stringify(patientData))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Patient Dashboard</h1>
        <p>Enter your medical information for personalized AI analysis</p>
      </div>

      <div className="dashboard-grid">
        {/* Patient Info Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <Stethoscope size={20} className="card-icon" />
            General Information
          </div>
          <div className="dashboard-card-body">
            <div className="form-row mb-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={patientInfo.name}
                  onChange={(e) => handlePatientChange('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="30"
                  value={patientInfo.age}
                  onChange={(e) => handlePatientChange('age', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={patientInfo.gender}
                  onChange={(e) => handlePatientChange('gender', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={patientInfo.bloodGroup}
                  onChange={(e) => handlePatientChange('bloodGroup', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <Activity size={20} className="card-icon" />
            Vital Signs
          </div>
          <div className="dashboard-card-body">
            <div className="vitals-grid">
              <div className="vital-item">
                <div className="vital-label">Blood Pressure</div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="120/80"
                  value={vitals.bloodPressure}
                  onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                  style={{ textAlign: 'center', marginTop: '0.25rem' }}
                />
                <div className="vital-unit">mmHg</div>
              </div>
              <div className="vital-item">
                <div className="vital-label">Heart Rate</div>
                <input
                  type="number"
                  className="form-input"
                  placeholder="72"
                  value={vitals.heartRate}
                  onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                  style={{ textAlign: 'center', marginTop: '0.25rem' }}
                />
                <div className="vital-unit">bpm</div>
              </div>
              <div className="vital-item">
                <div className="vital-label">Temperature</div>
                <input
                  type="number"
                  className="form-input"
                  placeholder="98.6"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                  style={{ textAlign: 'center', marginTop: '0.25rem' }}
                />
                <div className="vital-unit">°F</div>
              </div>
              <div className="vital-item">
                <div className="vital-label">SpO2</div>
                <input
                  type="number"
                  className="form-input"
                  placeholder="98"
                  value={vitals.spo2}
                  onChange={(e) => handleVitalChange('spo2', e.target.value)}
                  style={{ textAlign: 'center', marginTop: '0.25rem' }}
                />
                <div className="vital-unit">%</div>
              </div>
              <div className="vital-item">
                <div className="vital-label">Resp. Rate</div>
                <input
                  type="number"
                  className="form-input"
                  placeholder="16"
                  value={vitals.respiratoryRate}
                  onChange={(e) => handleVitalChange('respiratoryRate', e.target.value)}
                  style={{ textAlign: 'center', marginTop: '0.25rem' }}
                />
                <div className="vital-unit">/min</div>
              </div>
              <div className="vital-item">
                <div className="vital-label">Weight</div>
                <input
                  type="number"
                  className="form-input"
                  placeholder="70"
                  value={vitals.weight}
                  onChange={(e) => handleVitalChange('weight', e.target.value)}
                  style={{ textAlign: 'center', marginTop: '0.25rem' }}
                />
                <div className="vital-unit">kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Medications Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <Pill size={20} className="card-icon" />
            Current Medications
          </div>
          <div className="dashboard-card-body">
            <div className="add-med-row mb-2">
              <input
                type="text"
                className="form-input"
                placeholder="Enter medication name & dosage"
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMedication()}
              />
              <button className="btn btn-primary btn-icon" onClick={addMedication}>
                <Plus size={18} />
              </button>
            </div>
            {medications.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.85rem', padding: '0.5rem 0' }}>
                No medications added yet
              </p>
            ) : (
              <ul className="medication-list">
                {medications.map((med, index) => (
                  <li key={index} className="medication-item">
                    <span className="medication-dot"></span>
                    <span className="medication-name">{med}</span>
                    <button
                      className="btn btn-icon"
                      onClick={() => removeMedication(index)}
                      style={{ color: 'var(--danger)', width: 28, height: 28 }}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Conditions & Symptoms Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <AlertCircle size={20} className="card-icon" />
            Conditions & Symptoms
          </div>
          <div className="dashboard-card-body">
            <div className="form-group mb-2">
              <label className="form-label">Existing Conditions</label>
              <div className="add-med-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Diabetes, Hypertension"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCondition()}
                />
                <button className="btn btn-primary btn-icon" onClick={addCondition}>
                  <Plus size={18} />
                </button>
              </div>
            </div>
            {conditions.length > 0 && (
              <div className="conditions-tags mb-2">
                {conditions.map((cond, index) => (
                  <span key={index} className="condition-tag">
                    {cond}
                    <span className="remove-tag" onClick={() => removeCondition(index)}>
                      <X size={12} />
                    </span>
                  </span>
                ))}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Current Symptoms</label>
              <textarea
                className="form-textarea symptoms-textarea"
                placeholder="Describe your symptoms, pain areas, duration, severity..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          {saved ? '✓ Saved Successfully!' : 'Save Patient Data'}
        </button>
        <p className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
          Data is saved locally and used for AI context in chat & analysis
        </p>
      </div>
    </div>
  )
}

export default Dashboard

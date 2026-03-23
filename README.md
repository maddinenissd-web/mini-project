# MedAI — Personalized Medicine & AI Diagnostics

> **IEEE Research Paper**: Integrating Machine Learning and Big Data Analytics for Personalized Medicine and Treatment Optimization

A full-stack web application that integrates machine learning with big data analytics for intelligent medical diagnosis, personalized treatment insights, and chest X-ray pneumonia detection.

## 🚀 Features

- **🤖 AI Medical Chat** — Powered by Google Gemini for medication guidance, symptom analysis, and disease info
- **🫁 Pneumonia Detection** — CNN model trained on chest X-rays for binary classification
- **📊 Lab Report Analysis** — AI-powered analysis with reference range comparison
- **📋 Patient Dashboard** — Track vitals, medications, conditions, and symptoms

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (Dark Medical Theme) |
| Backend | Node.js + Express |
| AI Chat | Google Gemini API |
| ML Model | PyTorch CNN |
| ML Serving | Python Flask |
| Deployment | Render |

## 📁 Project Structure

```
mini project/
├── client/          # React Frontend
├── server/          # Node.js Backend
├── ml-service/      # Python ML Service
└── render.yaml      # Render Deployment Config
```

## ⚡ Quick Start

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

# ML Service
cd ../ml-service
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# In server/.env
GEMINI_API_KEY=your_gemini_api_key_here
ML_SERVICE_URL=http://localhost:5000
PORT=3001
```

### 3. Start Services

```bash
# Terminal 1 - ML Service
cd ml-service
python app.py

# Terminal 2 - Backend
cd server
npm start

# Terminal 3 - Frontend
cd client
npm run dev
```

### 4. Train the Pneumonia Model (Optional)

Download the [Chest X-Ray Images (Pneumonia) dataset](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia) and run:

```bash
cd ml-service
python train.py /path/to/chest_xray
```

## 🌐 Deploy to Render

1. Push code to GitHub
2. Connect repo to [Render](https://render.com)
3. Create services from `render.yaml`
4. Add `GEMINI_API_KEY` environment variable

## ⚠️ Disclaimer

This application is developed for **educational and research purposes only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals.

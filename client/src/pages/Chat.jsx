import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { Send, Bot, User, Stethoscope, Pill, TestTube, Activity } from 'lucide-react'

const API_BASE = import.meta.env.PROD ? '' : ''

const QUICK_PROMPTS = [
  "What are the common side effects of Metformin?",
  "Explain the causes and symptoms of pneumonia",
  "What do elevated liver enzymes (ALT/AST) indicate?",
  "How does hypertension affect the cardiovascular system?",
]

function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const getPatientContext = () => {
    try {
      const data = localStorage.getItem('medai_patient_data')
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  const sendMessage = async (text = null) => {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    const userMessage = { role: 'user', content: messageText }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const patientContext = getPatientContext()
      const response = await axios.post(`${API_BASE}/api/chat`, {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        patientContext,
      })

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.response },
      ])
    } catch (error) {
      const errorMsg = error.response?.data?.details || error.message || 'Failed to get response'
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Error:** ${errorMsg}\n\nPlease ensure the server is running and the Gemini API key is configured in the server \`.env\` file.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (messages.length === 0) {
    return (
      <div className="chat-page">
        <div className="chat-header">
          <div className="chat-avatar">🧬</div>
          <div className="chat-header-info">
            <h2>MedAI Assistant</h2>
            <p>Powered by Google Gemini</p>
          </div>
          <div className="chat-status">
            <span className="status-dot"></span>
            Online
          </div>
        </div>

        <div className="chat-welcome">
          <div className="welcome-icon">🩺</div>
          <h2>How can I assist you today?</h2>
          <p>
            Ask me about medications, symptoms, diseases, lab reports, or any 
            medical question. I'll provide in-depth analysis with medical reasoning.
          </p>

          <div className="quick-prompts">
            {QUICK_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                className="quick-prompt-btn"
                onClick={() => sendMessage(prompt)}
              >
                {index === 0 && <Pill size={14} style={{ marginBottom: 4, color: 'var(--primary)' }} />}
                {index === 1 && <Stethoscope size={14} style={{ marginBottom: 4, color: 'var(--primary)' }} />}
                {index === 2 && <TestTube size={14} style={{ marginBottom: 4, color: 'var(--primary)' }} />}
                {index === 3 && <Activity size={14} style={{ marginBottom: 4, color: 'var(--primary)' }} />}
                <br />
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask a medical question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="chat-disclaimer">
            ⚕️ AI-generated medical information. Always consult a healthcare professional.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-avatar">🧬</div>
        <div className="chat-header-info">
          <h2>MedAI Assistant</h2>
          <p>Powered by Google Gemini</p>
        </div>
        <div className="chat-status">
          <span className="status-dot"></span>
          Online
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'assistant' ? '🧬' : <User size={16} />}
            </div>
            <div className="message-content">
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="message-avatar">🧬</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask a medical question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="chat-disclaimer">
          ⚕️ AI-generated medical information. Always consult a healthcare professional.
        </div>
      </div>
    </div>
  )
}

export default Chat

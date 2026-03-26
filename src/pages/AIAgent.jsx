import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { aiLimiter } from '../lib/security'
import MotionWrapper from '../components/common/MotionWrapper'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const SYSTEM_PROMPT = `You are "CODM Intel AI", an elite Call of Duty Mobile gaming assistant. You have deep knowledge of:
- All weapons, attachments, and gunsmith builds
- Maps, strategies, and callouts  
- Ranked mode tips and meta analysis
- Battle Royale strategies and loadout drops
- Scorestreaks, operator skills, and perks
- Tournament strategies and team compositions
- Game updates and patch notes

Rules:
- Keep answers concise and tactical (MAX 3 paragraphs)
- Use military/tactical tone
- If asked non-CODM questions, redirect to CODM topics
- Include specific weapon stats or attachment names when relevant
- Format tips as bullet points when listing multiple items`

export default function AIAgent() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "🎯 CODM Intel AI Online. I'm your tactical gaming assistant. Ask me about weapon builds, ranked strategies, BR tips, or anything CODM. What's your query, Operator?" }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    // Rate limit
    if (!aiLimiter.canProceed()) {
      setErrorMsg(`RATE LIMITED: Wait ${aiLimiter.getWaitTime()}s`)
      return
    }

    const userMsg = input.trim()
    setInput('')
    setErrorMsg('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsThinking(true)

    if (!genAI) {
      setMessages(prev => [...prev, { role: 'ai', content: "⚠️ Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env.local." }])
      setIsThinking(false)
      return
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
      })
      const chat = model.startChat({
        history: messages
          .filter(m => m.role !== 'ai' || messages.indexOf(m) !== 0)
          .map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
      })

      const result = await chat.sendMessage(userMsg)
      const response = result.response.text()
      setMessages(prev => [...prev, { role: 'ai', content: response }])
    } catch (err) {
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        setMessages(prev => [...prev, { role: 'ai', content: "⚠️ SYSTEM OVERLOAD: Daily AI Intel quota exceeded. Please wait for the daily reset or contact HQ." }])
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Comms Error: ${err.message}` }])
      }
    }

    setIsThinking(false)
  }

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)",
    transition: { duration: 0.2 }
  }

  return (
    <MotionWrapper
      className="flex flex-col h-[calc(100vh-140px)] md:h-[75vh] bg-gunmetal-light/90 backdrop-blur-md border border-gunmetal-dark rounded-xl overflow-hidden shadow-2xl relative"
    >
      <div className="bg-[#181C20] p-3 md:p-4 border-b border-gold/20 flex justify-between items-center z-10">
        <h2 className="text-base md:text-xl font-bold text-gray-200 flex items-center gap-2 md:gap-3 tracking-wide">
          <span className="text-lg md:text-2xl drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">🤖</span>
          <span className="hidden sm:inline">CODM INTEL AI</span>
          <span className="sm:hidden">AI INTEL</span>
        </h2>
        <span className="text-[10px] md:text-xs font-mono text-emerald-400 border border-emerald-500/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded bg-emerald-500/10">
          GEMINI
        </span>
      </div>

      <div className="flex-1 p-3 md:p-6 overflow-y-auto space-y-3 md:space-y-4 z-10 flex flex-col">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex flex-col max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <span className="text-[10px] md:text-xs font-mono mb-1 px-1 text-gold-dark">
                {msg.role === 'user' ? 'YOU' : 'INTEL AI'}
              </span>
              <div className={`p-3 rounded-lg text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user' 
                  ? 'bg-gold text-gunmetal-dark font-medium' 
                  : 'bg-gunmetal border border-gunmetal-dark text-gray-200'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start">
            <div className="p-3 md:p-4 rounded-lg bg-gunmetal border border-gunmetal-dark">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="text-[10px] md:text-xs text-gray-500 font-mono ml-2">ANALYZING...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 md:p-4 bg-[#181C20] border-t border-gunmetal-dark relative z-10">
        {errorMsg && (
          <div className="absolute -top-8 left-0 w-full text-center">
            <span className="bg-red-500/80 text-white px-3 py-1 rounded text-[10px] md:text-xs tracking-wider">{errorMsg}</span>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            placeholder="Ask anything about CODM..."
            className="flex-1 min-w-0 bg-gunmetal border border-gunmetal-dark focus:border-gold/50 rounded-lg py-3 px-3 md:px-6 text-gray-100 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all shadow-inner disabled:opacity-50 font-mono text-xs md:text-sm"
            autoComplete="off"
          />
          <motion.button
            whileHover={buttonHover}
            type="submit"
            disabled={isThinking || !input.trim()}
            className="px-4 md:px-6 py-3 bg-gold text-gunmetal-dark font-black rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 tracking-wider text-xs md:text-sm shrink-0"
          >
            ASK
          </motion.button>
        </div>
      </form>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
    </MotionWrapper>
  )
}

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { moderateMessage } from '../lib/moderation'
import { sanitizeInput, chatLimiter } from '../lib/security'
import MotionWrapper from '../components/common/MotionWrapper'

export default function Chat() {
  const { session, profile } = useStore()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel('world_chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
        scrollToBottom()
      })
      .subscribe()

    // Polling fallback - refresh every 3 seconds
    const interval = setInterval(() => {
      fetchMessages()
    }, 3000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50)
      
    if (data) {
      setMessages(data)
      setTimeout(scrollToBottom, 100)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    if (!session) {
      setErrorMsg("Must be signed in to send messages.")
      return
    }
    
    // Rate limit check
    if (!chatLimiter.canProceed()) {
      setErrorMsg(`RATE LIMITED: Wait ${chatLimiter.getWaitTime()}s before sending.`)
      return
    }
    
    setIsSending(true)
    setErrorMsg('')
    
    // Sanitize input
    const cleanText = sanitizeInput(inputText)
    if (!cleanText) { setIsSending(false); return }
    
    // Auto-Moderation Step
    const modResult = await moderateMessage(cleanText)
    
    if (!modResult.isClean) {
      setErrorMsg(modResult.reason)
      setIsSending(false)
      return
    }

    // Insert to DB
    const { error } = await supabase
      .from('messages')
      .insert([
        { 
          user_id: session.user.id, 
          content: cleanText,
          username: profile?.username || 'NEWBIE'
        }
      ])

    if (error) {
           setErrorMsg("Failed to send message: " + error.message)
    } else {
      setInputText('')
    }
    
    setIsSending(false)
  }

  return (
    <MotionWrapper 
      className="flex flex-col h-[calc(100vh-140px)] md:h-[75vh] bg-gunmetal-light/90 backdrop-blur-md border border-gunmetal-dark rounded-xl overflow-hidden shadow-2xl relative"
    >
      <div className="bg-[#181C20] p-3 md:p-4 border-b border-gold/20 flex justify-between items-center z-10">
        <h2 className="text-base md:text-xl font-bold text-gray-200 flex items-center gap-2 md:gap-3 tracking-wide">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </span>
          WORLD CHAT
        </h2>
        <span className="text-[10px] md:text-xs font-mono text-gold-dark border border-gold-dark/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded bg-gold/5">ENCRYPTED</span>
      </div>
      
      <div className="flex-1 p-3 md:p-6 overflow-y-auto space-y-3 md:space-y-4 z-10 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 font-mono text-xs md:text-sm tracking-widest opacity-60 px-4 text-center">
            NO COMMS SECURED YET. BE THE FIRST.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: msg.user_id === session?.user?.id ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={msg.id || idx} 
              className={`flex flex-col max-w-[85%] md:max-w-[80%] ${msg.user_id === session?.user?.id ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <span className="text-[10px] md:text-xs text-gold-dark font-mono mb-1 px-1">
                {(msg.username === 'Operator' || !msg.username) ? 'NEWBIE' : msg.username} 
              </span>
              <div className={`p-2.5 md:p-3 rounded-lg text-xs md:text-sm break-words ${msg.user_id === session?.user?.id ? 'bg-gold text-gunmetal-dark' : 'bg-gunmetal border border-gunmetal-dark text-gray-200'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-[#181C20] border-t border-gunmetal-dark relative z-10">
        {errorMsg && (
          <div className="absolute -top-8 md:-top-10 left-0 w-full text-center">
             <span className="bg-red-500/80 backdrop-blur border border-red-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded text-[10px] md:text-xs tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.5)]">
               {errorMsg}
             </span>
          </div>
        )}
        <div className="relative">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            placeholder={session ? "Type message..." : "Login to chat"}
            className="w-full bg-gunmetal border border-gunmetal-dark focus:border-gold/50 rounded-lg py-3 px-3 md:px-6 pr-12 md:pr-14 text-gray-100 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all shadow-inner disabled:opacity-50 font-mono text-xs md:text-sm"
            autoComplete="off"
          />
          <button 
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gold hover:text-gold-light w-10 h-10 flex items-center justify-center rounded-md hover:bg-gold/10 transition-colors disabled:opacity-50"
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Background glitch/scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
    </MotionWrapper>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

export default function SetupProfile() {
  const { session, setProfile } = useStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    gaming_uid: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: session.user.id, 
          username: formData.username, 
          gaming_uid: formData.gaming_uid,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile: " + error.message)
      setLoading(false)
    } else {
      setProfile(data)
      setShowToast(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gunmetal-light/50 backdrop-blur-md border border-gold/20 p-8 rounded-xl shadow-2xl relative overflow-hidden"
      >
        {/* Tactical Corner Decoration */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/40" />

        <div className="mb-8 text-center">
          <span className="text-gold font-mono text-[10px] tracking-[0.3em] uppercase mb-2 block">Personnel Initialization</span>
          <h2 className="text-3xl font-black text-gray-100 tracking-tight">ENLIST DETAILS</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 tracking-widest uppercase">Gamer Tag</label>
            <input
              required
              type="text"
              placeholder="e.g. Ghost_07"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-gunmetal border border-gold/10 focus:border-gold/50 outline-none px-4 py-3 text-gold font-bold tracking-wide rounded-md transition-all placeholder:text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 tracking-widest uppercase">CODM UID</label>
            <input
              required
              type="text"
              placeholder="XXXXXXXXXXXXXXX"
              value={formData.gaming_uid}
              onChange={(e) => setFormData({...formData, gaming_uid: e.target.value})}
              className="w-full bg-gunmetal border border-gold/10 focus:border-gold/50 outline-none px-4 py-3 text-gold font-bold tracking-wide rounded-md transition-all placeholder:text-gray-700"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-gold text-gunmetal-dark font-black tracking-[0.2em] rounded-md hover:bg-gold-light transition-all shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          >
            {loading ? "PROCESSING..." : "FINALIZE PROFILE"}
          </button>
        </form>

        <p className="mt-6 text-[10px] text-gray-600 font-mono text-center uppercase tracking-tighter">
          Verification subject to CODM Intel Protocol 41-B
        </p>
      </motion.div>

      {/* Tactical Toast Overlay */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <div className="px-6 py-4 bg-[#1E2328] border-l-4 border-gold shadow-2xl flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-xl">✓</span>
              </div>
              <div>
                <p className="text-xs font-mono text-gold tracking-widest uppercase">Success</p>
                <p className="text-sm font-bold text-gray-200">PROFILE DEPLOYED</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

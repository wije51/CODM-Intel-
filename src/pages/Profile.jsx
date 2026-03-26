import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MotionWrapper from '../components/common/MotionWrapper'

export default function Profile() {
  const { session, profile, setProfile, gamingUid } = useStore()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [uid, setUid] = useState('')
  const navigate = useNavigate()
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setUid(profile.gaming_uid || '')
    }
  }, [profile])

  const handleGoogleLogin = async () => {
    // Check if configuration is missing
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
    if (supabaseUrl.includes('placeholder')) {
      alert("⚠️ CONFIGURATION ERROR: Supabase environment variables are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your project settings.")
      return
    }

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  const saveProfile = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: session.user.id, 
        username, 
        gaming_uid: uid
      })
      .select()
      .single()
      
    if (error) {
      alert("Error saving profile: " + error.message)
    } else {
      setProfile(data)
      alert("Profile data synced securely!")
      navigate('/')
    }
    setLoading(false)
  }

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)",
    transition: { duration: 0.2 }
  }

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gunmetal-light p-8 rounded-xl border border-gunmetal-dark max-w-sm w-full text-center shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
          
          <div className="w-16 h-16 bg-gunmetal rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <span className="text-2xl drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 tracking-wide mb-2">AUTH REQUIRED</h2>
          <p className="text-gray-400 mb-8 text-sm font-mono opacity-80">Authenticate to access secure com-links.</p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-all shadow-md flex items-center justify-center gap-3 active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <MotionWrapper className="max-w-2xl w-full mx-auto">
      <div className="flex items-end justify-between border-b border-gold/20 pb-4 mb-6">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-white tracking-widest">
          HQ PROFILE
        </h2>
        <span className="text-sm font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
          UPLINK ACTIVE
        </span>
      </div>
      
      <div className="bg-gunmetal-light/80 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gunmetal-dark space-y-6 shadow-xl relative">
        <div className="absolute right-0 top-0 w-24 h-24 bg-gold/5 blur-3xl rounded-full"></div>
        
        <div>
          <label className="block text-sm font-mono text-gold-light mb-2 tracking-wider">OPERATOR CODENAME</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#1A1E22] border border-gunmetal-dark/80 rounded py-3 px-4 text-gray-100 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all font-medium text-lg"
            placeholder="Ghost"
          />
          <p className="text-xs text-gray-500 mt-2 font-mono">Visible to other operators in World Chat.</p>
        </div>
        
        <div className="pt-2">
          <label className="block text-sm font-mono text-gold-light mb-2 tracking-wider">CODM STATS_UID</label>
          <input 
            type="text" 
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="w-full bg-[#1A1E22] border border-gunmetal-dark/80 rounded py-3 px-4 text-gold-light focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all font-mono tracking-widest text-lg"
            placeholder="674288192849182"
          />
          <p className="text-xs text-gray-500 mt-2 font-mono">Required for automated rank synchronization.</p>
        </div>
        
        <motion.button 
          whileHover={buttonHover}
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-4 mt-6 bg-gold text-gunmetal-dark font-black tracking-widest rounded text-lg hover:bg-gold-light transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] border-b-4 border-gold-dark hover:border-b-2 hover:-translate-y-[2px]"
        >
          {loading ? 'SYNCING DATA...' : 'ENCRYPT & SAVE'}
        </motion.button>
      </div>
    </MotionWrapper>
  )
}

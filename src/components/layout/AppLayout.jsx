import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { supabase } from '../../lib/supabase'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AppLayout() {
  const { session, profile, isLoadingProfile } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  // Redirect to setup if logged in but no profile
  useEffect(() => {
    if (!isLoadingProfile && session && !profile && location.pathname !== '/setup-profile') {
      navigate('/setup-profile', { replace: true })
    }
  }, [session, profile, isLoadingProfile, location.pathname, navigate])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 0 15px rgba(0, 255, 255, 0.4), 0 0 30px rgba(0, 255, 255, 0.1)",
    transition: { duration: 0.2 }
  }

  const isActive = (path) => location.pathname === path

  const navLink = (path, label) => (
    <Link 
      to={path} 
      onClick={() => setMenuOpen(false)}
      className={`transition-colors duration-200 font-mono text-sm py-2 md:py-0 ${isActive(path) ? 'text-gold' : 'hover:text-gold text-gray-400'}`}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen bg-gunmetal text-gray-200 flex flex-col font-sans">
      <nav className="bg-[#181C20] border-b border-gold/20 px-4 py-3 md:p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-lg md:text-xl font-bold text-gold tracking-wider flex items-center gap-2">
            <span className="text-xl md:text-2xl drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">⚡</span> CODM INTEL
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 items-center">
            {navLink('/chat', 'GLOBAL_CHAT')}
            {navLink('/loadouts', 'ARMORY')}
            {navLink('/ai', 'AI_INTEL')}
            {session ? (
              <>
                {navLink('/profile', 'HQ_PROFILE')}
                <motion.button 
                  whileHover={buttonHover}
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded bg-gunmetal-light border border-gunmetal hover:border-red-500/50 hover:text-red-400 transition-all duration-300 ml-2 text-sm font-bold tracking-wide"
                >
                  DISCONNECT
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={buttonHover}>
                <Link to="/profile" className="px-5 py-2 rounded bg-gold text-gunmetal-dark font-bold block">
                  ENLIST NOW
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden flex flex-col gap-1.5 p-2 rounded hover:bg-gunmetal-light transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-gold transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gold transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gold transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-1 pt-3 border-t border-gold/10">
            {navLink('/chat', '💬 GLOBAL CHAT')}
            {navLink('/loadouts', '🔫 ARMORY')}
            {navLink('/ai', '🤖 AI INTEL')}
            {session ? (
              <>
                {navLink('/profile', '👤 HQ PROFILE')}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded bg-gunmetal-light border border-gunmetal hover:border-red-500/50 hover:text-red-400 transition-all text-sm font-bold tracking-wide text-left mt-2"
                >
                  🔌 DISCONNECT
                </button>
              </>
            ) : (
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="px-5 py-2.5 rounded bg-gold text-gunmetal-dark font-bold text-center mt-2">
                ENLIST NOW
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-3 py-4 md:p-8 flex flex-col relative">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#181C20] border-t border-gold/10 py-3 px-4 text-center">
        <p className="text-[10px] md:text-xs font-mono text-gray-600">CODM INTEL © 2026 • ANTIGRAVITY ENGINE</p>
      </footer>
    </div>
  )
}

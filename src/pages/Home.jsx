import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Home() {
  const { session } = useStore()
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center relative overflow-hidden px-2">
      
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="z-10"
      >
        <span className="text-gold tracking-[0.2em] md:tracking-[0.3em] font-mono text-xs md:text-sm mb-3 md:mb-4 block">SECURE COMM-LINK PROTOCOL</span>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-gold to-gold-dark mb-4 md:mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
          TACTICAL COMMS
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-light px-4">
          Global chat and stat tracking for <strong className="text-gray-200">CODM Elites</strong>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8 z-10 w-full sm:w-auto px-4 sm:px-0"
      >
        <Link to="/chat" className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gold text-gunmetal-dark font-black tracking-wider text-base md:text-lg hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1 text-center">
          ENTER WORLD CHAT
        </Link>
        {!session && (
          <Link to="/profile" className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gunmetal-light/80 backdrop-blur-sm border border-gold/30 text-gold font-bold tracking-wider text-base md:text-lg hover:border-gold hover:bg-gunmetal-light transition-all duration-300 text-center">
            CONNECT PROFILE
          </Link>
        )}
      </motion.div>

      {/* Decorative tactical elements - hidden on mobile */}
      <div className="absolute top-10 left-10 w-32 h-32 border-l border-t border-gold/10 pointer-events-none hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-r border-b border-gold/10 pointer-events-none hidden md:block" />
    </div>
  )
}

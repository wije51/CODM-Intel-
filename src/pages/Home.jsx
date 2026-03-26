import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import MotionWrapper from '../components/common/MotionWrapper'

export default function Home() {
  const { session } = useStore()
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)",
    transition: { duration: 0.2 }
  }

  return (
    <MotionWrapper className="flex-1 flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center relative overflow-hidden px-2">
      
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10"
      >
        <motion.span variants={itemVariants} className="text-gold tracking-[0.2em] md:tracking-[0.3em] font-mono text-xs md:text-sm mb-3 md:mb-4 block">SECURE COMM-LINK PROTOCOL</motion.span>
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-gold to-gold-dark mb-4 md:mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
          TACTICAL COMMS
        </motion.h1>
        <motion.p variants={itemVariants} className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-light px-4">
          Global chat and stat tracking for <strong className="text-gray-200">CODM Elites</strong>.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8 z-10 w-full sm:w-auto px-4 sm:px-0 justify-center"
        >
          <motion.div whileHover={buttonHover}>
            <Link to="/chat" className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gold text-gunmetal-dark font-black tracking-wider text-base md:text-lg block text-center min-w-[200px]">
              ENTER WORLD CHAT
            </Link>
          </motion.div>
          {!session && (
            <motion.div whileHover={buttonHover}>
              <Link to="/profile" className="px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gunmetal-light/80 backdrop-blur-sm border border-gold/30 text-gold font-bold tracking-wider text-base md:text-lg block text-center min-w-[200px]">
                CONNECT PROFILE
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Decorative tactical elements - hidden on mobile */}
      <div className="absolute top-10 left-10 w-32 h-32 border-l border-t border-gold/10 pointer-events-none hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-r border-b border-gold/10 pointer-events-none hidden md:block" />
    </MotionWrapper>
  )
}

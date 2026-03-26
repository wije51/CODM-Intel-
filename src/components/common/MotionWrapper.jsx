import { motion } from 'framer-motion'

/**
 * Reusable component to wrap sections or pages with consistent Framer Motion animations.
 * Default preset is a smooth "Fade and Scale" effect.
 */
export default function MotionWrapper({ 
  children, 
  className = "", 
  initial = { opacity: 0, scale: 0.95 },
  animate = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 1.05 },
  transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  viewport = { once: true, amount: 0.2 }
}) {
  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={viewport}
      exit={exit}
      transition={transition}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'
import ErrorBoundary from './components/ErrorBoundary'
import AppLayout from './components/layout/AppLayout'

// Lazy load pages for code splitting & performance
const Home = lazy(() => import('./pages/Home'))
const Chat = lazy(() => import('./pages/Chat'))
const Profile = lazy(() => import('./pages/Profile'))
const Loadouts = lazy(() => import('./pages/Loadouts'))
const AIAgent = lazy(() => import('./pages/AIAgent'))
const SetupProfile = lazy(() => import('./pages/SetupProfile'))

// Loading fallback
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-mono text-gray-500 tracking-widest">LOADING MODULE...</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/loadouts" element={<Loadouts />} />
          <Route path="/ai" element={<AIAgent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setup-profile" element={<SetupProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const { setSession, setProfile } = useStore()

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    }).catch(err => {
      console.error("Supabase config not found or invalid")
      setProfile(null)
    })

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (!error && data) {
        setProfile(data)
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
      setProfile(null)
    }
  }

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App

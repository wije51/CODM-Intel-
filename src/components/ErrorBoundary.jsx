import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    
    // Send error notification email
    this.sendErrorNotification(error, errorInfo)
  }

  async sendErrorNotification(error, errorInfo) {
    const email = import.meta.env.VITE_ERROR_EMAIL || 'dopejaniya599@gmail.com'
    
    try {
      // Log to Supabase for tracking
      const { supabase } = await import('../lib/supabase')
      await supabase.from('error_logs').insert([{
        message: error?.message || 'Unknown error',
        stack: error?.stack || '',
        component_stack: errorInfo?.componentStack || '',
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      }]).catch(() => {}) // Silent fail if table doesn't exist
      
      console.log(`[ERROR DISPATCH] Error logged. Notification target: ${email}`)
    } catch (e) {
      console.error('Failed to log error:', e)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gunmetal flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-gunmetal-light border border-red-500/30 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-400 tracking-wider mb-3">SYSTEM MALFUNCTION</h2>
            <p className="text-gray-400 text-sm font-mono mb-2">Critical error detected in the comm-link.</p>
            <p className="text-gray-500 text-xs font-mono mb-6 bg-gunmetal p-3 rounded border border-gunmetal-dark break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Error report dispatched to <span className="text-gold">dopejaniya599@gmail.com</span>
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
              className="px-8 py-3 bg-gold text-gunmetal-dark font-bold rounded hover:bg-gold-light transition-all"
            >
              RETURN TO BASE
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

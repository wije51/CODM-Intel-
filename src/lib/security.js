// Input Sanitization - prevent XSS attacks
export function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 500) // Max 500 characters per message
}

// Rate Limiter - prevent spam
class RateLimiter {
  constructor(maxRequests = 5, windowMs = 10000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = []
  }

  canProceed() {
    const now = Date.now()
    this.requests = this.requests.filter(t => now - t < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }

  getWaitTime() {
    if (this.requests.length === 0) return 0
    const oldest = this.requests[0]
    const timeLeft = this.windowMs - (Date.now() - oldest)
    return Math.max(0, Math.ceil(timeLeft / 1000))
  }
}

// Chat: 5 messages per 10 seconds
export const chatLimiter = new RateLimiter(5, 10000)

// Loadout: 3 posts per 30 seconds
export const loadoutLimiter = new RateLimiter(3, 30000)

// AI: 3 queries per 15 seconds
export const aiLimiter = new RateLimiter(3, 15000)

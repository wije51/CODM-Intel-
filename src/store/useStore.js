import { create } from 'zustand'

export const useStore = create((set) => ({
  session: null,
  user: null,
  profile: null,
  gamingUid: null,
  setSession: (session) => set({ session, user: session?.user || null }),
  setProfile: (profile) => set({ 
    profile, 
    gamingUid: profile?.gaming_uid || null 
  }),
  logout: () => set({ session: null, user: null, profile: null, gamingUid: null })
}))

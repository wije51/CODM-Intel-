import { create } from 'zustand'

export const useStore = create((set) => ({
  session: null,
  user: null,
  profile: null,
  gamingUid: null,
  isLoadingProfile: true, // Start as true during initial check
  setSession: (session) => set({ session, user: session?.user || null }),
  setProfile: (profile) => set({ 
    profile, 
    gamingUid: profile?.gaming_uid || null,
    isLoadingProfile: false
  }),
  setLoadingProfile: (loading) => set({ isLoadingProfile: loading }),
  logout: () => set({ session: null, user: null, profile: null, gamingUid: null, isLoadingProfile: false })
}))

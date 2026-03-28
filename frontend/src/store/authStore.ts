import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  setAuth: (user, token) => set({ user, accessToken: token, isLoading: false }),
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, accessToken: null, isLoading: false }),
  setLoading: (v) => set({ isLoading: v }),
}))

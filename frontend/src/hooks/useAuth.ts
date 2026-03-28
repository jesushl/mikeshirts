import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import type { AuthTokens, User } from '../types'

export function useAuth() {
  const { user, isLoading, setAuth, setUser, logout: storeLogout, setLoading } = useAuthStore()
  const cartMerge = useCartStore((s) => s.merge)
  const cartFetch = useCartStore((s) => s.fetchCart)
  const cartClear = useCartStore((s) => s.setCart)

  const tryRefresh = useCallback(async () => {
    try {
      const { data } = await api.post<{ access: string }>('/auth/token/refresh/')
      const { data: me } = await api.get<User>('/auth/me/', {
        headers: { Authorization: `Bearer ${data.access}` },
      })
      setAuth(me, data.access)
      cartFetch()
    } catch {
      storeLogout()
    }
  }, [setAuth, storeLogout, cartFetch])

  useEffect(() => {
    tryRefresh()
  }, [tryRefresh])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthTokens>('/auth/login/', { email, password })
    setAuth(data.user, data.access)
    await cartMerge()
  }

  const register = async (payload: {
    email: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
  }) => {
    const { data } = await api.post<AuthTokens>('/auth/register/', payload)
    setAuth(data.user, data.access)
    await cartMerge()
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout/')
    } catch { /* ignore */ }
    storeLogout()
    cartClear(null)
  }

  const updateProfile = async (payload: Partial<User>) => {
    const { data } = await api.patch<User>('/auth/me/', payload)
    setUser(data)
    return data
  }

  return { user, isLoading, login, register, logout, updateProfile }
}

export function useRequireAuth() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, isLoading, navigate])

  return { user, isLoading }
}

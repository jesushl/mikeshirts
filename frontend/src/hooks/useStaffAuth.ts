import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const STAFF_GROUPS = ['ventas', 'envios', 'produccion', 'admin_full']

export function useStaffAuth() {
  const { user, isLoading } = useAuthStore()

  const groups = user?.groups ?? []
  const isStaff = groups.some((g) => STAFF_GROUPS.includes(g))
  const isAdmin = groups.includes('admin_full')

  function hasRole(role: string): boolean {
    return groups.includes(role) || groups.includes('admin_full')
  }

  return { user, isLoading, isStaff, isAdmin, hasRole }
}

export function useRequireStaff() {
  const navigate = useNavigate()
  const { user, isLoading, isStaff } = useStaffAuth()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      navigate('/login', { replace: true })
    } else if (!isStaff) {
      navigate('/', { replace: true })
    }
  }, [user, isLoading, isStaff, navigate])

  return useStaffAuth()
}

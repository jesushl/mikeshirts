import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err: any) {
      setErrors(err.response?.data || { general: ['Error al crear cuenta.'] })
    } finally {
      setLoading(false)
    }
  }

  const fieldError = (field: string) =>
    errors[field]?.map((e, i) => (
      <p key={i} className="text-accent text-xs mt-1">{e}</p>
    ))

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Mike Shirts" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-text-muted text-sm mt-1">Únete a la tribu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.non_field_errors && (
            <div className="bg-accent/10 border border-accent/30 text-accent px-4 py-3 rounded-lg text-sm">
              {errors.non_field_errors.join(' ')}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input value={form.first_name} onChange={set('first_name')} required className="w-full" />
              {fieldError('first_name')}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input value={form.last_name} onChange={set('last_name')} required className="w-full" />
              {fieldError('last_name')}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email} onChange={set('email')} required className="w-full" />
            {fieldError('email')}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input type="password" value={form.password} onChange={set('password')} required className="w-full" />
            {fieldError('password')}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
            <input type="password" value={form.password_confirm} onChange={set('password_confirm')} required className="w-full" />
            {fieldError('password_confirm')}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-cyan hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

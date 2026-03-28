import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useRequireAuth } from '../../hooks/useAuth'
import api from '../../api/client'
import type { Address } from '../../types'

export default function ProfilePage() {
  const { user, isLoading, updateProfile, logout } = useAuth()
  useRequireAuth()

  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', rfc: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        rfc: user.rfc,
      })
      setAddresses(user.addresses)
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const deleteAddress = async (id: number) => {
    await api.delete(`/auth/me/addresses/${id}/`)
    setAddresses((a) => a.filter((x) => x.id !== id))
  }

  if (isLoading) return <div className="p-8 text-center text-text-muted">Cargando...</div>
  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Mi Cuenta</h1>
        <p className="text-text-muted text-sm">{user.email}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <h2 className="text-lg font-semibold">Datos Personales</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Nombre"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            className="w-full"
          />
          <input
            placeholder="Apellido"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            className="w-full"
          />
        </div>
        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full"
        />
        <input
          placeholder="RFC (opcional)"
          value={form.rfc}
          onChange={(e) => setForm((f) => ({ ...f, rfc: e.target.value }))}
          className="w-full"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          {saved && <span className="text-green-400 text-sm">Guardado</span>}
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Direcciones</h2>
          <Link
            to="/cuenta/direcciones/nueva"
            className="text-sm text-cyan hover:underline"
          >
            + Agregar
          </Link>
        </div>
        {addresses.length === 0 ? (
          <p className="text-text-muted text-sm">No tienes direcciones guardadas.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-surface border border-border rounded-lg p-4 flex justify-between items-start">
                <div className="text-sm">
                  {addr.label && <span className="text-cyan font-medium mr-2">{addr.label}</span>}
                  {addr.is_default && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Principal</span>}
                  <p className="mt-1">{addr.street} {addr.ext_number}{addr.int_number ? ` Int. ${addr.int_number}` : ''}</p>
                  <p className="text-text-muted">{addr.neighborhood}, {addr.city}, {addr.state} {addr.zip_code}</p>
                </div>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-text-muted hover:text-accent text-sm transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="text-sm text-text-muted hover:text-accent transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}

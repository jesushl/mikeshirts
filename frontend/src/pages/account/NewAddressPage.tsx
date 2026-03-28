import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { useRequireAuth } from '../../hooks/useAuth'

const EMPTY = {
  label: '',
  street: '',
  ext_number: '',
  int_number: '',
  neighborhood: '',
  city: '',
  state: '',
  zip_code: '',
  is_default: false,
}

export default function NewAddressPage() {
  useRequireAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await api.post('/auth/me/addresses/', form)
      navigate('/cuenta')
    } catch (err: any) {
      setErrors(err.response?.data || {})
    }
    setSaving(false)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nueva Dirección</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Etiqueta (ej. Casa, Oficina)" value={form.label} onChange={set('label')} className="w-full" />
        <input placeholder="Calle" value={form.street} onChange={set('street')} required className="w-full" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Núm. exterior" value={form.ext_number} onChange={set('ext_number')} required className="w-full" />
          <input placeholder="Núm. interior" value={form.int_number} onChange={set('int_number')} className="w-full" />
        </div>
        <input placeholder="Colonia" value={form.neighborhood} onChange={set('neighborhood')} required className="w-full" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Ciudad" value={form.city} onChange={set('city')} required className="w-full" />
          <input placeholder="Estado" value={form.state} onChange={set('state')} required className="w-full" />
        </div>
        <input placeholder="Código postal" value={form.zip_code} onChange={set('zip_code')} required className="w-full" />

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
            className="rounded border-border bg-brand-light text-accent focus:ring-accent"
          />
          Dirección principal
        </label>

        {Object.values(errors).flat().map((e, i) => (
          <p key={i} className="text-accent text-xs">{e}</p>
        ))}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 rounded-lg font-medium transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/cuenta')}
            className="px-6 py-2.5 border border-border rounded-lg hover:bg-brand-lighter transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

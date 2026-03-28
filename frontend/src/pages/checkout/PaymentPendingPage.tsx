import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../../store/cartStore'
import { useEffect } from 'react'

export default function PaymentPendingPage() {
  const setCart = useCartStore((s) => s.setCart)

  useEffect(() => {
    setCart(null)
  }, [setCart])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <Helmet>
        <title>Pago Pendiente — Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-3xl font-black mb-2">Pago pendiente</h1>
      <p className="text-text-muted mb-4">
        Tu pago está siendo procesado. Si pagaste en OXXO o por transferencia SPEI,
        la confirmación puede tardar unas horas.
      </p>
      <p className="text-text-muted mb-8">
        Te enviaremos un email cuando se confirme tu pago. También puedes revisar el estado
        en la sección de pedidos.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/pedidos"
          className="px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg font-bold transition-colors"
        >
          Ver mis pedidos
        </Link>
        <Link
          to="/catalogo"
          className="px-6 py-3 border border-border hover:border-text-muted rounded-lg font-medium transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}

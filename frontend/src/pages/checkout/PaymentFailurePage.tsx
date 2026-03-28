import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function PaymentFailurePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <Helmet>
        <title>Pago no completado — Mike Shirts</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-black mb-2">El pago no se completó</h1>
      <p className="text-text-muted mb-8">
        Hubo un problema con tu pago. Tu carrito sigue intacto — puedes intentar de nuevo.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/checkout"
          className="px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg font-bold transition-colors"
        >
          Intentar de nuevo
        </Link>
        <Link
          to="/carrito"
          className="px-6 py-3 border border-border hover:border-text-muted rounded-lg font-medium transition-colors"
        >
          Volver al carrito
        </Link>
      </div>
    </div>
  )
}

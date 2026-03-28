import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-brand-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-text-muted">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="" className="h-8 w-8" />
            <span className="text-text font-bold">MIKE SHIRTS</span>
          </div>
          <p>Playeras geek con identidad mexicana. Diseños originales, producción local.</p>
        </div>
        <div>
          <h4 className="text-text font-semibold mb-3">Tienda</h4>
          <ul className="space-y-2">
            <li><Link to="/catalogo" className="hover:text-text transition-colors">Catálogo</Link></li>
            <li><Link to="/pedidos" className="hover:text-text transition-colors">Mis Pedidos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-text font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/envios" className="hover:text-text transition-colors">Política de Envío</Link></li>
            <li><Link to="/devoluciones" className="hover:text-text transition-colors">Devoluciones</Link></li>
            <li><Link to="/privacidad" className="hover:text-text transition-colors">Privacidad</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border text-center text-xs text-text-muted py-4">
        © {new Date().getFullYear()} Mike Shirts. Todos los derechos reservados.
      </div>
    </footer>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/account/ProfilePage'
import NewAddressPage from './pages/account/NewAddressPage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/checkout/PaymentSuccessPage'
import PaymentFailurePage from './pages/checkout/PaymentFailurePage'
import PaymentPendingPage from './pages/checkout/PaymentPendingPage'
import OrdersPage from './pages/orders/OrdersPage'
import OrderDetailPage from './pages/orders/OrderDetailPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminVentasPage from './pages/admin/AdminVentasPage'
import AdminProduccionPage from './pages/admin/AdminProduccionPage'
import AdminEnviosPage from './pages/admin/AdminEnviosPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import ShippingPolicyPage from './pages/legal/ShippingPolicyPage'
import ReturnsPage from './pages/legal/ReturnsPage'
import PrivacyPage from './pages/legal/PrivacyPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cuenta" element={<ProfilePage />} />
          <Route path="/cuenta/direcciones/nueva" element={<NewAddressPage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<PaymentSuccessPage />} />
          <Route path="/checkout/failure" element={<PaymentFailurePage />} />
          <Route path="/checkout/pending" element={<PaymentPendingPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/pedidos/:id" element={<OrderDetailPage />} />
          <Route path="/envios" element={<ShippingPolicyPage />} />
          <Route path="/devoluciones" element={<ReturnsPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/gestion" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="ventas" element={<AdminVentasPage />} />
          <Route path="produccion" element={<AdminProduccionPage />} />
          <Route path="envios" element={<AdminEnviosPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-black mb-4">404</h1>
      <p className="text-xl text-text-muted mb-6">Página no encontrada</p>
      <a href="/" className="text-accent hover:text-accent-hover font-medium">
        ← Volver al inicio
      </a>
    </div>
  )
}

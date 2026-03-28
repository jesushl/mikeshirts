import api from '../api/client'
import type { PaginatedResponse } from '../types'

// --- Types ---

export interface DashboardData {
  orders_today: number
  revenue_today: string
  pending_orders: number
  pending_production: number
  in_production: number
  pending_shipping: number
  low_stock_count: number
}

export interface AdminOrder {
  id: number
  user_email: string
  status: string
  status_display: string
  total: string
  item_count: number
  created_at: string
}

export interface AdminOrderDetail {
  id: number
  user_email: string
  status: string
  status_display: string
  shipping_address: Record<string, string>
  subtotal: string
  shipping_cost: string
  total: string
  mp_preference_id: string
  mp_payment_id: string
  items: { id: number; product_name: string; variant_desc: string; quantity: number; unit_price: string; line_total: string }[]
  created_at: string
  updated_at: string
}

export interface AdminSaleTicket {
  id: number
  folio: string
  order_id: number
  order_total: string
  user_email: string
  issued_at: string
}

export interface AdminProductionTicket {
  id: number
  order_id: number
  variant_sku: string
  product_name: string
  quantity_needed: number
  status: string
  status_display: string
  estimated_completion: string | null
  completed_at: string | null
  created_at: string
}

export interface AdminShipTicket {
  id: number
  order_id: number
  user_email: string
  tracking_number: string
  carrier: string
  shipping_cost: string
  status: string
  status_display: string
  shipped_at: string | null
  delivered_at: string | null
  created_at: string
}

export interface VentasMetrics {
  period_days: number
  total_sales: string
  order_count: number
  avg_ticket: string
}

export interface AnalyticsData {
  period_days: number
  total_visits: number
  unique_visitors: number
  total_pageviews: number
  funnel: Record<string, number>
  conversion_rate: number
  top_referrers: { referrer: string; count: number }[]
  top_utm_sources: { utm_source: string; count: number }[]
}

// --- Dashboard ---

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/admin/dashboard/')
  return data
}

// --- Ventas ---

export async function fetchAdminOrders(params?: Record<string, string>): Promise<PaginatedResponse<AdminOrder>> {
  const { data } = await api.get<PaginatedResponse<AdminOrder>>('/admin/ventas/orders/', { params })
  return data
}

export async function fetchAdminOrder(id: number): Promise<AdminOrderDetail> {
  const { data } = await api.get<AdminOrderDetail>(`/admin/ventas/orders/${id}/`)
  return data
}

export async function fetchSaleTickets(): Promise<PaginatedResponse<AdminSaleTicket>> {
  const { data } = await api.get<PaginatedResponse<AdminSaleTicket>>('/admin/ventas/tickets/')
  return data
}

export async function fetchVentasMetrics(days = 30): Promise<VentasMetrics> {
  const { data } = await api.get<VentasMetrics>('/admin/ventas/metrics/', { params: { days } })
  return data
}

// --- Producción ---

export async function fetchProductionTickets(params?: Record<string, string>): Promise<PaginatedResponse<AdminProductionTicket>> {
  const { data } = await api.get<PaginatedResponse<AdminProductionTicket>>('/admin/production/tickets/', { params })
  return data
}

export async function updateProductionTicket(id: number, payload: Partial<AdminProductionTicket>): Promise<AdminProductionTicket> {
  const { data } = await api.patch<AdminProductionTicket>(`/admin/production/tickets/${id}/`, payload)
  return data
}

// --- Envíos ---

export async function fetchShipTickets(params?: Record<string, string>): Promise<PaginatedResponse<AdminShipTicket>> {
  const { data } = await api.get<PaginatedResponse<AdminShipTicket>>('/admin/shipping/tickets/', { params })
  return data
}

export async function updateShipTicket(id: number, payload: Partial<AdminShipTicket>): Promise<AdminShipTicket> {
  const { data } = await api.patch<AdminShipTicket>(`/admin/shipping/tickets/${id}/`, payload)
  return data
}

// --- Analítica ---

export async function fetchAnalytics(days = 30): Promise<AnalyticsData> {
  const { data } = await api.get<AnalyticsData>('/admin/analytics/', { params: { days } })
  return data
}

import api from '../api/client'
import type {
  CheckoutResponse,
  OrderDetail,
  OrderListItem,
  PaginatedResponse,
} from '../types'

export async function checkout(shippingAddressId: number): Promise<CheckoutResponse> {
  const { data } = await api.post<CheckoutResponse>('/orders/checkout/', {
    shipping_address_id: shippingAddressId,
  })
  return data
}

export async function fetchOrders(): Promise<PaginatedResponse<OrderListItem>> {
  const { data } = await api.get<PaginatedResponse<OrderListItem>>('/orders/')
  return data
}

export async function fetchOrder(id: number): Promise<OrderDetail> {
  const { data } = await api.get<OrderDetail>(`/orders/${id}/`)
  return data
}

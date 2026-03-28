export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  phone: string
  rfc: string
  auth_provider: string
  is_profile_complete: boolean
  is_staff: boolean
  groups: string[]
  addresses: Address[]
  date_joined: string
}

export interface Address {
  id: number
  label: string
  street: string
  ext_number: string
  int_number: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string | null
}

export interface VariantStock {
  quantity: number
  production_days: number
  availability: 'in_stock' | 'made_to_order' | 'unavailable'
  is_low_stock: boolean
}

export interface Variant {
  id: number
  size: string
  size_display: string
  color: string
  color_display: string
  sku: string
  effective_price: string
  stock: VariantStock | null
}

export interface ProductImage {
  id: number
  image: string
  alt_text: string
  position: number
  is_main: boolean
}

export interface ProductListItem {
  id: number
  name: string
  slug: string
  base_price: string
  category: Category
  main_image: string | null
  availability: string
  created_at: string
}

export interface ProductDetail {
  id: number
  name: string
  slug: string
  description: string
  base_price: string
  category: Category
  size_chart: SizeChartEntry[]
  images: ProductImage[]
  variants: Variant[]
  created_at: string
  updated_at: string
}

export interface SizeChartEntry {
  size: string
  chest: number
  length: number
  shoulder: number
}

export interface CartItem {
  variant_id: number
  product_name: string
  product_slug: string
  size: string
  color: string
  sku: string
  unit_price: string
  quantity: number
  line_total: string
  image: string | null
}

export interface Cart {
  items: CartItem[]
  item_count: number
  subtotal: string
  shipping: string
  total: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface AuthTokens {
  access: string
  user: User
}

// Orders

export interface OrderListItem {
  id: number
  status: string
  status_display: string
  total: string
  item_count: number
  created_at: string
}

export interface OrderItem {
  id: number
  product_name: string
  variant_desc: string
  quantity: number
  unit_price: string
  line_total: string
}

export interface SaleTicket {
  folio: string
  issued_at: string
}

export interface ShipTicket {
  tracking_number: string
  carrier: string
  shipping_cost: string
  status: string
  status_display: string
  shipped_at: string | null
  delivered_at: string | null
}

export interface ProductionTicket {
  id: number
  quantity_needed: number
  status: string
  status_display: string
  estimated_completion: string | null
  completed_at: string | null
}

export interface OrderDetail {
  id: number
  status: string
  status_display: string
  shipping_address: Record<string, string>
  subtotal: string
  shipping_cost: string
  total: string
  items: OrderItem[]
  sale_ticket: SaleTicket | null
  ship_ticket: ShipTicket | null
  production_tickets: ProductionTicket[]
  created_at: string
  updated_at: string
}

export interface CheckoutResponse {
  order_id: number
  init_point: string
}

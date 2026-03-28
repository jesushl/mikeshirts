export function formatMXN(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export function availabilityLabel(
  availability: string,
  productionDays?: number,
): string {
  switch (availability) {
    case 'in_stock':
      return 'Disponible'
    case 'made_to_order':
      return productionDays
        ? `Se produce en ${productionDays} días`
        : 'Sobre pedido'
    default:
      return 'Agotado'
  }
}

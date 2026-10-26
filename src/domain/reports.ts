export type ReportProduct = { id: string; name: string; category: string; price: number }
export type ReportOrder = {
  status: 'open' | 'paid' | 'cancelled'
  completedAt: Date
  paidAt?: Date
  items: { product: ReportProduct; quantity: number }[]
}
export type ProductSales = { id: string; name: string; category: string; quantity: number; revenue: number }

export function calculateProductSales(products: ReportProduct[], orders: ReportOrder[]): ProductSales[] {
  const totals = new Map(products.map((product) => [product.id, {
    id: product.id, name: product.name, category: product.category, quantity: 0, revenue: 0,
  }]))
  for (const order of orders) {
    if (order.status !== 'paid') continue
    for (const item of order.items) {
      let total = totals.get(item.product.id)
      if (!total) {
        total = {
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
          quantity: 0,
          revenue: 0,
        }
        totals.set(item.product.id, total)
      }
      total.quantity += item.quantity
      total.revenue += item.product.price * item.quantity
    }
  }
  return [...totals.values()]
}

export function getServiceDurations(orders: ReportOrder[]): number[] {
  return orders
    .filter((order) => order.status === 'paid' && order.paidAt)
    .map((order) => order.paidAt!.getTime() - order.completedAt.getTime())
    .filter((duration) => Number.isFinite(duration) && duration >= 0)
    .sort((left, right) => left - right)
}

export function getMedian(values: number[]): number | null {
  if (values.length === 0) return null
  const middle = Math.floor(values.length / 2)
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2
}

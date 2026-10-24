export type OrderStatus = 'open' | 'paid' | 'cancelled'
export type PaymentMethod = 'cash' | 'card'

export type OrderLine = { productId: string; name: string; unitPrice: number; quantity: number }
export type RestaurantOrder = {
  number: number
  tableId: number
  items: OrderLine[]
  total: number
  createdAt: Date
  updatedAt: Date
  status: OrderStatus
  paymentMethod?: PaymentMethod
  paidAt?: Date
}

export function calculateOrderTotal(items: OrderLine[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

export function getOpenOrderForTable(orders: RestaurantOrder[], tableId: number): RestaurantOrder | undefined {
  return orders.find((order) => order.tableId === tableId && order.status === 'open')
}

export function addItemsToOpenOrder(order: RestaurantOrder, items: OrderLine[], updatedAt = new Date()): RestaurantOrder {
  if (order.status !== 'open') throw new Error('Only an open order can be updated.')
  const merged = [...order.items]
  for (const item of items) {
    const existing = merged.find((line) => line.productId === item.productId && line.unitPrice === item.unitPrice && line.name === item.name)
    if (existing) existing.quantity += item.quantity
    else merged.push({ ...item })
  }
  return { ...order, items: merged, total: calculateOrderTotal(merged), updatedAt }
}

export function markOrderPaid(order: RestaurantOrder, method: PaymentMethod, paidAt = new Date()): RestaurantOrder {
  if (order.status !== 'open') throw new Error('Only an open order can be paid.')
  return { ...order, status: 'paid', paymentMethod: method, paidAt, updatedAt: paidAt }
}

export function getTableStatus(orders: RestaurantOrder[], tableId: number): 'available' | 'occupied' {
  return getOpenOrderForTable(orders, tableId) ? 'occupied' : 'available'
}

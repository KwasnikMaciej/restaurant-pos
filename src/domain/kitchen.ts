export type KitchenStatus = 'queued' | 'preparing' | 'ready'

export type KitchenOrderItem = {
  kitchenStatus?: KitchenStatus
  [key: string]: unknown
}

export type KitchenOrder<TItem extends KitchenOrderItem = KitchenOrderItem> = {
  number: number
  tableId: number
  items: TItem[]
  status: 'open' | 'paid' | 'cancelled'
}

export function getKitchenStatus(item: KitchenOrderItem): KitchenStatus {
  return item.kitchenStatus ?? 'queued'
}

export function updateKitchenItemStatus<TItem extends KitchenOrderItem>(
  order: KitchenOrder<TItem>,
  itemIndex: number,
  status: KitchenStatus,
): KitchenOrder<TItem> {
  if (order.status !== 'open') throw new Error('Only open orders can be processed by the kitchen.')
  if (!Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= order.items.length) {
    throw new RangeError('Kitchen order item does not exist.')
  }
  const items = order.items.map((item, index) => index === itemIndex ? { ...item, kitchenStatus: status } : item)
  return { ...order, items }
}

export function getNextKitchenStatus(status: KitchenStatus): KitchenStatus {
  if (status === 'queued') return 'preparing'
  if (status === 'preparing') return 'ready'
  return 'ready'
}

export function getKitchenOrderProgress(order: KitchenOrder): { ready: number; total: number; preparing: number; queued: number } {
  const statuses = order.items.flatMap((item) => Array.from({ length: Math.max(0, Number((item as { quantity?: number }).quantity) || 0) }, () => getKitchenStatus(item)))
  return {
    ready: statuses.filter((status) => status === 'ready').length,
    preparing: statuses.filter((status) => status === 'preparing').length,
    queued: statuses.filter((status) => status === 'queued').length,
    total: statuses.length,
  }
}

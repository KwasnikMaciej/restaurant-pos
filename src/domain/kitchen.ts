export type KitchenStatus = 'queued' | 'preparing' | 'ready'

export type KitchenOrderItem = {
  kitchenStatus?: KitchenStatus
  quantity: number
}

export type KitchenOrder<TItem extends KitchenOrderItem = KitchenOrderItem> = {
  number: number
  status: 'open' | 'paid' | 'cancelled'
  items: TItem[]
}

export function getKitchenStatus(item: KitchenOrderItem): KitchenStatus {
  return item.kitchenStatus ?? 'queued'
}

export function updateKitchenItemStatus<
  TItem extends KitchenOrderItem,
  TOrder extends { status: 'open' | 'paid' | 'cancelled'; items: TItem[] },
>(
  order: TOrder,
  itemIndex: number,
  status: KitchenStatus,
): TOrder {
  if (order.status !== 'open') throw new Error('Only open orders can be processed by the kitchen.')
  if (!Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= order.items.length) {
    throw new RangeError('Kitchen order item does not exist.')
  }
  return { ...order, items: order.items.map((item, index) => index === itemIndex ? { ...item, kitchenStatus: status } : item) } as TOrder
}

export function getKitchenOrderProgress(order: KitchenOrder): { ready: number; total: number; preparing: number; queued: number } {
  const statuses = order.items.flatMap((item) => Array.from({ length: Math.max(0, Number(item.quantity) || 0) }, () => getKitchenStatus(item)))
  return {
    ready: statuses.filter((status) => status === 'ready').length,
    preparing: statuses.filter((status) => status === 'preparing').length,
    queued: statuses.filter((status) => status === 'queued').length,
    total: statuses.length,
  }
}

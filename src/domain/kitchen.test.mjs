import assert from 'node:assert/strict'
import test from 'node:test'
import { getKitchenOrderProgress, getKitchenStatus, updateKitchenItemStatus } from './kitchen.ts'

const order = { number: 42, status: 'open', items: [
  { quantity: 2 },
  { quantity: 1, kitchenStatus: 'preparing' },
] }

test('new order items enter kitchen queue by default', () => {
  assert.equal(getKitchenStatus(order.items[0]), 'queued')
})

test('kitchen can update an item and preserve original order', () => {
  const updated = updateKitchenItemStatus(order, 0, 'preparing')
  assert.equal(updated.items[0].kitchenStatus, 'preparing')
  assert.equal(order.items[0].kitchenStatus, undefined)
})

test('progress counts ordered portions', () => {
  assert.deepEqual(getKitchenOrderProgress(order), { ready: 0, preparing: 1, queued: 2, total: 3 })
})

test('rejects changes to paid orders and invalid item indices', () => {
  assert.throws(() => updateKitchenItemStatus({ ...order, status: 'paid' }, 0, 'ready'), /Only open orders/)
  assert.throws(() => updateKitchenItemStatus(order, 9, 'ready'), RangeError)
})

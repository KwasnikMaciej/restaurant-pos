import assert from 'node:assert/strict'
import test from 'node:test'
import { getKitchenOrderProgress, getKitchenStatus, getNextKitchenStatus, updateKitchenItemStatus } from './kitchen.ts'

const order = { number: 42, tableId: 3, status: 'open', items: [
  { product: { id: 'soup', name: 'Rosół' }, quantity: 2 },
  { product: { id: 'cake', name: 'Sernik' }, quantity: 1, kitchenStatus: 'preparing' },
] }

test('new order items enter kitchen queue by default', () => {
  assert.equal(getKitchenStatus(order.items[0]), 'queued')
})

test('kitchen can move an item through preparing and ready', () => {
  const preparing = updateKitchenItemStatus(order, 0, 'preparing')
  const ready = updateKitchenItemStatus(preparing, 0, 'ready')
  assert.equal(ready.items[0].kitchenStatus, 'ready')
  assert.equal(order.items[0].kitchenStatus, undefined)
})

test('progress counts each ordered portion', () => {
  assert.deepEqual(getKitchenOrderProgress(order), { ready: 0, preparing: 1, queued: 2, total: 3 })
})

test('rejects changes to paid orders and invalid item indices', () => {
  assert.throws(() => updateKitchenItemStatus({ ...order, status: 'paid' }, 0, 'ready'), /Only open orders/)
  assert.throws(() => updateKitchenItemStatus(order, 9, 'ready'), RangeError)
})

test('ready items remain ready when advanced again', () => {
  assert.equal(getNextKitchenStatus('ready'), 'ready')
})

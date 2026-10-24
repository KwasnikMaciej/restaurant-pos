import assert from 'node:assert/strict'
import test from 'node:test'
import { addItemsToOpenOrder, calculateOrderTotal, getTableStatus, markOrderPaid } from './orders.ts'

const soup = { productId: 'soup', name: 'Rosół', unitPrice: 1600, quantity: 2 }
const dessert = { productId: 'cake', name: 'Sernik', unitPrice: 1500, quantity: 1 }
const order = { number: 1, tableId: 3, items: [soup], total: 3200, createdAt: new Date('2026-01-01T12:00:00Z'), updatedAt: new Date('2026-01-01T12:00:00Z'), status: 'open' }

test('calculates totals in integer grosze', () => assert.equal(calculateOrderTotal([soup, dessert]), 4700))
test('derives table status from its open order', () => {
  assert.equal(getTableStatus([order], 3), 'occupied')
  assert.equal(getTableStatus([order], 4), 'available')
  assert.equal(getTableStatus([{ ...order, status: 'paid' }], 3), 'available')
})
test('adds items to the same open order and recalculates total', () => {
  const updated = addItemsToOpenOrder(order, [dessert])
  assert.equal(updated.number, order.number)
  assert.equal(updated.items.length, 2)
  assert.equal(updated.total, 4700)
  assert.equal(order.items.length, 1)
})
test('records a payment without mutating the original order', () => {
  const paidAt = new Date('2026-01-01T12:15:00Z')
  const paid = markOrderPaid(order, 'card', paidAt)
  assert.equal(paid.status, 'paid')
  assert.equal(paid.paymentMethod, 'card')
  assert.equal(paid.paidAt, paidAt)
  assert.equal(order.status, 'open')
})
test('prevents paying or changing a closed order twice', () => {
  assert.throws(() => markOrderPaid(markOrderPaid(order, 'cash'), 'card'), /Only an open order/)
  assert.throws(() => addItemsToOpenOrder(markOrderPaid(order, 'cash'), [dessert]), /Only an open order/)
})

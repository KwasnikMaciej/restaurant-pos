import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateProductSales, getMedian, getServiceDurations } from './reports.ts'

const soup = { id: 'soup', name: 'Rosół', category: 'Zupy', price: 1900 }
const cake = { id: 'cake', name: 'Sernik', category: 'Desery', price: 2100 }
const start = new Date('2026-10-26T12:00:00Z')

test('calculates paid product quantities and revenue while retaining unsold products', () => {
  const products = [soup, cake]
  const sales = calculateProductSales(products, [{
    status: 'paid', completedAt: start, paidAt: new Date('2026-10-26T12:20:00Z'),
    items: [{ product: soup, quantity: 2 }],
  }])
  assert.deepEqual(sales.map(({ id, quantity, revenue }) => ({ id, quantity, revenue })), [
    { id: 'soup', quantity: 2, revenue: 3800 },
    { id: 'cake', quantity: 0, revenue: 0 },
  ])
})

test('ignores open and cancelled orders in product reports', () => {
  const orders = ['open', 'cancelled'].map((status) => ({
    status, completedAt: start, paidAt: new Date('2026-10-26T12:10:00Z'),
    items: [{ product: soup, quantity: 4 }],
  }))
  assert.equal(calculateProductSales([soup], orders).at(0)?.quantity, 0)
})

test('calculates service duration only for valid paid orders', () => {
  const durations = getServiceDurations([
    { status: 'paid', completedAt: start, paidAt: new Date('2026-10-26T12:20:00Z'), items: [] },
    { status: 'open', completedAt: start, items: [] },
    { status: 'paid', completedAt: new Date('2026-10-26T12:30:00Z'), paidAt: new Date('2026-10-26T12:20:00Z'), items: [] },
  ])
  assert.deepEqual(durations, [20 * 60 * 1000])
})

test('calculates median for odd and even duration sets', () => {
  assert.equal(getMedian([1, 3, 9]), 3)
  assert.equal(getMedian([1, 3, 9, 11]), 6)
  assert.equal(getMedian([]), null)
})

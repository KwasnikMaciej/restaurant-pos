import assert from 'node:assert/strict'
import test from 'node:test'
import { dailyLunchPool, getDailyLunch, getWarsawDateKey } from './daily-lunch.ts'

test('contains 30 to 40 distinct preconfigured lunch options', () => {
  assert.ok(dailyLunchPool.length >= 30 && dailyLunchPool.length <= 40)
  assert.equal(new Set(dailyLunchPool.map((item) => item.id)).size, dailyLunchPool.length)
})

test('selects the same lunch for the same date and returns exactly one item', () => {
  const first = getDailyLunch('2026-10-26')
  const second = getDailyLunch('2026-10-26')
  assert.deepEqual(first, second)
  assert.equal(first.category, 'Lunch dnia')
  assert.ok(dailyLunchPool.some((item) => item.id === first.id))
})

test('different dates can select different lunch items', () => {
  const selected = new Set(Array.from({ length: 20 }, (_, day) => getDailyLunch(`2026-11-${String(day + 1).padStart(2, '0')}`).id))
  assert.ok(selected.size > 1)
})

test('uses the Warsaw calendar date across UTC boundaries', () => {
  assert.equal(getWarsawDateKey(new Date('2026-10-26T23:30:00.000Z')), '2026-10-27')
  assert.equal(getWarsawDateKey(new Date('2026-10-26T10:00:00.000Z')), '2026-10-26')
})

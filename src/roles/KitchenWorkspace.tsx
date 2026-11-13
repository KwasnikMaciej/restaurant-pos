import { useCallback, useEffect, useMemo, useState } from 'react'
import { getKitchenOrderProgress, getKitchenStatus, updateKitchenItemStatus, type KitchenStatus } from '../domain/kitchen'
import '../App.css'

const ORDER_HISTORY_KEY = 'franczesko:orders-v2'

type KitchenItem = {
  product: { id: string; name: string }
  quantity: number
  kitchenStatus?: KitchenStatus
}

type KitchenOrder = {
  number: number
  tableId: number
  items: KitchenItem[]
  total: number
  completedAt: string
  status: 'open' | 'paid' | 'cancelled'
}

type KitchenWorkspaceProps = { onLogout: () => void }

function loadKitchenOrders(): KitchenOrder[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(ORDER_HISTORY_KEY) ?? '[]')
    if (!Array.isArray(value)) return []
    return value.filter((order): order is KitchenOrder =>
      typeof order === 'object' && order !== null &&
      Number.isInteger(order.number) && Number.isInteger(order.tableId) &&
      ['open', 'paid', 'cancelled'].includes(order.status) && Array.isArray(order.items) &&
      order.items.every((item: unknown) => typeof item === 'object' && item !== null &&
        typeof (item as KitchenItem).product?.name === 'string' &&
        Number.isInteger((item as KitchenItem).quantity)),
    )
  } catch {
    return []
  }
}

const statusLabels: Record<KitchenStatus, string> = {
  queued: 'Do przygotowania',
  preparing: 'W trakcie',
  ready: 'Gotowe',
}

const nextStatus: Record<KitchenStatus, KitchenStatus> = {
  queued: 'preparing',
  preparing: 'ready',
  ready: 'ready',
}

export function KitchenWorkspace({ onLogout }: KitchenWorkspaceProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>(loadKitchenOrders)
  const [filter, setFilter] = useState<'all' | KitchenStatus>('all')
  const [saveError, setSaveError] = useState('')

  const refreshOrders = useCallback(() => setOrders(loadKitchenOrders()), [])

  useEffect(() => {
    window.addEventListener('storage', refreshOrders)
    window.addEventListener('focus', refreshOrders)
    const interval = window.setInterval(refreshOrders, 2000)
    return () => {
      window.removeEventListener('storage', refreshOrders)
      window.removeEventListener('focus', refreshOrders)
      window.clearInterval(interval)
    }
  }, [refreshOrders])

  const activeOrders = useMemo(() => orders
    .filter((order) => order.status === 'open')
    .map((order) => ({ ...order, items: order.items.map((item) => ({ ...item, kitchenStatus: getKitchenStatus(item) })) }))
    .filter((order) => filter === 'all' || order.items.some((item) => item.kitchenStatus === filter))
    .sort((a, b) => Date.parse(a.completedAt) - Date.parse(b.completedAt)), [orders, filter])

  const totals = useMemo(() => {
    const all = orders.filter((order) => order.status === 'open')
    return all.reduce((result, order) => {
      for (const item of order.items) {
        const status = getKitchenStatus(item)
        result[status] += item.quantity
      }
      return result
    }, { queued: 0, preparing: 0, ready: 0 })
  }, [orders])

  const changeItemStatus = (orderNumber: number, itemIndex: number, status: KitchenStatus) => {
    const current = loadKitchenOrders()
    const target = current.find((order) => order.number === orderNumber)
    if (!target) {
      refreshOrders()
      return
    }
    try {
      const updated = updateKitchenItemStatus(target, itemIndex, status)
      const nextOrders = current.map((order) => order.number === orderNumber ? updated : order)
      window.localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(nextOrders))
      setOrders(nextOrders)
      setSaveError('')
    } catch {
      setSaveError('Nie udało się zapisać statusu. Odśwież widok i spróbuj ponownie.')
    }
  }

  return (
    <main className="kitchen-app">
      <header className="kitchen-topbar">
        <a className="brand" href="#kitchen" aria-label="Franczesko Restaurant — kuchnia">
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span className="brand-copy"><strong>Franczesko</strong><span>RESTAURANT</span></span>
        </a>
        <div className="kitchen-topbar-title"><span className="kitchen-live-dot" /> EKRAN KUCHNI</div>
        <div className="role-session">
          <span className="role-session-label">Rola: <strong>Kucharz</strong></span>
          <button type="button" className="role-switch-button" onClick={onLogout}>Zmień rolę</button>
        </div>
      </header>

      <section className="kitchen-content">
        <div className="kitchen-heading">
          <div><span className="role-login-eyebrow">CENTRUM PRZYGOTOWAŃ</span><h1>Zamówienia kuchenne</h1><p>Nowe zamówienia kelnera pojawiają się tutaj automatycznie.</p></div>
          <button type="button" className="kitchen-refresh" onClick={refreshOrders}>Odśwież</button>
        </div>

        <div className="kitchen-stats">
          <div className="kitchen-stat kitchen-stat-queued"><span>Do przygotowania</span><strong>{totals.queued}</strong></div>
          <div className="kitchen-stat kitchen-stat-preparing"><span>W trakcie</span><strong>{totals.preparing}</strong></div>
          <div className="kitchen-stat kitchen-stat-ready"><span>Gotowe</span><strong>{totals.ready}</strong></div>
        </div>

        <nav className="kitchen-filters" aria-label="Filtruj zamówienia">
          {([{ id: 'all', label: 'Wszystkie' }, { id: 'queued', label: 'Do przygotowania' }, { id: 'preparing', label: 'W trakcie' }, { id: 'ready', label: 'Gotowe' }] as const).map((item) => (
            <button key={item.id} type="button" className={filter === item.id ? 'kitchen-filter kitchen-filter-active' : 'kitchen-filter'} onClick={() => setFilter(item.id)}>{item.label}</button>
          ))}
        </nav>

        {saveError && <p className="kitchen-error" role="alert">{saveError}</p>}
        {activeOrders.length === 0 ? (
          <div className="kitchen-empty"><span aria-hidden="true">✓</span><h2>Brak zamówień w tej kolejce</h2><p>Nowe zamówienia pojawią się automatycznie po zapisaniu ich przez kelnera.</p></div>
        ) : (
          <div className="kitchen-orders">
            {activeOrders.map((order) => {
              const progress = getKitchenOrderProgress(order)
              return (
                <article className="kitchen-order-card" key={order.number}>
                  <header className="kitchen-order-header">
                    <div><span className="kitchen-order-number">Zamówienie #{String(order.number).padStart(4, '0')}</span><h2>Stolik {order.tableId}</h2></div>
                    <div className="kitchen-order-time">{Number.isFinite(Date.parse(order.completedAt)) ? new Date(order.completedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : 'Nowe'}</div>
                  </header>
                  <div className="kitchen-progress"><span style={{ width: progress.total ? `${(progress.ready / progress.total) * 100}%` : '0%' }} /></div>
                  <p className="kitchen-progress-label">{progress.ready} z {progress.total} porcji gotowych</p>
                  <div className="kitchen-items">
                    {order.items.map((item, index) => {
                      const status = getKitchenStatus(item)
                      return (
                        <div className="kitchen-item" key={`${item.product.id}-${index}`}>
                          <div className="kitchen-item-copy"><strong>{item.product.name}</strong><span>{item.quantity} × porcja</span><span className={`kitchen-status kitchen-status-${status}`}>{statusLabels[status]}</span></div>
                          <button type="button" className={status === 'ready' ? 'kitchen-action kitchen-action-done' : 'kitchen-action'} disabled={status === 'ready'} onClick={() => changeItemStatus(order.number, index, nextStatus[status])}>{status === 'queued' ? 'Rozpocznij' : status === 'preparing' ? 'Oznacz jako gotowe' : 'Gotowe ✓'}</button>
                        </div>
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

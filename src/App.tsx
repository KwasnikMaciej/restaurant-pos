import { useEffect, useMemo, useState } from 'react'
import { connectPrinter, disconnectPrinter, getPrinterConnection, printTestReceipt } from './printing/mx06-printer'
import { APP_VERSION } from './version'
import { calculateProductSales, getMedian, getServiceDurations } from './domain/reports'

declare const __BUILD_TIMESTAMP__: string
import './App.css'

type Category = 'Wszystko' | 'Przystawki' | 'Zupy' | 'Dania główne' | 'Desery' | 'Napoje'

type Product = {
  id: string
  name: string
  description: string
  category: Exclude<Category, 'Wszystko'>
  price: number
  image: string
  tag?: string
}

type CartItem = {
  product: Product
  quantity: number
}

type CompletedOrder = {
  number: number
  tableId: number
  items: CartItem[]
  total: number
  completedAt: Date
  status: 'open' | 'paid' | 'cancelled'
  paymentMethod?: 'cash' | 'card'
  paidAt?: Date
}

const ORDER_HISTORY_KEY = 'franczesko:orders-v2'
const TABLE_NUMBERS = Array.from({ length: 10 }, (_, index) => index + 1)
const MAX_STORED_ORDERS = 100

const categories: Category[] = [
  'Wszystko',
  'Przystawki',
  'Zupy',
  'Dania główne',
  'Desery',
  'Napoje',
]

const products: Product[] = [
  // Przystawki — ceny i kompozycje inspirowane typowymi kartami polskich restauracji.
  { id: 'tatar', name: 'Tatar wołowy', description: 'Siekana wołowina, żółtko, ogórek kiszony, cebulka i grzanki', category: 'Przystawki', price: 3900, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 'bruschetta', name: 'Bruschetta z pomidorami', description: 'Grzanki, dojrzałe pomidory, bazylia i oliwa', category: 'Przystawki', price: 2600, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'cheese', name: 'Ser panierowany z żurawiną', description: 'Chrupiący ser, żurawina i sałata z winegretem', category: 'Przystawki', price: 2900, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85' },
  { id: 'fries', name: 'Frytki z dipem czosnkowym', description: 'Złociste frytki i domowy sos czosnkowy', category: 'Przystawki', price: 1600, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85' },
  { id: 'herring', name: 'Śledź w oleju', description: 'Filety śledziowe, cebulka, olej lniany i pieczywo', category: 'Przystawki', price: 2400, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85' },
  { id: 'lard', name: 'Chleb ze smalcem i ogórkiem', description: 'Domowy smalec, ogórek kiszony i świeży chleb', category: 'Przystawki', price: 1800, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85', tag: 'Domowy klasyk' },
  { id: 'potato-pancakes-starter', name: 'Placki ziemniaczane', description: 'Chrupiące placki ze śmietaną i koperkiem', category: 'Przystawki', price: 2200, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'oscypek', name: 'Grillowany oscypek', description: 'Podhalański ser z konfiturą z żurawiny', category: 'Przystawki', price: 2700, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=85' },
  { id: 'pate', name: 'Pasztet domowy', description: 'Pasztet pieczony, konfitura z cebuli i pieczywo', category: 'Przystawki', price: 2500, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 'vegetable-salad', name: 'Sałatka jarzynowa', description: 'Warzywa korzeniowe, jajko, groszek i majonez', category: 'Przystawki', price: 1900, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },

  // Zupy
  { id: 'soup', name: 'Rosół domowy', description: 'Bulion drobiowo-wołowy, makaron, marchew i natka pietruszki', category: 'Zupy', price: 1900, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85', tag: 'Domowy klasyk' },
  { id: 'zurek', name: 'Żurek z jajkiem i kiełbasą', description: 'Zakwas żytni, biała kiełbasa, jajko i majeranek', category: 'Zupy', price: 2600, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85' },
  { id: 'tomato-soup', name: 'Krem pomidorowy', description: 'Pomidory, śmietanka, bazylia i grzanki', category: 'Zupy', price: 2200, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85', tag: 'Łagodny smak' },
  { id: 'borscht', name: 'Barszcz czerwony', description: 'Aromatyczny barszcz z majerankiem, podawany z uszkami', category: 'Zupy', price: 2400, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 'tripe-soup', name: 'Flaki wołowe', description: 'Tradycyjna zupa wołowa z majerankiem i warzywami', category: 'Zupy', price: 2800, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85' },
  { id: 'pickle-soup', name: 'Zupa ogórkowa', description: 'Kiszone ogórki, ziemniaki, marchew i koperek', category: 'Zupy', price: 2100, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85', tag: 'Domowy klasyk' },
  { id: 'mushroom-soup', name: 'Zupa grzybowa', description: 'Leśne grzyby, śmietanka i łazanki', category: 'Zupy', price: 2600, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 'cabbage-soup', name: 'Kapuśniak', description: 'Kiszona kapusta, ziemniaki i wędzonka', category: 'Zupy', price: 2300, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85' },
  { id: 'cold-beet-soup', name: 'Chłodnik litewski', description: 'Botwinka, kefir, ogórek, rzodkiewka i jajko', category: 'Zupy', price: 2400, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85', tag: 'Sezonowy' },
  { id: 'barley-soup', name: 'Krupnik', description: 'Kasza jęczmienna, warzywa korzeniowe i natka', category: 'Zupy', price: 2000, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },

  // Dania główne
  { id: 'cutlet', name: 'Kotlet schabowy', description: 'Panierowany schab, ziemniaki puree i mizeria', category: 'Dania główne', price: 4200, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85', tag: 'Bestseller' },
  { id: 'pierogi', name: 'Pierogi ruskie', description: 'Ręcznie lepione pierogi z twarogiem i ziemniakami, cebulka', category: 'Dania główne', price: 3200, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85' },
  { id: 'salmon', name: 'Łosoś pieczony', description: 'Filet z łososia, pieczone ziemniaki i warzywa sezonowe', category: 'Dania główne', price: 5200, image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=85' },
  { id: 'burger', name: 'Burger wołowy', description: 'Wołowina, cheddar, sałata, pomidor i sos firmowy', category: 'Dania główne', price: 3900, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85' },
  { id: 'golonka', name: 'Golonka pieczona', description: 'Długo pieczona golonka, kapusta zasmażana i chrzan', category: 'Dania główne', price: 4900, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'duck', name: 'Kaczka pieczona z jabłkiem', description: 'Udko kaczki, pieczone jabłko, kluski i modra kapusta', category: 'Dania główne', price: 5900, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85', tag: 'Specjał szefa' },
  { id: 'bigos', name: 'Bigos staropolski', description: 'Kapusta kiszona i świeża, mięsa, kiełbasa i przyprawy', category: 'Dania główne', price: 3600, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 'cabbage-rolls', name: 'Gołąbki w sosie pomidorowym', description: 'Liście kapusty, farsz mięsno-ryżowy i sos pomidorowy', category: 'Dania główne', price: 3400, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85' },
  { id: 'hungarian-pancake', name: 'Placek po węgiersku', description: 'Duży placek ziemniaczany z gulaszem i kleksem śmietany', category: 'Dania główne', price: 3900, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=85' },
  { id: 'dumplings-meat', name: 'Pierogi z mięsem', description: 'Pierogi z farszem mięsnym, okraszone cebulką', category: 'Dania główne', price: 3300, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85' },

  // Desery
  { id: 'cake', name: 'Sernik domowy', description: 'Kremowy sernik z sosem owocowym', category: 'Desery', price: 2100, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85', tag: 'Domowy wypiek' },
  { id: 'apple-pie', name: 'Szarlotka na ciepło', description: 'Jabłka z cynamonem, kruszonka i gałka lodów', category: 'Desery', price: 2300, image: 'https://images.unsplash.com/photo-1562007908-17c67e878c1b?auto=format&fit=crop&w=900&q=85' },
  { id: 'icecream', name: 'Lody waniliowe', description: 'Trzy gałki lodów z polewą czekoladową', category: 'Desery', price: 1700, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85' },
  { id: 'pancakes-sweet', name: 'Naleśniki z twarogiem', description: 'Naleśniki z waniliowym twarogiem i sosem malinowym', category: 'Desery', price: 2400, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85' },
  { id: 'racuchy', name: 'Racuchy z jabłkami', description: 'Puszyste racuchy oprószone cukrem pudrem', category: 'Desery', price: 2200, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85', tag: 'Domowy klasyk' },
  { id: 'poppy-cake', name: 'Makowiec', description: 'Makowiec zawijany z bakaliami i lukrem', category: 'Desery', price: 1900, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85' },
  { id: 'cream-cake', name: 'Kremówka', description: 'Ciasto francuskie, krem waniliowy i cukier puder', category: 'Desery', price: 2100, image: 'https://images.unsplash.com/photo-1562007908-17c67e878c1b?auto=format&fit=crop&w=900&q=85' },
  { id: 'gingerbread', name: 'Piernik z powidłami', description: 'Korzenne ciasto, powidła śliwkowe i delikatna polewa', category: 'Desery', price: 1800, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85' },
  { id: 'paczki', name: 'Pączek z konfiturą', description: 'Puszysty pączek z konfiturą różaną i cukrem pudrem', category: 'Desery', price: 1200, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85' },
  { id: 'cheesecake-brownie', name: 'Brownie czekoladowe', description: 'Wilgotne ciasto czekoladowe z sosem waniliowym', category: 'Desery', price: 2000, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85' },

  // Napoje
  { id: 'lemonade', name: 'Lemoniada domowa', description: 'Cytryna, mięta i lód — 400 ml', category: 'Napoje', price: 1400, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85', tag: 'Orzeźwiająca' },
  { id: 'compote', name: 'Kompot dnia', description: 'Domowy napój owocowy — 250 ml', category: 'Napoje', price: 800, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85' },
  { id: 'coffee', name: 'Kawa mleczna', description: 'Świeżo parzona kawa z mlekiem', category: 'Napoje', price: 1300, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85' },
  { id: 'tea', name: 'Herbata z cytryną', description: 'Czarna herbata, cytryna i miód podawany osobno', category: 'Napoje', price: 1000, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85' },
  { id: 'still-water', name: 'Woda niegazowana', description: 'Woda mineralna — 330 ml', category: 'Napoje', price: 800, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=85' },
  { id: 'sparkling-water', name: 'Woda gazowana', description: 'Woda mineralna — 330 ml', category: 'Napoje', price: 800, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=85' },
  { id: 'apple-juice', name: 'Sok jabłkowy', description: 'Sok 100% — 250 ml', category: 'Napoje', price: 900, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85' },
  { id: 'orangeade', name: 'Oranżada rzemieślnicza', description: 'Gazowany napój pomarańczowy — 250 ml', category: 'Napoje', price: 1000, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=85' },
  { id: 'espresso', name: 'Espresso', description: 'Mała czarna kawa — pojedyncze espresso', category: 'Napoje', price: 1000, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=85' },
  { id: 'hot-chocolate', name: 'Gorąca czekolada', description: 'Gęsta czekolada na mleku, podawana na gorąco', category: 'Napoje', price: 1600, image: 'https://images.unsplash.com/photo-1542990253-0b8be8e9dc5e?auto=format&fit=crop&w=900&q=85' },
]

const formatPrice = (priceInGrosze: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(priceInGrosze / 100)

function loadOrderHistory(): CompletedOrder[] {
  try {
    const saved = window.localStorage.getItem(ORDER_HISTORY_KEY)
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((value): value is Omit<CompletedOrder, 'completedAt'> & { completedAt: string } =>
      typeof value === 'object' && value !== null &&
      typeof value.number === 'number' && Number.isInteger(value.tableId) && Array.isArray(value.items) &&
      typeof value.total === 'number' && ['open', 'paid', 'cancelled'].includes(value.status) && typeof value.completedAt === 'string' &&
      Number.isFinite(Date.parse(value.completedAt))
    ).map((order) => ({ ...order, completedAt: new Date(order.completedAt), paidAt: order.paidAt ? new Date(order.paidAt) : undefined }))
      .slice(0, MAX_STORED_ORDERS)
  } catch {
    return []
  }
}

function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.max(0, Math.round(milliseconds / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours} godz. ${minutes} min` : `${minutes} min`
}

function App() {
  const [page, setPage] = useState<'order' | 'tables' | 'history' | 'printer' | 'reports'>('tables')
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [reportPeriod, setReportPeriod] = useState<'7d' | '30d' | 'all'>('7d')
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [cardPaymentStatus, setCardPaymentStatus] = useState<'idle' | 'connecting' | 'waiting' | 'reading' | 'authorizing' | 'approved'>('idle')
  const [activeCategory, setActiveCategory] = useState<Category>('Wszystko')
  const [menuSearch, setMenuSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null)
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>(loadOrderHistory)
  const [historyStorageWarning, setHistoryStorageWarning] = useState('')
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle')
  const [printMessage, setPrintMessage] = useState('')
  const [printerConnection, setPrinterConnection] = useState(() => getPrinterConnection())
  const [printerConnecting, setPrinterConnecting] = useState(false)
  const [printerPrinting, setPrinterPrinting] = useState(false)
  const [printerError, setPrinterError] = useState('')
  const [printerMessage, setPrinterMessage] = useState('')
  const [nextOrderNumber, setNextOrderNumber] = useState(() => {
    try {
      const lastNumber = Number.parseInt(window.localStorage.getItem('franczesko:last-order-number') ?? '0', 10)
      const highestHistoryNumber = loadOrderHistory().reduce((highest, order) => Math.max(highest, order.number), 0)
      return Math.max(Number.isFinite(lastNumber) ? lastNumber : 0, highestHistoryNumber) + 1
    } catch {
      return loadOrderHistory().reduce((highest, order) => Math.max(highest, order.number), 0) + 1
    }
  })

  useEffect(() => {
    const refreshConnection = () => setPrinterConnection(getPrinterConnection())
    window.addEventListener('printer-connection-change', refreshConnection)
    return () => window.removeEventListener('printer-connection-change', refreshConnection)
  }, [])

  const visibleProducts = useMemo(() => {
    const normalizedSearch = menuSearch.trim().toLocaleLowerCase('pl-PL')
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Wszystko' || product.category === activeCategory
      const searchableText = `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase('pl-PL')
      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch))
    })
  }, [activeCategory, menuSearch])

  const openOrders = orderHistory.filter((order) => order.status === 'open')
  const tableOrder = (tableId: number) => orderHistory.find((order) => order.tableId === tableId && order.status === 'open')
  const selectedOpenOrder = selectedTableId === null ? undefined : tableOrder(selectedTableId)
  const persistOrders = (orders: CompletedOrder[]) => {
    try { window.localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders.slice(0, MAX_STORED_ORDERS))); setHistoryStorageWarning(''); return true }
    catch { setHistoryStorageWarning('Nie udało się zapisać zmian na stałe. Stolik pozostaje zajęty do czasu poprawnego zapisu.'); return false }
  }
  const selectTable = (tableId: number) => { const existing = tableOrder(tableId); setSelectedTableId(tableId); setCart(existing ? existing.items.map((item) => ({ ...item })) : []); setPage('order'); setCartOpen(false) }
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const reportOrders = useMemo(() => {
    const now = Date.now()
    const cutoff = reportPeriod === '7d' ? now - 7 * 24 * 60 * 60 * 1000
      : reportPeriod === '30d' ? now - 30 * 24 * 60 * 60 * 1000
        : Number.NEGATIVE_INFINITY
    return orderHistory.filter((order) => order.status === 'paid' && order.paidAt && order.paidAt.getTime() >= cutoff)
  }, [orderHistory, reportPeriod])

  const productReport = useMemo(() => calculateProductSales(products, reportOrders), [reportOrders])
  const serviceDurations = useMemo(() => getServiceDurations(reportOrders), [reportOrders])
  const averageServiceMs = serviceDurations.length
    ? serviceDurations.reduce((sum, duration) => sum + duration, 0) / serviceDurations.length
    : null
  const medianServiceMs = getMedian(serviceDurations)
  const reportRevenue = reportOrders.reduce((sum, order) => sum + order.total, 0)
  const topProducts = [...productReport].sort((left, right) => right.quantity - left.quantity || left.name.localeCompare(right.name, 'pl-PL')).slice(0, 5)
  const leastProducts = [...productReport].sort((left, right) => left.quantity - right.quantity || left.name.localeCompare(right.name, 'pl-PL')).slice(0, 5)

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...current, { product, quantity: 1 }]
    })
  }

  const changeQuantity = (productId: string, change: number) => {
    setCart((current) => current
      .map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0))
  }

  const completeOrder = () => {
    if (cart.length === 0 || selectedTableId === null) return
    const existing = tableOrder(selectedTableId)
    const now = new Date()
    const order: CompletedOrder = existing
      ? { ...existing, items: cart.map((item) => ({ ...item })), total, completedAt: existing.completedAt }
      : { number: nextOrderNumber, tableId: selectedTableId, items: cart.map((item) => ({ ...item })), total, completedAt: now, status: 'open' }
    const updatedHistory = [order, ...orderHistory.filter((item) => item.number !== order.number)].slice(0, MAX_STORED_ORDERS)
    try { window.localStorage.setItem('franczesko:last-order-number', String(Math.max(nextOrderNumber, order.number))) } catch { setHistoryStorageWarning('Nie udało się zapisać numeru zamówienia na stałe.') }
    persistOrders(updatedHistory)
    setOrderHistory(updatedHistory); setLastOrder(order)
    if (!existing) setNextOrderNumber((number) => number + 1)
    setCart([]); setCheckoutOpen(false); setCartOpen(false); setPage('tables')
  }

  const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

  const startCardPayment = async () => {
    if (!lastOrder || lastOrder.status !== 'open' || cardPaymentStatus !== 'idle') return
    setPaymentMethod('card')
    setCardPaymentStatus('connecting')
    await wait(1200)
    setCardPaymentStatus('waiting')
    await wait(1800)
    setCardPaymentStatus('reading')
    await wait(1400)
    setCardPaymentStatus('authorizing')
    await wait(1800)
    setCardPaymentStatus('approved')
    await wait(900)
    settleOrder('card')
  }

  const settleOrder = (method: 'cash' | 'card' = paymentMethod) => {
    if (!lastOrder || lastOrder.status !== 'open') return
    const paidAt = new Date()
    const paidOrder: CompletedOrder = { ...lastOrder, status: 'paid', paymentMethod: method, paidAt }
    const updatedHistory = orderHistory.map((order) => order.number === paidOrder.number ? paidOrder : order)
    if (!persistOrders(updatedHistory)) return
    setOrderHistory(updatedHistory); setLastOrder(paidOrder); setPaymentOpen(false); setCardPaymentStatus('idle'); setPage('tables')
  }

  return (
    <main className="restaurant-app">
      <header className="topbar">
        <a className="brand" href="#menu" aria-label="Franczesko Restaurant — menu" onClick={() => setPage('order')}>
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span className="brand-copy"><strong>Franczesko</strong><span>RESTAURANT</span></span>
        </a>
        <div className="topbar-note"><span className="open-dot" /> Dziś gotujemy z sercem</div>
        <nav className="app-navigation" aria-label="Nawigacja aplikacji">
          <button className={page === 'tables' ? 'app-nav-link active' : 'app-nav-link'} type="button" onClick={() => { setPage('tables'); setMoreMenuOpen(false) }}><span aria-hidden="true">▦</span> Stoliki <span className="app-nav-count">{openOrders.length}</span></button>
          <button className={page === 'order' ? 'app-nav-link active' : 'app-nav-link'} type="button" onClick={() => { selectedTableId === null ? setPage('tables') : setPage('order'); setMoreMenuOpen(false) }}><span aria-hidden="true">＋</span> Zamówienie</button>
          <button className={page === 'reports' ? 'app-nav-link active' : 'app-nav-link'} type="button" onClick={() => { setPage('reports'); setMoreMenuOpen(false) }}><span aria-hidden="true">▥</span> Raporty</button>
          <div className="nav-more-wrap">
            <button className={page === 'history' || page === 'printer' ? 'app-nav-link active' : 'app-nav-link'} type="button" aria-expanded={moreMenuOpen} aria-haspopup="true" onClick={() => setMoreMenuOpen((open) => !open)}><span aria-hidden="true">•••</span> Więcej <span aria-hidden="true">⌄</span></button>
            {moreMenuOpen && <div className="nav-more-menu" role="menu">
              <button type="button" role="menuitem" className={page === 'history' ? 'nav-more-item active' : 'nav-more-item'} onClick={() => { setPage('history'); setMoreMenuOpen(false) }}><span aria-hidden="true">▤</span> Historia <span className="app-nav-count">{orderHistory.length}</span></button>
              <button type="button" role="menuitem" className={page === 'printer' ? 'nav-more-item active' : 'nav-more-item'} onClick={() => { setPage('printer'); setMoreMenuOpen(false) }}><span aria-hidden="true">▤</span> Drukarka <span className={`printer-nav-dot ${printerConnection.connected ? 'is-connected' : ''}`} aria-label={printerConnection.connected ? 'Połączona' : 'Rozłączona'} /></button>
            </div>}
          </div>
        </nav>
        {page === 'order' && <button className="mobile-cart-button" type="button" onClick={() => setCartOpen((open) => !open)}>
          Koszyk <span>{itemCount}</span>
        </button>}
      </header>

      {page === 'order' && <>
      <section className="welcome-banner" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <span className="eyebrow"><span aria-hidden="true">✦</span> SMAK, KTÓRY ŁĄCZY</span>
          <h1 id="welcome-title">Dobrze Cię<br /><em>widzieć!</em></h1>
          <p>Usiądź wygodnie i wybierz coś pysznego.<br className="desktop-break" /> Resztą zajmiemy się my.</p>
          <a className="banner-link" href="#menu">Zobacz nasze menu <span aria-hidden="true">↓</span></a>
        </div>
        <div className="welcome-photo" role="img" aria-label="Świeżo przygotowane danie w przytulnej restauracji">
          <div className="photo-sticker"><span>♥</span><strong>Smacznego!</strong><small>od Franczesko</small></div>
        </div>
        <div className="banner-sparkle sparkle-one" aria-hidden="true">✳</div>
        <div className="banner-sparkle sparkle-two" aria-hidden="true">✦</div>
      </section>

      <section className="table-context" hidden={page !== 'order'} aria-label="Wybrany stolik"><div><span className="eyebrow">AKTUALNY STOLIK</span><h2>{selectedTableId === null ? 'Najpierw wybierz stolik' : 'Stolik ' + selectedTableId}</h2><p>{selectedOpenOrder ? 'Otwarty rachunek #' + String(selectedOpenOrder.number).padStart(4, '0') + ' · ' + formatPrice(selectedOpenOrder.total) : selectedTableId === null ? 'Wybierz stolik, aby rozpocząć rejestrację zamówienia.' : 'Nowy rachunek — dodaj pozycje z menu.'}</p></div><button className="secondary-button" type="button" onClick={() => setPage('tables')}>Wybierz stolik</button></section>
      <div className="content-layout" id="menu" hidden={page !== 'order'}>
        <section className="menu-section" aria-labelledby="menu-title">
          <div className="section-heading">
            <div><span className="eyebrow">CO DZIŚ PODAJEMY?</span><h2 id="menu-title">Nasze menu <span aria-hidden="true">☀</span></h2></div>
            <span className="menu-count">{visibleProducts.length} propozycji</span>
          </div>

          <nav className="category-list" aria-label="Kategorie menu">
            {categories.map((category) => (
              <button className={activeCategory === category ? 'category-chip active' : 'category-chip'} key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </nav>

          <div className="menu-tools">
            <label className="menu-search">
              <span className="menu-search-icon" aria-hidden="true">⌕</span>
              <input type="search" value={menuSearch} onChange={(event) => setMenuSearch(event.target.value)} placeholder="Szukaj dania lub składnika…" aria-label="Szukaj w menu" />
              {menuSearch && <button type="button" aria-label="Wyczyść wyszukiwanie" onClick={() => setMenuSearch('')}>×</button>}
            </label>
            <span className="menu-results" aria-live="polite">{visibleProducts.length} {visibleProducts.length === 1 ? 'wynik' : visibleProducts.length >= 2 && visibleProducts.length <= 4 ? 'wyniki' : 'wyników'}</span>
          </div>

          {visibleProducts.length > 0 ? <div className="product-grid">
            {visibleProducts.map((product) => {
              const inCart = cart.find((item) => item.product.id === product.id)?.quantity ?? 0
              return <article className={inCart > 0 ? 'product-card product-card-selected' : 'product-card'} key={product.id}>
                <div className="product-image-wrap">
                  <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  {inCart > 0 && <span className="product-in-cart">{inCart} w zamówieniu</span>}
                  <button className="quick-add" type="button" aria-label={`Dodaj ${product.name} do koszyka`} onClick={() => addToCart(product)}>+</button>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-card-bottom">
                    <strong className="product-price">{formatPrice(product.price)}</strong>
                    <button className={inCart > 0 ? 'add-button add-button-selected' : 'add-button'} type="button" onClick={() => addToCart(product)}><span aria-hidden="true">+</span> Dodaj</button>
                  </div>
                </div>
              </article>
            })}
          </div> : <div className="menu-no-results"><span aria-hidden="true">⌕</span><h3>Nie znaleźliśmy takiego dania</h3><p>Spróbuj innej nazwy albo zmień kategorię.</p><button type="button" onClick={() => { setMenuSearch(''); setActiveCategory('Wszystko') }}>Pokaż całe menu</button></div>}
        </section>

        <aside className={cartOpen ? 'cart-panel cart-panel-open' : 'cart-panel'} aria-labelledby="cart-title">
          <div className="cart-heading">
            <div><span className="eyebrow">CO WYBIERASZ?</span><h2 id="cart-title">Twoje zamówienie <span aria-hidden="true">♡</span></h2></div>
            <span className="cart-count">{itemCount}</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-illustration" aria-hidden="true">♧</div>
              <h3>Na razie tu pusto!</h3>
              <p>Dodaj coś pysznego z menu, a pojawi się tutaj.</p>
              <button type="button" className="empty-cart-link" onClick={() => {
                setCartOpen(false)
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
              }}>Wybierz coś dla siebie <span aria-hidden="true">→</span></button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(({ product, quantity }) => (
                  <div className="cart-item" key={product.id}>
                    <img src={product.image} alt="" />
                    <div className="cart-item-info">
                      <strong>{product.name}</strong><span>{formatPrice(product.price)}</span>
                      <div className="quantity-control" aria-label={`Ilość: ${quantity} — ${product.name}`}>
                        <button type="button" aria-label={`Zmniejsz ilość: ${product.name}`} onClick={() => changeQuantity(product.id, -1)}>−</button>
                        <span>{quantity}</span>
                        <button type="button" aria-label={`Zwiększ ilość: ${product.name}`} onClick={() => changeQuantity(product.id, 1)}>+</button>
                      </div>
                    </div>
                    <strong className="cart-line-total">{formatPrice(product.price * quantity)}</strong>
                  </div>
                ))}
              </div>
              <button type="button" className="clear-cart" onClick={() => setCart([])}>Wyczyść koszyk</button>
            </>
          )}

          <div className="cart-summary">
            <div className="summary-line"><span>Liczba sztuk</span><span>{itemCount}</span></div>
            <div className="summary-line"><span>Razem</span><strong>{formatPrice(total)}</strong></div>
            <button className="checkout-button" type="button" disabled={cart.length === 0 || selectedTableId === null} onClick={() => setCheckoutOpen(true)}>
              Przejdź do podsumowania <span aria-hidden="true">→</span>
            </button>
            <p className="cart-footnote"><span aria-hidden="true">♡</span> Przygotowane z sercem, specjalnie dla Ciebie</p>
          </div>
        </aside>
      </div>

      </>}

      <section className="tables-page" aria-labelledby="tables-title" hidden={page !== 'tables'}>
        <div className="tables-page-heading">
          <div>
            <span className="eyebrow">SALA RESTAURACYJNA</span>
            <h2 id="tables-title">Stoliki</h2>
            <p className="tables-intro">Wybierz stolik, aby rozpocząć zamówienie lub wrócić do otwartego rachunku.</p>
          </div>
          <div className="tables-legend" aria-label="Legenda statusów">
            <span><i className="legend-dot legend-dot-free" /> Wolny</span>
            <span><i className="legend-dot legend-dot-busy" /> Zajęty</span>
          </div>
        </div>
        {historyStorageWarning && <p className="history-storage-warning" role="status">{historyStorageWarning}</p>}
        <div className="table-metrics" aria-label="Podsumowanie sali">
          <article className="table-metric table-metric-free"><span className="metric-icon" aria-hidden="true">✓</span><div><span>Wolne stoliki</span><strong>{TABLE_NUMBERS.length - openOrders.length}</strong></div></article>
          <article className="table-metric table-metric-busy"><span className="metric-icon" aria-hidden="true">↗</span><div><span>Zajęte stoliki</span><strong>{openOrders.length}</strong></div></article>
          <article className="table-metric table-metric-total"><span className="metric-icon" aria-hidden="true">zł</span><div><span>Otwarte rachunki</span><strong>{formatPrice(openOrders.reduce((sum, order) => sum + order.total, 0))}</strong></div></article>
        </div>
        <div className="tables-grid">{TABLE_NUMBERS.map((tableId) => {
          const order = tableOrder(tableId)
          const itemCountForTable = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
          return <article className={order ? 'table-card occupied' : 'table-card available'} key={tableId}>
            <div className="table-card-top">
              <span className="table-icon" aria-hidden="true">{order ? '●' : '○'}</span>
              <span className={order ? 'table-status occupied-status' : 'table-status available-status'}><i className="table-status-dot" />{order ? 'Zajęty' : 'Wolny'}</span>
            </div>
            <h3>Stolik <span>{String(tableId).padStart(2, '0')}</span></h3>
            {order ? <>
              <p className="table-order-number">Rachunek #{String(order.number).padStart(4, '0')}</p>
              <strong className="table-total">{formatPrice(order.total)}</strong>
              <p className="table-item-count">{itemCountForTable} {itemCountForTable === 1 ? 'pozycja' : itemCountForTable >= 2 && itemCountForTable <= 4 ? 'pozycje' : 'pozycji'} w rachunku</p>
            </> : <>
              <strong className="table-total table-total-empty">—</strong>
              <p className="table-item-count">Gotowy na gości</p>
            </>}
            <button className="checkout-button table-open-button" type="button" onClick={() => selectTable(tableId)}>{order ? 'Otwórz rachunek' : 'Nowe zamówienie'} <span aria-hidden="true">→</span></button>
            {order && <button className="table-pay-button" type="button" onClick={() => { setLastOrder(order); setPaymentOpen(true); setPaymentMethod('cash') }}>Rozlicz rachunek</button>}
          </article>
        })}</div>
      </section>

      <section className="printer-page" aria-labelledby="printer-title" hidden={page !== 'printer'}>
        <div className="printer-page-heading">
          <div>
            <span className="eyebrow">URZĄDZENIA RESTAURACJI</span>
            <h2 id="printer-title">Drukarka Bluetooth</h2>
            <p>Sprawdź połączenie z drukarką MX06 Mini Printer i przygotuj ją do późniejszego testu wydruku.</p>
          </div>
          <span className={`printer-status-pill ${printerConnection.connected ? 'is-connected' : 'is-disconnected'}`}>
            <span className="printer-status-dot" />{printerConnection.connected ? 'Połączona' : 'Niepołączona'}
          </span>
        </div>

        <div className="printer-layout">
          <article className="printer-device-card">
            <div className={`printer-illustration ${printerConnection.connected ? 'printer-illustration-connected' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 120 100" role="img" aria-label="Ikona drukarki">
                <rect x="25" y="35" width="70" height="43" rx="8" />
                <path d="M37 35V16h46v19M39 61h42v23H39zM43 23h34" />
                <circle cx="83" cy="47" r="3" />
                <path d="M45 70h30M45 77h24" />
              </svg>
            </div>
            <span className="eyebrow">DRUKARKA TERMICZNA</span>
            <h3>{printerConnection.deviceName || 'MX06 Mini Printer'}</h3>
            <p className="printer-device-description">{printerConnection.connected
              ? 'Urządzenie jest połączone z aplikacją. Możesz pozostawić je gotowe do kolejnego kroku.'
              : 'Połącz drukarkę, aby sprawdzić komunikację Bluetooth. Papier nie jest potrzebny do samego połączenia.'}</p>
            <div className="printer-detail-row"><span>Połączenie</span><strong>{printerConnection.connected ? 'Bluetooth LE · aktywne' : 'Bluetooth LE · nieaktywne'}</strong></div>
            <div className="printer-detail-row"><span>Model protokołu</span><strong>MX06 / GATT</strong></div>
            <div className="printer-detail-row"><span>Papier</span><strong className="printer-paper-note">Nie sprawdzono — brak testu wydruku</strong></div>
            {printerError && <p className="printer-error" role="alert">{printerError}</p>}
            {printerMessage && <p className="printer-success" role="status">{printerMessage}</p>}
            <div className="printer-actions">
              {printerConnection.connected
                ? <>
                    <button className="checkout-button printer-action-button" type="button" disabled={printerPrinting} onClick={async () => {
                      setPrinterPrinting(true); setPrinterError(''); setPrinterMessage('')
                      try {
                        await printTestReceipt(['TEST', 'Drukarka OK'])
                        setPrinterMessage('Wysłano krótki wydruk testowy. Sprawdź, czy drukarka wydrukowała tekst poprawnie.')
                        setPrinterConnection(getPrinterConnection())
                      } catch (error) {
                        setPrinterError(error instanceof Error ? error.message : 'Nie udało się wykonać wydruku testowego.')
                        setPrinterConnection(getPrinterConnection())
                      } finally { setPrinterPrinting(false) }
                    }}>{printerPrinting ? 'Drukowanie…' : 'Wydrukuj krótki test'} <span aria-hidden="true">↗</span></button>
                    <button className="printer-disconnect-button" type="button" onClick={() => { disconnectPrinter(); setPrinterConnection(getPrinterConnection()); setPrinterError(''); setPrinterMessage('') }}>Rozłącz drukarkę</button>
                  </>
                : <button className="checkout-button printer-action-button" type="button" disabled={printerConnecting || !printerConnection.supported} onClick={async () => {
                    setPrinterConnecting(true); setPrinterError(''); setPrinterMessage('')
                    try { await connectPrinter(); setPrinterConnection(getPrinterConnection()) }
                    catch (error) { setPrinterError(error instanceof Error ? error.message : 'Nie udało się połączyć z drukarką.'); setPrinterConnection(getPrinterConnection()) }
                    finally { setPrinterConnecting(false) }
                  }}>{printerConnecting ? 'Łączenie…' : 'Połącz z drukarką'} <span aria-hidden="true">→</span></button>}
              {!printerConnection.supported && <p className="printer-help">Web Bluetooth nie jest dostępny w tej przeglądarce. Otwórz aplikację w Chrome na Androidzie przez HTTPS.</p>}
            </div>
          </article>

          <aside className="printer-info-panel">
            <span className="eyebrow">CO MOŻESZ TERAZ ZROBIĆ?</span>
            <h3>Krótki wydruk testowy</h3>
            <p>Po połączeniu możesz wydrukować tylko dwa krótkie wiersze: „TEST” i „Drukarka OK”. Przycisk nie drukuje paragonu ani danych zamówienia.</p>
            <ul>
              <li><span>1</span><div><strong>Włącz drukarkę</strong><small>Upewnij się, że ma zasilanie i Bluetooth jest dostępny.</small></div></li>
              <li><span>2</span><div><strong>Wybierz urządzenie</strong><small>W oknie systemowym wybierz MX06 Mini Printer.</small></div></li>
              <li><span>3</span><div><strong>Sprawdź status</strong><small>Po połączeniu status zmieni się na „Połączona”.</small></div></li>
            </ul>
            <div className="printer-no-paper-note"><span aria-hidden="true">ⓘ</span><p><strong>Przed testem załóż papier</strong> Samo połączenie Bluetooth działa bez rolki, ale nie uruchamiaj wydruku testowego, dopóki papier nie będzie założony.</p></div>
          </aside>
        </div>
      </section>

      <section className="reports-page" aria-labelledby="reports-title" hidden={page !== 'reports'}>
        <div className="reports-heading">
          <div><span className="eyebrow">PODSUMOWANIE SPRZEDAŻY</span><h2 id="reports-title">Raporty</h2><p>Popularność dań i czas obsługi na podstawie rozliczonych rachunków zapisanych na tym urządzeniu.</p></div>
          <div className="report-period-switch" role="group" aria-label="Okres raportu">
            <button type="button" className={reportPeriod === '7d' ? 'active' : ''} aria-pressed={reportPeriod === '7d'} onClick={() => setReportPeriod('7d')}>7 dni</button>
            <button type="button" className={reportPeriod === '30d' ? 'active' : ''} aria-pressed={reportPeriod === '30d'} onClick={() => setReportPeriod('30d')}>30 dni</button>
            <button type="button" className={reportPeriod === 'all' ? 'active' : ''} aria-pressed={reportPeriod === 'all'} onClick={() => setReportPeriod('all')}>Cała historia</button>
          </div>
        </div>
        <p className="reports-data-note">Raport obejmuje maksymalnie {MAX_STORED_ORDERS} ostatnich zamówień przechowywanych w tej przeglądarce. Zamówienia nierozliczone i anulowane są pomijane.</p>
        <div className="reports-metrics">
          <article className="report-metric"><span>Rozliczone rachunki</span><strong>{reportOrders.length}</strong><small>W wybranym okresie</small></article>
          <article className="report-metric"><span>Sprzedaż</span><strong>{formatPrice(reportRevenue)}</strong><small>Łączna wartość rozliczonych rachunków</small></article>
          <article className="report-metric"><span>Średni czas obsługi</span><strong>{averageServiceMs === null ? '—' : formatDuration(averageServiceMs)}</strong><small>Od otwarcia rachunku do rozliczenia</small></article>
          <article className="report-metric"><span>Mediana czasu obsługi</span><strong>{medianServiceMs === null ? '—' : formatDuration(medianServiceMs)}</strong><small>Typowy czas, mniej podatny na skrajne wyniki</small></article>
        </div>
        {reportOrders.length === 0 && <div className="reports-empty"><span aria-hidden="true">▥</span><h3>Brak rozliczonych rachunków w tym okresie</h3><p>Gdy pojawią się rozliczone zamówienia, raport pokaże sprzedaż, popularność produktów i czas obsługi.</p></div>}
        <div className="reports-tables">
          <article className="report-table-card">
            <div className="report-card-heading"><div><span className="eyebrow">TOP 5</span><h3>Najczęściej zamawiane</h3></div><span>Według liczby sztuk</span></div>
            <div className="report-table-scroll"><table className="report-table"><thead><tr><th>Produkt</th><th>Kategoria</th><th>Sztuki</th><th>Sprzedaż</th></tr></thead><tbody>
              {topProducts.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.category}</td><td>{product.quantity}</td><td>{formatPrice(product.revenue)}</td></tr>)}
            </tbody></table></div>
          </article>
          <article className="report-table-card">
            <div className="report-card-heading"><div><span className="eyebrow">BOTTOM 5</span><h3>Najrzadziej zamawiane</h3></div><span>Produkty bez sprzedaży też są widoczne</span></div>
            <div className="report-table-scroll"><table className="report-table"><thead><tr><th>Produkt</th><th>Kategoria</th><th>Sztuki</th><th>Sprzedaż</th></tr></thead><tbody>
              {leastProducts.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.category}</td><td>{product.quantity}</td><td>{formatPrice(product.revenue)}</td></tr>)}
            </tbody></table></div>
          </article>
        </div>
      </section>

      <section className="order-history" id="order-history" aria-labelledby="history-title" hidden={page !== 'history'}>
          <div className="section-heading">
            <div><span className="eyebrow">POWRÓT DO POPRZEDNICH ZAMÓWIEŃ</span><h2 id="history-title">Historia zamówień</h2></div>
            <span className="menu-count">{orderHistory.length} z {MAX_STORED_ORDERS}</span>
          </div>
          {historyStorageWarning && <p className="history-storage-warning" role="status">{historyStorageWarning}</p>}
          {orderHistory.length === 0 ? (
            <div className="history-empty">
              <span aria-hidden="true">▤</span>
              <h3>Jeszcze nie ma zamówień</h3>
              <p>Po złożeniu pierwszego zamówienia pojawi się ono tutaj. Historia pozostaje na tym urządzeniu i w tej przeglądarce.</p>
            </div>
          ) : (
            <div className="history-list">
              {orderHistory.map((order) => (
                <article className="history-card" key={order.number}>
                  <div className="history-card-main">
                    <div>
                      <span className="history-order-number">Zamówienie #{String(order.number).padStart(4, '0')}</span>
                      <time className="history-date" dateTime={order.completedAt.toISOString()}>{order.completedAt.toLocaleString('pl-PL')} · stolik {order.tableId}</time><span className={'order-status order-status-' + order.status}>{order.status === 'open' ? 'Otwarty — do rozliczenia' : order.status === 'paid' ? 'Rozliczony · ' + (order.paymentMethod === 'cash' ? 'gotówka' : 'karta') : 'Anulowany'}</span>
                      <span className="history-items">{order.items.reduce((sum, item) => sum + item.quantity, 0)} szt. · {order.items.length} {order.items.length === 1 ? 'pozycja' : [2, 3, 4].includes(order.items.length) ? 'pozycje' : 'pozycji'}</span>
                    </div>
                    <strong className="history-total">{formatPrice(order.total)}</strong>
                  </div>
                  <button className="history-details-button" type="button" onClick={() => {
                    setLastOrder(order)
                    setPrintStatus('idle')
                    setPrintMessage('')
                  }}>Szczegóły i potwierdzenie <span aria-hidden="true">→</span></button>
                </article>
              ))}
            </div>
          )}
        </section>

      {checkoutOpen && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => {
          if (event.target === event.currentTarget) setCheckoutOpen(false)
        }}>
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button className="modal-close" type="button" aria-label="Zamknij podsumowanie" onClick={() => setCheckoutOpen(false)}>×</button>
            <span className="eyebrow">JESZCZE JEDEN KROK</span>
            <h2 id="checkout-title">Rejestracja rachunku</h2>
            <p className="modal-intro">Sprawdź pozycje i zarejestruj rachunek. Płatność będzie rozliczona później.</p>
            <div className="checkout-lines">
              {cart.map(({ product, quantity }) => (
                <div className="checkout-line" key={product.id}>
                  <span>{product.name} <strong>× {quantity}</strong></span>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-total"><span>Wartość rachunku</span><strong>{formatPrice(total)}</strong></div>
            <div className="demo-warning"><span aria-hidden="true">ⓘ</span> Zamówienie zostanie zapisane jako otwarty rachunek. Stolik pozostanie zajęty do czasu rozliczenia.</div>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setCheckoutOpen(false)}>Wróć do koszyka</button>
              <button className="checkout-button modal-confirm" type="button" onClick={completeOrder}>Zarejestruj rachunek <span aria-hidden="true">→</span></button>
            </div>
          </section>
        </div>
      )}

      {paymentOpen && lastOrder && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget && cardPaymentStatus === 'idle') setPaymentOpen(false) }}>
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
            {cardPaymentStatus === 'idle' && <button className="modal-close" type="button" aria-label="Zamknij rozliczenie" onClick={() => setPaymentOpen(false)}>×</button>}
            <span className="eyebrow">ZAMKNIĘCIE RACHUNKU</span>
            <h2 id="payment-title">{cardPaymentStatus === 'approved' ? 'Płatność zaakceptowana' : cardPaymentStatus !== 'idle' ? 'Płatność kartą' : 'Rozlicz stolik ' + lastOrder.tableId}</h2>
            <p className="modal-intro">Rachunek #{String(lastOrder.number).padStart(4, '0')} · stolik {lastOrder.tableId}</p>
            <div className="checkout-total"><span>Do zapłaty</span><strong>{formatPrice(lastOrder.total)}</strong></div>
            {cardPaymentStatus === 'idle' ? <>
              <div className="payment-methods" role="group" aria-label="Metoda płatności">
                <button type="button" className={paymentMethod === 'cash' ? 'payment-method selected' : 'payment-method'} aria-pressed={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')}>💵 Gotówka</button>
                <button type="button" className={paymentMethod === 'card' ? 'payment-method selected' : 'payment-method'} aria-pressed={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')}>💳 Karta</button>
              </div>
              <div className="demo-warning"><span aria-hidden="true">ⓘ</span> Tryb demonstracyjny — nie pobieramy prawdziwych płatności i nie łączymy się z terminalem.</div>
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setPaymentOpen(false)}>Wróć</button>
                {paymentMethod === 'card'
                  ? <button className="checkout-button modal-confirm" type="button" onClick={startCardPayment}>Rozpocznij płatność <span aria-hidden="true">→</span></button>
                  : <button className="checkout-button modal-confirm" type="button" onClick={() => settleOrder('cash')}>Potwierdź gotówkę <span aria-hidden="true">✓</span></button>}
              </div>
            </> : <div className={cardPaymentStatus === 'approved' ? 'card-terminal-status terminal-approved' : 'card-terminal-status'} role="status" aria-live="polite">
              {cardPaymentStatus !== 'approved' && <span className="terminal-spinner" aria-hidden="true" />}
              <strong>{({
                connecting: 'Łączenie z terminalem…',
                waiting: 'Oczekiwanie na kartę',
                reading: 'Odczytywanie karty…',
                authorizing: 'Autoryzacja transakcji…',
                approved: '✓ Transakcja zaakceptowana',
              } as Record<Exclude<typeof cardPaymentStatus, 'idle'>, string>)[cardPaymentStatus]}</strong>
              <p>{({
                connecting: 'Nawiązywanie bezpiecznego połączenia z urządzeniem płatniczym.',
                waiting: 'Zbliż kartę lub urządzenie do terminala. W tej symulacji przejdziemy dalej automatycznie.',
                reading: 'Dane karty zostały odczytane — trwa przygotowanie transakcji.',
                authorizing: 'Prośba o autoryzację jest przetwarzana przez operatora płatności.',
                approved: 'Płatność została potwierdzona. Za chwilę zamkniemy rachunek.',
              } as Record<Exclude<typeof cardPaymentStatus, 'idle'>, string>)[cardPaymentStatus]}</p>
              <div className="terminal-progress"><span className={'terminal-progress-fill terminal-progress-' + cardPaymentStatus} /></div>
              <small>SYMULACJA · BRAK POŁĄCZENIA Z PRAWDZIWYM TERMINALEM</small>
            </div>}
          </section>
        </div>
      )}

      {lastOrder && !paymentOpen && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => {
          if (event.target === event.currentTarget) setLastOrder(null)
        }}>
          <section className="checkout-modal success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
            <button className="modal-close" type="button" aria-label="Zamknij potwierdzenie" onClick={() => setLastOrder(null)}>×</button>
            <div className="success-mark" aria-hidden="true">✓</div>
            <span className="eyebrow">WSZYSTKO GOTOWE</span>
            <h2 id="success-title">{lastOrder.status === 'paid' ? 'Rachunek rozliczony!' : 'Zamówienie zarejestrowane!'}</h2>
            <p className="modal-intro">Zamówienie <strong>#{String(lastOrder.number).padStart(4, '0')}</strong> przypisano do stolika <strong>{lastOrder.tableId}</strong>. {lastOrder.status === 'open' ? 'Rachunek oczekuje na płatność.' : 'Płatność została zarejestrowana.'}</p>
            <div className="receipt-preview">
              <div className="receipt-brand">Franczesko Restaurant</div>
              <div className="receipt-subtitle">POTWIERDZENIE DEMONSTRACYJNE · NIE JEST PARAGONEM FISKALNYM</div>
              <div className="receipt-meta"><span>Numer</span><strong>#{String(lastOrder.number).padStart(4, '0')}</strong></div><div className="receipt-meta"><span>Stolik</span><strong>{lastOrder.tableId}</strong></div>
              <div className="receipt-meta"><span>Data</span><strong>{lastOrder.completedAt.toLocaleString('pl-PL')}</strong></div>
              {lastOrder.items.map(({ product, quantity }) => (
                <div className="checkout-line" key={product.id}>
                  <span>{product.name} <strong>× {quantity}</strong></span>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                </div>
              ))}
              <div className="checkout-total"><span>RAZEM</span><strong>{formatPrice(lastOrder.total)}</strong></div>
              <p className="receipt-disclaimer">To wyłącznie potwierdzenie w aplikacji demonstracyjnej. Nie jest dokumentem księgowym ani fiskalnym.</p>
            </div>
            <button
              className="checkout-button print-button"
              type="button"
              disabled={printStatus === 'printing'}
              onClick={async () => {
                setPrintStatus('printing')
                setPrintMessage('Wybierz MX06 Mini Printer w oknie Bluetooth. Przygotowujemy krótki wydruk testowy.')
                const lines = [
                  'Franczesko Restaurant',
                  'POTWIERDZENIE ZAMÓWIENIA',
                  'Potwierdzenie demonstracyjne',
                  '----------------------------',
                  `Zamówienie #${String(lastOrder.number).padStart(4, '0')}`,
                  lastOrder.completedAt.toLocaleString('pl-PL'),
                  ...lastOrder.items.map(({ product, quantity }) => `${product.name} x${quantity}  ${formatPrice(product.price * quantity)}`),
                  '----------------------------',
                  `RAZEM: ${formatPrice(lastOrder.total)}`,
                  'To nie jest paragon fiskalny.',
                  'Dziekujemy i smacznego!',
                ]
                try {
                  await printTestReceipt(lines)
                  setPrintStatus('success')
                  setPrintMessage('Wysłano dane do drukarki. Sprawdź wydruk — to potwierdzenie transmisji, nie czujnik fizycznego wydruku.')
                } catch (error) {
                  setPrintStatus('error')
                  setPrintMessage(error instanceof Error ? error.message : 'Nie udało się wydrukować potwierdzenia.')
                }
              }}
            >
              {printStatus === 'printing' ? 'Łączenie i drukowanie…' : 'Drukuj potwierdzenie'}
              <span aria-hidden="true">↗</span>
            </button>
            {printMessage && <p className={`print-status print-status-${printStatus}`} role="status">{printMessage}</p>}
            {lastOrder.status === 'open' && <button className="checkout-button" type="button" onClick={() => { setPaymentOpen(true); setPaymentMethod('cash') }}>Rozlicz rachunek <span aria-hidden="true">→</span></button>}
            <button className="secondary-button success-close" type="button" onClick={() => setLastOrder(null)}>Gotowe <span aria-hidden="true">✓</span></button>
          </section>
        </div>
      )}

      <footer className="site-footer">
        <span className="footer-brand">Franczesko Restaurant</span>
        <span>Mała restauracja, wielka przyjemność <span aria-hidden="true">♥</span></span>
        <span className="demo-note">Wersja demonstracyjna · bez płatności</span>
        <span className="app-version">Wersja {APP_VERSION}</span>
        <span className="build-timestamp">Build: {new Date(__BUILD_TIMESTAMP__).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Europe/Warsaw' })}</span>
      </footer>
    </main>
  )
}

export default App

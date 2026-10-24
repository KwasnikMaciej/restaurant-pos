import { useMemo, useState } from 'react'
import { printTestReceipt } from './printing/mx06-printer'
import './App.css'

type Category = 'Wszystko' | 'Dania główne' | 'Pizza i burgery' | 'Przystawki' | 'Desery' | 'Napoje'

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
  items: CartItem[]
  total: number
  completedAt: Date
}

const categories: Category[] = [
  'Wszystko',
  'Dania główne',
  'Pizza i burgery',
  'Przystawki',
  'Desery',
  'Napoje',
]

const products: Product[] = [
  { id: 'soup', name: 'Domowy rosół', description: 'Z makaronem, marchewką i natką pietruszki', category: 'Dania główne', price: 1600, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85', tag: 'Domowy klasyk' },
  { id: 'cutlet', name: 'Schabowy z ziemniakami', description: 'Złocista panierka, ziemniaki i mizeria', category: 'Dania główne', price: 3200, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85', tag: 'Bestseller' },
  { id: 'pierogi', name: 'Pierogi ruskie', description: 'Ręcznie lepione, z cebulką i śmietaną', category: 'Dania główne', price: 2600, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85' },
  { id: 'pizza', name: 'Pizza Margherita', description: 'Sos pomidorowy, mozzarella, świeża bazylia', category: 'Pizza i burgery', price: 2900, image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85', tag: 'Prosto z pieca' },
  { id: 'burger', name: 'Burger Franczesko', description: 'Wołowina, cheddar, sałata i sos firmowy', category: 'Pizza i burgery', price: 3400, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85' },
  { id: 'fries', name: 'Złociste frytki', description: 'Chrupiące ziemniaki z dipem czosnkowym', category: 'Przystawki', price: 1200, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85' },
  { id: 'salad', name: 'Sałatka ogrodowa', description: 'Świeże warzywa, feta i lekki dressing', category: 'Przystawki', price: 2200, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85' },
  { id: 'cake', name: 'Sernik domowy', description: 'Kremowy sernik z owocami sezonowymi', category: 'Desery', price: 1500, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85', tag: 'Słodka chwila' },
  { id: 'icecream', name: 'Lody waniliowe', description: 'Trzy gałki z polewą czekoladową', category: 'Desery', price: 1300, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85' },
  { id: 'lemonade', name: 'Lemoniada domowa', description: 'Cytryna, mięta i odrobina słodyczy', category: 'Napoje', price: 900, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85', tag: 'Orzeźwiająca' },
  { id: 'compote', name: 'Kompot dnia', description: 'Owocowy, jak u babci', category: 'Napoje', price: 600, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85' },
  { id: 'coffee', name: 'Kawa z mlekiem', description: 'Aromatyczna kawa, podawana na ciepło', category: 'Napoje', price: 1100, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85' },
]

const formatPrice = (priceInGrosze: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(priceInGrosze / 100)

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Wszystko')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null)
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle')
  const [printMessage, setPrintMessage] = useState('')
  const [nextOrderNumber, setNextOrderNumber] = useState(() => {
    try {
      const lastNumber = Number.parseInt(window.localStorage.getItem('franczesko:last-order-number') ?? '0', 10)
      return Number.isFinite(lastNumber) && lastNumber > 0 ? lastNumber + 1 : 1
    } catch {
      return 1
    }
  })

  const visibleProducts = useMemo(
    () => activeCategory === 'Wszystko' ? products : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  )

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

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
    if (cart.length === 0) return

    const order: CompletedOrder = {
      number: nextOrderNumber,
      items: cart.map((item) => ({ ...item })),
      total,
      completedAt: new Date(),
    }

    try {
      window.localStorage.setItem('franczesko:last-order-number', String(order.number))
    } catch {
      // Zamówienie nadal może zostać zrealizowane w tej sesji, nawet bez dostępu do localStorage.
    }

    setLastOrder(order)
    setNextOrderNumber((number) => number + 1)
    setCart([])
    setCheckoutOpen(false)
    setCartOpen(false)
  }

  return (
    <main className="restaurant-app">
      <header className="topbar">
        <a className="brand" href="#menu" aria-label="Franczesko Restaurant — menu">
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span className="brand-copy"><strong>Franczesko</strong><span>RESTAURANT</span></span>
        </a>
        <div className="topbar-note"><span className="open-dot" /> Dziś gotujemy z sercem</div>
        <button className="mobile-cart-button" type="button" onClick={() => setCartOpen((open) => !open)}>
          Koszyk <span>{itemCount}</span>
        </button>
      </header>

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

      <div className="content-layout" id="menu">
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

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  <button className="quick-add" type="button" aria-label={`Dodaj ${product.name} do koszyka`} onClick={() => addToCart(product)}>+</button>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-card-bottom">
                    <strong className="product-price">{formatPrice(product.price)}</strong>
                    <button className="add-button" type="button" onClick={() => addToCart(product)}><span aria-hidden="true">+</span> Dodaj</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
            <button className="checkout-button" type="button" disabled={cart.length === 0} onClick={() => setCheckoutOpen(true)}>
              Przejdź do podsumowania <span aria-hidden="true">→</span>
            </button>
            <p className="cart-footnote"><span aria-hidden="true">♡</span> Przygotowane z sercem, specjalnie dla Ciebie</p>
          </div>
        </aside>
      </div>

      {checkoutOpen && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => {
          if (event.target === event.currentTarget) setCheckoutOpen(false)
        }}>
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button className="modal-close" type="button" aria-label="Zamknij podsumowanie" onClick={() => setCheckoutOpen(false)}>×</button>
            <span className="eyebrow">JESZCZE JEDEN KROK</span>
            <h2 id="checkout-title">Podsumowanie zamówienia</h2>
            <p className="modal-intro">Sprawdź, czy wszystko się zgadza. To wersja demonstracyjna — nie pobieramy żadnych płatności.</p>
            <div className="checkout-lines">
              {cart.map(({ product, quantity }) => (
                <div className="checkout-line" key={product.id}>
                  <span>{product.name} <strong>× {quantity}</strong></span>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-total"><span>Do zapłaty w symulacji</span><strong>{formatPrice(total)}</strong></div>
            <div className="demo-warning"><span aria-hidden="true">ⓘ</span> Kliknięcie „Potwierdź zamówienie” tylko zapisze numer i pokaże potwierdzenie. Nie jest to prawdziwa sprzedaż.</div>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setCheckoutOpen(false)}>Wróć do koszyka</button>
              <button className="checkout-button modal-confirm" type="button" onClick={completeOrder}>Potwierdź zamówienie <span aria-hidden="true">→</span></button>
            </div>
          </section>
        </div>
      )}

      {lastOrder && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => {
          if (event.target === event.currentTarget) setLastOrder(null)
        }}>
          <section className="checkout-modal success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
            <button className="modal-close" type="button" aria-label="Zamknij potwierdzenie" onClick={() => setLastOrder(null)}>×</button>
            <div className="success-mark" aria-hidden="true">✓</div>
            <span className="eyebrow">WSZYSTKO GOTOWE</span>
            <h2 id="success-title">Dziękujemy za zamówienie!</h2>
            <p className="modal-intro">Zamówienie <strong>#{String(lastOrder.number).padStart(4, '0')}</strong> zostało zapisane w tej sesji.</p>
            <div className="receipt-preview">
              <div className="receipt-brand">Franczesko Restaurant</div>
              <div className="receipt-subtitle">POTWIERDZENIE DEMONSTRACYJNE · NIE JEST PARAGONEM FISKALNYM</div>
              <div className="receipt-meta"><span>Numer</span><strong>#{String(lastOrder.number).padStart(4, '0')}</strong></div>
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
                  'TEST WYDRUKU',
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
            <button className="secondary-button success-close" type="button" onClick={() => setLastOrder(null)}>Gotowe <span aria-hidden="true">✓</span></button>
          </section>
        </div>
      )}

      <footer className="site-footer">
        <span className="footer-brand">Franczesko Restaurant</span>
        <span>Mała restauracja, wielka przyjemność <span aria-hidden="true">♥</span></span>
        <span className="demo-note">Wersja demonstracyjna · bez płatności</span>
      </footer>
    </main>
  )
}

export default App

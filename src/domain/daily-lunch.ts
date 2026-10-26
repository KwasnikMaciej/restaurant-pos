export type DailyLunchDefinition = {
  id: string
  name: string
  description: string
  price: number
  image: string
  tag?: string
}

export type DailyLunchProduct = DailyLunchDefinition & { category: 'Lunch dnia' }

export const dailyLunchPool: DailyLunchDefinition[] = [
  { id: 'lunch-schabowy', name: 'Kotlet schabowy z ziemniakami', description: 'Złocisty kotlet schabowy, ziemniaki z koperkiem i mizeria', price: 3290, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-pierogi', name: 'Pierogi ruskie z okrasą', description: 'Pierogi z twarogiem i ziemniakami, cebulka i śmietana', price: 2790, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-gulasz', name: 'Gulasz wołowy z kaszą', description: 'Długo duszona wołowina, kasza gryczana i ogórek kiszony', price: 3490, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-kurczak', name: 'Filet z kurczaka w ziołach', description: 'Soczysty filet, puree ziemniaczane i warzywa na parze', price: 3190, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-mielony', name: 'Kotlet mielony z buraczkami', description: 'Domowy kotlet mielony, ziemniaki i tarte buraczki', price: 2990, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-kopytka', name: 'Kopytka w sosie grzybowym', description: 'Delikatne kopytka ziemniaczane w kremowym sosie z leśnych grzybów', price: 2890, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-bigos', name: 'Bigos staropolski z pieczywem', description: 'Kapusta kiszona i świeża, mięsa, kiełbasa i chleb', price: 2790, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-golabki', name: 'Gołąbki w sosie pomidorowym', description: 'Gołąbki z mięsem i ryżem, sos pomidorowy i ziemniaki', price: 3090, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-pulpety', name: 'Pulpety drobiowe w sosie koperkowym', description: 'Pulpety z indyka, sos koperkowy, ryż i surówka', price: 3090, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-placki', name: 'Placki ziemniaczane z gulaszem', description: 'Chrupiące placki ziemniaczane z aromatycznym gulaszem wieprzowym', price: 3290, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-karkowka', name: 'Karkówka duszona w sosie własnym', description: 'Miękka karkówka, kasza jęczmienna i surówka z kapusty', price: 3290, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-lazanki', name: 'Łazanki z kapustą i kiełbasą', description: 'Makaron, kapusta, kiełbasa i majeranek', price: 2690, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-ryba', name: 'Dorsz panierowany', description: 'Filet z dorsza, ziemniaki i surówka z kiszonej kapusty', price: 3490, image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-nalesniki', name: 'Naleśniki ze szpinakiem', description: 'Naleśniki z farszem szpinakowo-serowym i delikatnym sosem', price: 2790, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-kasza', name: 'Kasza gryczana z warzywami', description: 'Kasza gryczana, pieczone warzywa i sos jogurtowo-ziołowy', price: 2590, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-pieczen', name: 'Pieczeń wieprzowa z kluskami', description: 'Pieczeń w sosie pieczeniowym, kluski śląskie i modra kapusta', price: 3390, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-kurczak-sos', name: 'Kurczak w sosie śmietanowym', description: 'Kawałki kurczaka w sosie śmietanowo-ziołowym z ryżem', price: 3190, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-risotto', name: 'Risotto z pieczarkami', description: 'Kremowy ryż arborio, pieczarki, parmezan i natka pietruszki', price: 2890, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-kotlet-jajko', name: 'Kotlet jajeczny z ziemniakami', description: 'Domowe kotlety jajeczne, ziemniaki i surówka sezonowa', price: 2590, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-papryka', name: 'Papryka faszerowana', description: 'Papryka nadziewana ryżem i mięsem, zapiekana w sosie pomidorowym', price: 2990, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-kaszotto', name: 'Kaszotto z kurczakiem', description: 'Kasza pęczak, kurczak, pieczarki i świeże zioła', price: 3090, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-watrobka', name: 'Wątróbka drobiowa z jabłkiem', description: 'Wątróbka z cebulką i jabłkiem, ziemniaki i ogórek kiszony', price: 2790, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-kapusta', name: 'Fasolka po bretońsku', description: 'Biała fasola w pomidorowym sosie z kiełbasą i majerankiem', price: 2690, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-zapiekanka', name: 'Zapiekanka ziemniaczana', description: 'Ziemniaki, pieczarki, ser i zioła zapieczone na złoto', price: 2790, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-udziec', name: 'Udziec z indyka w sosie', description: 'Pieczony indyk, sos własny, kasza i surówka z marchewki', price: 3290, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-kasza-grzyby', name: 'Kasza gryczana z sosem grzybowym', description: 'Kasza gryczana, sos z leśnych grzybów i ogórek kiszony', price: 2690, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-pierogi-kapusta', name: 'Pierogi z kapustą i grzybami', description: 'Pierogi z kiszoną kapustą i grzybami, okraszone cebulką', price: 2790, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-schab-sos', name: 'Schab w sosie pieczarkowym', description: 'Schab duszony w sosie pieczarkowym, puree i surówka', price: 3290, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-lenive', name: 'Pierogi leniwe z masłem', description: 'Leniwe kluski twarogowe, masło, bułka tarta i cynamon', price: 2690, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-kurczak-papryka', name: 'Kurczak z warzywami', description: 'Filet z kurczaka duszony z papryką, cukinią i ryżem', price: 3090, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-zrazy', name: 'Zrazy wołowe', description: 'Zrazy wołowe w sosie, kasza gryczana i buraczki', price: 3690, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-makaron', name: 'Makaron z kurczakiem i szpinakiem', description: 'Makaron w sosie śmietanowym z kurczakiem i szpinakiem', price: 3090, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-pulpeciki', name: 'Pulpeciki w sosie pomidorowym', description: 'Pulpety wieprzowe w sosie pomidorowym, ryż i surówka', price: 2990, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85' },
  { id: 'lunch-racuchy', name: 'Racuchy z jabłkami', description: 'Puszyste racuchy z jabłkami, cukier puder i jogurt', price: 2490, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-nalesniki-twarog', name: 'Naleśniki z twarogiem', description: 'Naleśniki z waniliowym twarogiem i sosem owocowym', price: 2690, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
  { id: 'lunch-placki-smietana', name: 'Placki ziemniaczane ze śmietaną', description: 'Chrupiące placki ziemniaczane ze śmietaną i koperkiem', price: 2490, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=85', tag: 'Wegetariańskie' },
]

export function getWarsawDateKey(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
  return `${value('year')}-${value('month')}-${value('day')}`
}

export function getDailyLunch(dateKey: string, pool: DailyLunchDefinition[] = dailyLunchPool): DailyLunchProduct {
  if (pool.length === 0) throw new Error('Pula lunchu dnia nie może być pusta')
  let hash = 2166136261
  for (const char of dateKey) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  const index = (hash >>> 0) % pool.length
  return { ...pool[index], category: 'Lunch dnia' }
}

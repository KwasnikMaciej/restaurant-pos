const PRINTER_WIDTH = 384
const SERVICE_UUID = '0000ae30-0000-1000-8000-00805f9b34fb'
const CHARACTERISTIC_UUID = '0000ae01-0000-1000-8000-00805f9b34fb'

type PrinterCharacteristic = {
  writeValueWithoutResponse(value: BufferSource): Promise<void>
}
type PrinterService = {
  getCharacteristic(uuid: string): Promise<PrinterCharacteristic>
}
type PrinterServer = {
  getPrimaryService(uuid: string): Promise<PrinterService>
}
type PrinterGatt = {
  connected: boolean
  connect(): Promise<PrinterServer>
  disconnect(): void
}
type PrinterDevice = {
  name?: string
  gatt?: PrinterGatt
}
type BluetoothPicker = {
  requestDevice(options: {
    acceptAllDevices: boolean
    optionalServices: string[]
  }): Promise<PrinterDevice>
}

const Command = {
  feed: 0xa1,
  drawLine: 0xa2,
  getStatus: 0xa3,
  setQuality: 0xa4,
  lattice: 0xa6,
  setEnergy: 0xaf,
  speed: 0xbd,
  drawingMode: 0xbe,
  unknownF2: 0xf2,
} as const

function crc8(bytes: readonly number[]): number {
  let crc = 0
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x80 ? ((crc << 1) ^ 0x07) & 0xff : (crc << 1) & 0xff
    }
  }
  return crc
}

function packet(command: number, data: readonly number[] | Uint8Array): Uint8Array {
  const bytes = Array.from(data)
  const length = bytes.length
  return new Uint8Array([
    0x51, 0x78, command, 0x00, length & 0xff, (length >> 8) & 0xff,
    ...bytes, crc8(bytes), 0xff,
  ])
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function renderReceipt(lines: string[]): Uint8Array[] {
  const canvas = document.createElement('canvas')
  canvas.width = PRINTER_WIDTH
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Nie można przygotować obrazu potwierdzenia.')

  const margin = 18
  const usableWidth = PRINTER_WIDTH - margin * 2
  const layout: Array<{ text: string; font: string; align: CanvasTextAlign; gapBefore: number }> = []
  for (const [index, text] of lines.entries()) {
    if (index === 0) {
      layout.push({ text, font: 'bold 25px sans-serif', align: 'center', gapBefore: 0 })
    } else if (index === 1) {
      layout.push({ text, font: 'bold 20px sans-serif', align: 'center', gapBefore: 10 })
    } else {
      layout.push({ text, font: '18px sans-serif', align: 'left', gapBefore: 4 })
    }
  }

  let height = 28
  for (const item of layout) {
    context.font = item.font
    height += item.gapBefore + wrapText(context, item.text, usableWidth).length * 26
  }
  height += 24
  canvas.height = height

  const draw = canvas.getContext('2d')
  if (!draw) throw new Error('Nie można przygotować obrazu potwierdzenia.')
  draw.fillStyle = '#fff'
  draw.fillRect(0, 0, canvas.width, canvas.height)
  draw.fillStyle = '#000'
  draw.textBaseline = 'top'
  let y = 14

  for (const item of layout) {
    draw.font = item.font
    draw.textAlign = item.align
    y += item.gapBefore
    const wrapped = wrapText(draw, item.text, usableWidth)
    for (const line of wrapped) {
      const x = item.align === 'center' ? PRINTER_WIDTH / 2 : margin
      draw.fillText(line, x, y, usableWidth)
      y += 26
    }
    if (item.text === '--------------------------------') {
      y += 4
    }
  }

  const pixels = draw.getImageData(0, 0, canvas.width, canvas.height).data
  const rows: Uint8Array[] = []
  for (let rowIndex = 0; rowIndex < canvas.height; rowIndex++) {
    const row = new Uint8Array(PRINTER_WIDTH / 8)
    for (let byteIndex = 0; byteIndex < row.length; byteIndex++) {
      let value = 0
      for (let bit = 0; bit < 8; bit++) {
        const x = byteIndex * 8 + bit
        const pixelIndex = (rowIndex * PRINTER_WIDTH + x) * 4
        const isBlack = pixels[pixelIndex] < 128
        if (isBlack) value |= 1 << bit
      }
      row[byteIndex] = value
    }
    rows.push(row)
  }
  return rows
}

function buildPrintPackets(rows: Uint8Array[]): Uint8Array[] {
  const latticeStart = [0xaa, 0x55, 0x17, 0x38, 0x44, 0x5f, 0x5f, 0x5f, 0x44, 0x38, 0x2c]
  const latticeEnd = [0xaa, 0x55, 0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x17]
  const feed = packet(Command.feed, [0x60, 0x00])
  return [
    packet(Command.unknownF2, [0x01, 0x96]),
    packet(Command.getStatus, [0x00]),
    packet(Command.setQuality, [0x35]),
    packet(Command.lattice, latticeStart),
    packet(Command.setEnergy, [0x20, 0x4e]),
    packet(Command.drawingMode, [0x00]),
    packet(Command.speed, [0x0a]),
    ...rows.map((row) => packet(Command.drawLine, row)),
    packet(Command.lattice, latticeEnd),
    feed,
  ]
}

/**
 * Opens the browser's Bluetooth picker and prints a rasterized, non-fiscal
 * confirmation. Call only from a user gesture (button click).
 */
export async function printTestReceipt(lines: string[]): Promise<void> {
  if (!('bluetooth' in navigator)) {
    throw new Error('Ta przeglądarka nie udostępnia Web Bluetooth. Otwórz aplikację w Chrome na Androidzie.')
  }

  const bluetooth = (navigator as Navigator & { bluetooth?: BluetoothPicker }).bluetooth
  if (!bluetooth) {
    throw new Error('Web Bluetooth jest niedostępny. Sprawdź Chrome i połączenie HTTPS.')
  }

  const device = await bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [SERVICE_UUID],
  })
  const gatt = device.gatt
  if (!gatt) throw new Error('Wybrane urządzenie nie obsługuje połączenia GATT.')

  try {
    const server = await gatt.connect()
    const service = await server.getPrimaryService(SERVICE_UUID)
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID)
    const rows = renderReceipt(lines)
    const packets = buildPrintPackets(rows)

    for (const data of packets) {
      await characteristic.writeValueWithoutResponse(data)
      await sleep(30)
    }
  } finally {
    gatt.disconnect()
  }
}

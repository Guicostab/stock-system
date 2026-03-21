const generateId = () => 'id-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

// ─── Seed Data ──────────────────────────────────────────────────────────────
export const db = {
  categories: [
    { id: '1', name: 'Eletrônicos', description: 'Equipamentos e dispositivos' },
    { id: '2', name: 'Mobiliário', description: 'Escritório' },
    { id: '3', name: 'Químicos', description: 'Requer atenção especial' }
  ],
  units: [
    { id: 'UN', name: 'Unidades (UN)' },
    { id: 'CX', name: 'Caixas (CX)' },
    { id: 'KG', name: 'Quilogramas (KG)' },
    { id: 'L', name: 'Litros (L)' }
  ],
  products: [
    { id: '1', code: 'PRD-001', name: 'Notebook Pro 16"', category: 'Eletrônicos', minStock: 10, unit: 'UN' },
    { id: '2', code: 'PRD-002', name: 'Monitor 27" 4K', category: 'Eletrônicos', minStock: 5, unit: 'UN' },
    { id: '3', code: 'PRD-003', name: 'Teclado Mecânico RGB', category: 'Eletrônicos', minStock: 20, unit: 'UN' },
    { id: '4', code: 'CHM-101', name: 'Ácido Sulfúrico', category: 'Químicos', minStock: 50, unit: 'L' }
  ],
  locations: [
    { id: 'Z1-A1-B1', zone: 'Zona Leste', aisle: 'A1', bin: 'B1', status: 'Livre' },
    { id: 'Z1-A1-B2', zone: 'Zona Leste', aisle: 'A1', bin: 'B2', status: 'Ocupado' },
    { id: 'Z2-A2-A5', zone: 'Zona Oeste', aisle: 'A2', bin: 'A5', status: 'Ocupado' },
    { id: 'C1-RF-F01', zone: 'Câmara Fria', aisle: 'C1', bin: 'F01', status: 'Livre' },
    { id: 'Q1-QT-Q1', zone: 'Quarentena', aisle: 'Q1', bin: 'Q1', status: 'Livre' }
  ],
  batches: [
    { id: 'LOTE-1200', productId: '1', locationId: 'Z1-A1-B2', quantity: 15, reserved: 3, expiration: '2026-12-31', status: 'APROVADO' },
    { id: 'LOTE-1201', productId: '2', locationId: 'Z2-A2-A5', quantity: 8, reserved: 0, expiration: '2030-01-01', status: 'APROVADO' },
    { id: 'LOTE-1202', productId: '3', locationId: 'Z1-A1-B1', quantity: 50, reserved: 0, expiration: '2028-06-30', status: 'APROVADO' }
  ],
  movements: [
    { id: generateId(), batchId: 'LOTE-1200', productName: 'Notebook Pro 16"', type: 'ENTRADA', quantity: 15, date: '2026-03-10T10:00:00Z', user: 'Admin', docRef: 'RCV-001' },
    { id: generateId(), batchId: 'LOTE-1201', productName: 'Monitor 27" 4K', type: 'ENTRADA', quantity: 8, date: '2026-03-15T10:00:00Z', user: 'Admin', docRef: 'RCV-002' },
    { id: generateId(), batchId: 'LOTE-1202', productName: 'Teclado Mecânico RGB', type: 'ENTRADA', quantity: 50, date: '2026-03-18T08:00:00Z', user: 'Operador 1', docRef: 'RCV-002' }
  ],

  // ── Receiving Documents ──────────────────────────────────────────────────
  receivings: [
    {
      id: 'RCV-001',
      supplier: 'Tech Distribuidora Ltda',
      docNumber: 'NF-45721',
      expectedDate: '2026-03-10',
      status: 'CONCLUIDO',
      createdAt: '2026-03-09T09:00:00Z',
      createdBy: 'Admin',
      items: [
        { id: 'i1', productId: '1', expectedQty: 15, countedQty: 15, recountedQty: null, lotId: 'LOTE-1200', expiration: '2026-12-31', locationId: 'Z1-A1-B2', status: 'OK' }
      ],
      history: [
        { step: 'CRIADO', label: 'Documento criado', at: '2026-03-09T09:00:00Z', by: 'Admin' },
        { step: 'CONFERIDO', label: 'Conferência concluída', at: '2026-03-10T10:00:00Z', by: 'Operador 1' },
        { step: 'CONCLUIDO', label: 'Mercadoria alocada no estoque', at: '2026-03-10T11:00:00Z', by: 'Admin' }
      ]
    },
    {
      id: 'RCV-002',
      supplier: 'Escritório Total S.A.',
      docNumber: 'NF-88200',
      expectedDate: '2026-03-15',
      status: 'CONCLUIDO',
      createdAt: '2026-03-14T14:00:00Z',
      createdBy: 'Admin',
      items: [
        { id: 'i1', productId: '2', expectedQty: 8, countedQty: 8, recountedQty: null, lotId: 'LOTE-1201', expiration: '2030-01-01', locationId: 'Z2-A2-A5', status: 'OK' },
        { id: 'i2', productId: '3', expectedQty: 50, countedQty: 50, recountedQty: null, lotId: 'LOTE-1202', expiration: '2028-06-30', locationId: 'Z1-A1-B1', status: 'OK' }
      ],
      history: [
        { step: 'CRIADO', label: 'Documento criado', at: '2026-03-14T14:00:00Z', by: 'Admin' },
        { step: 'CONCLUIDO', label: 'Mercadoria alocada no estoque', at: '2026-03-15T10:30:00Z', by: 'Operador 1' }
      ]
    }
  ],

  // ── Shipping Documents ───────────────────────────────────────────────────
  shippings: [
    {
      id: 'SHP-001',
      destination: 'Cliente ABC Comércio',
      orderRef: 'PED-10099',
      requiredDate: '2026-03-22',
      priority: 'URGENTE',
      status: 'SEPARACAO',
      createdAt: '2026-03-21T08:00:00Z',
      createdBy: 'Admin',
      items: [
        {
          id: 'si1',
          productId: '1',
          productName: 'Notebook Pro 16"',
          requestedQty: 3,
          reservedBatchId: 'LOTE-1200',
          reservedBin: 'Z1-A1-B2',
          pickedQty: null,
          packedQty: null,
          pickedBy: null,
          pickedAt: null,
          status: 'PENDENTE'
        }
      ],
      packages: [],
      history: [
        { step: 'CRIADO', label: 'Ordem criada e estoque reservado', at: '2026-03-21T08:00:00Z', by: 'Admin' },
        { step: 'SEPARACAO', label: 'Em separação', at: '2026-03-21T09:00:00Z', by: 'Sistema' }
      ]
    }
  ]
}

// ─── Helper ──────────────────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// ─── WMS API ─────────────────────────────────────────────────────────────────
export const wmsAPI = {

  // ── Config ─────────────────────────────────────────────────────────────────
  getCategories: () => delay().then(() => [...db.categories]),
  saveCategory: async (cat) => {
    await delay(300)
    if (cat.id && cat.id !== cat._newId) {
      const idx = db.categories.findIndex(c => c.id === cat.id)
      if (idx > -1) db.categories[idx] = { ...cat }
    } else {
      cat.id = generateId()
      db.categories.push(cat)
    }
    return cat
  },
  deleteCategory: async (id) => { await delay(300); db.categories = db.categories.filter(c => c.id !== id); return true },

  getUnits: () => delay().then(() => [...db.units]),
  saveUnit: async (unit) => {
    await delay(300)
    const idx = db.units.findIndex(u => u.id === unit.id)
    if (idx > -1) db.units[idx] = { ...unit }
    else db.units.push(unit)
    return unit
  },
  deleteUnit: async (id) => { await delay(300); db.units = db.units.filter(u => u.id !== id); return true },

  // ── Products ───────────────────────────────────────────────────────────────
  getProducts: () => delay().then(() => [...db.products]),
  saveProduct: async (prod) => {
    await delay()
    if (prod.id) {
      const idx = db.products.findIndex(p => p.id === prod.id)
      if (idx > -1) db.products[idx] = { ...prod }
    } else {
      prod.id = generateId()
      db.products.push(prod)
    }
    return prod
  },
  deleteProduct: async (id) => { await delay(); db.products = db.products.filter(p => p.id !== id); return true },

  // ── Locations ──────────────────────────────────────────────────────────────
  getLocations: () => delay().then(() => [...db.locations]),

  // ── Batches ────────────────────────────────────────────────────────────────
  getBatches: () => delay().then(() =>
    db.batches.map(b => ({ ...b, product: db.products.find(p => p.id === b.productId) || {} }))
  ),

  // ── Movements ──────────────────────────────────────────────────────────────
  getMovements: () => delay().then(() =>
    db.movements.map(m => {
      const batch = db.batches.find(b => b.id === m.batchId) || {}
      const product = db.products.find(p => p.id === batch.productId) || {}
      return { ...m, productName: m.productName || product.name, code: product.code }
    })
  ),

  // ── Receiving Documents ────────────────────────────────────────────────────
  listReceivings: () => delay().then(() =>
    db.receivings.map(r => ({
      ...r,
      items: r.items.map(i => ({ ...i, product: db.products.find(p => p.id === i.productId) || {} }))
    }))
  ),

  getReceiving: (id) => delay().then(() => {
    const r = db.receivings.find(r => r.id === id)
    if (!r) return null
    return {
      ...r,
      items: r.items.map(i => ({ ...i, product: db.products.find(p => p.id === i.productId) || {} }))
    }
  }),

  createReceiving: async (doc) => {
    await delay()
    const id = 'RCV-' + String(db.receivings.length + 1).padStart(3, '0')
    const newDoc = {
      id,
      ...doc,
      status: 'AGUARDANDO',
      createdAt: new Date().toISOString(),
      history: [{ step: 'CRIADO', label: 'Documento criado', at: new Date().toISOString(), by: doc.createdBy }]
    }
    db.receivings.push(newDoc)
    return newDoc
  },

  // Conference step: save counted quantities per item
  submitConference: async (id, conferenceItems, user) => {
    await delay()
    const doc = db.receivings.find(r => r.id === id)
    if (!doc) throw new Error('Documento não encontrado')
    doc.items = conferenceItems
    const hasDivergence = conferenceItems.some(i => i.countedQty !== i.expectedQty)
    doc.status = hasDivergence ? 'RECONTAGEM' : 'CONFERIDO'
    doc.history.push({
      step: doc.status,
      label: hasDivergence ? 'Divergência identificada — recontagem solicitada' : 'Conferência concluída sem divergências',
      at: new Date().toISOString(),
      by: user
    })
    return doc
  },

  // Recount step: save recounted quantities
  submitRecount: async (id, recountItems, user) => {
    await delay()
    const doc = db.receivings.find(r => r.id === id)
    if (!doc) throw new Error('Documento não encontrado')
    doc.items = recountItems.map(i => ({ ...i, status: 'OK' }))
    doc.status = 'CONFERIDO'
    doc.history.push({ step: 'CONFERIDO', label: 'Recontagem concluída e aprovada', at: new Date().toISOString(), by: user })
    return doc
  },

  // Putaway step: persist to stock
  finalizeReceiving: async (id, user) => {
    await delay()
    const doc = db.receivings.find(r => r.id === id)
    if (!doc) throw new Error('Documento não encontrado')
    for (const item of doc.items) {
      const batchId = item.lotId || generateId()
      db.batches.push({ id: batchId, productId: item.productId, locationId: item.locationId, quantity: item.countedQty, reserved: 0, expiration: item.expiration || null, status: 'APROVADO' })
      const product = db.products.find(p => p.id === item.productId)
      db.movements.push({ id: generateId(), batchId, productName: product?.name || '—', type: 'ENTRADA', quantity: item.countedQty, date: new Date().toISOString(), user, docRef: id })
    }
    doc.status = 'CONCLUIDO'
    doc.history.push({ step: 'CONCLUIDO', label: 'Mercadoria alocada no estoque (putaway concluído)', at: new Date().toISOString(), by: user })
    return doc
  },

  // ── Shipping Documents ─────────────────────────────────────────────────────
  listShippings: () => delay().then(() =>
    db.shippings.map(s => ({
      ...s,
      items: s.items.map(i => ({ ...i, product: db.products.find(p => p.id === i.productId) || {} }))
    }))
  ),

  getShipping: (id) => delay().then(() => {
    const s = db.shippings.find(s => s.id === id)
    if (!s) return null
    return { ...s, items: s.items.map(i => ({ ...i, product: db.products.find(p => p.id === i.productId) || {} })) }
  }),

  createShipping: async (doc) => {
    await delay()
    const id = 'SHP-' + String(db.shippings.length + 1).padStart(3, '0')
    const items = []
    for (const item of doc.items) {
      // Auto-reserve using FEFO
      const availableBatches = db.batches
        .filter(b => b.productId === item.productId && (b.quantity - (b.reserved || 0)) >= item.requestedQty && b.status === 'APROVADO')
        .sort((a, b) => {
          if (!a.expiration) return 1
          if (!b.expiration) return -1
          return new Date(a.expiration) - new Date(b.expiration)
        })
      if (!availableBatches.length) throw new Error(`Estoque insuficiente para o produto ${item.productId}`)
      const batch = availableBatches[0]
      batch.reserved = (batch.reserved || 0) + item.requestedQty
      const product = db.products.find(p => p.id === item.productId)
      items.push({ id: generateId(), productId: item.productId, productName: product?.name || '—', requestedQty: item.requestedQty, reservedBatchId: batch.id, reservedBin: batch.locationId, pickedQty: null, packedQty: null, pickedBy: null, pickedAt: null, status: 'PENDENTE' })
    }
    const newDoc = { id, ...doc, items, packages: [], status: 'SEPARACAO', createdAt: new Date().toISOString(), history: [
      { step: 'CRIADO', label: 'Ordem criada e estoque reservado (FEFO)', at: new Date().toISOString(), by: doc.createdBy },
      { step: 'SEPARACAO', label: 'Aguardando separação', at: new Date().toISOString(), by: 'Sistema' }
    ] }
    db.shippings.push(newDoc)
    return newDoc
  },

  // Picker confirms picking of one item
  confirmPick: async (shippingId, itemId, pickedQty, user) => {
    await delay()
    const doc = db.shippings.find(s => s.id === shippingId)
    if (!doc) throw new Error('Documento não encontrado')
    const item = doc.items.find(i => i.id === itemId)
    if (!item) throw new Error('Item não encontrado')
    item.pickedQty = pickedQty
    item.pickedBy = user
    item.pickedAt = new Date().toISOString()
    item.status = 'SEPARADO'
    const allPicked = doc.items.every(i => i.status === 'SEPARADO')
    if (allPicked) {
      doc.status = 'SEPARADO'
      doc.history.push({ step: 'SEPARADO', label: 'Todos os itens separados', at: new Date().toISOString(), by: user })
    }
    return doc
  },

  // Conference + packing step
  confirmPacking: async (shippingId, items, packages, user) => {
    await delay()
    const doc = db.shippings.find(s => s.id === shippingId)
    if (!doc) throw new Error('Documento não encontrado')
    doc.items = doc.items.map(i => {
      const conf = items.find(x => x.id === i.id)
      return conf ? { ...i, packedQty: conf.packedQty, status: 'EMBALADO' } : i
    })
    doc.packages = packages
    doc.status = 'EMBALAGEM'
    doc.history.push({ step: 'EMBALAGEM', label: 'Conferência e embalagem concluídas', at: new Date().toISOString(), by: user })
    return doc
  },

  // Final dispatch: deduct stock
  dispatchShipping: async (id, user) => {
    await delay()
    const doc = db.shippings.find(s => s.id === id)
    if (!doc) throw new Error('Documento não encontrado')
    for (const item of doc.items) {
      const batch = db.batches.find(b => b.id === item.reservedBatchId)
      if (batch) {
        const qty = item.packedQty || item.pickedQty || item.requestedQty
        batch.quantity -= qty
        batch.reserved = Math.max(0, (batch.reserved || 0) - item.requestedQty)
        const product = db.products.find(p => p.id === item.productId)
        db.movements.push({ id: generateId(), batchId: batch.id, productName: product?.name || '—', type: 'SAIDA', quantity: qty, date: new Date().toISOString(), user, docRef: id })
      }
    }
    doc.status = 'EXPEDIDO'
    doc.history.push({ step: 'EXPEDIDO', label: 'Expedição finalizada e estoque baixado', at: new Date().toISOString(), by: user })
    return doc
  }
}

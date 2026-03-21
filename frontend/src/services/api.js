// Serviço de API
import { getToken } from './auth'

const API_BASE_URL = 'https://api.estoque.com/api' // URL da API ASP.NET Core

// Configuração do fetch com autenticação
async function fetchAPI(endpoint, options = {}) {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado - redirecionar para login
        window.location.href = '/login'
      }
      throw new Error(`API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Produtos
export const productsAPI = {
  getAll: () => fetchAPI('/products'),
  getById: (id) => fetchAPI(`/products/${id}`),
  create: (product) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  update: (id, product) => fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }),
  delete: (id) => fetchAPI(`/products/${id}`, {
    method: 'DELETE'
  })
}

// Movimentações de Estoque
export const stockMovementsAPI = {
  getAll: (filters) => {
    const params = new URLSearchParams(filters)
    return fetchAPI(`/stockmovements?${params}`)
  },
  getById: (id) => fetchAPI(`/stockmovements/${id}`),
  create: (movement) => fetchAPI('/stockmovements', {
    method: 'POST',
    body: JSON.stringify(movement)
  }),
  getByProduct: (productId) => fetchAPI(`/stockmovements/product/${productId}`)
}

// Usuários
export const usersAPI = {
  getAll: () => fetchAPI('/users'),
  getById: (id) => fetchAPI(`/users/${id}`),
  create: (user) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(user)
  }),
  update: (id, user) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  }),
  delete: (id) => fetchAPI(`/users/${id}`, {
    method: 'DELETE'
  })
}

// Perfis/Roles
export const rolesAPI = {
  getAll: () => fetchAPI('/roles'),
  getById: (id) => fetchAPI(`/roles/${id}`),
  create: (role) => fetchAPI('/roles', {
    method: 'POST',
    body: JSON.stringify(role)
  }),
  update: (id, role) => fetchAPI(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(role)
  }),
  delete: (id) => fetchAPI(`/roles/${id}`, {
    method: 'DELETE'
  })
}

// Permissões
export const permissionsAPI = {
  getAll: () => fetchAPI('/permissions'),
  assignToRole: (roleId, permissions) => fetchAPI(`/permissions/role/${roleId}`, {
    method: 'POST',
    body: JSON.stringify(permissions)
  }),
  getRolePermissions: (roleId) => fetchAPI(`/permissions/role/${roleId}`)
}

// Relatórios
export const reportsAPI = {
  getLowStock: () => fetchAPI('/reports/low-stock'),
  getMovements: (filters) => {
    const params = new URLSearchParams(filters)
    return fetchAPI(`/reports/movements?${params}`)
  },
  getProductHistory: (productId, filters) => {
    const params = new URLSearchParams(filters)
    return fetchAPI(`/reports/product/${productId}?${params}`)
  }
}

// Logs de Auditoria
export const auditAPI = {
  getAll: (filters) => {
    const params = new URLSearchParams(filters)
    return fetchAPI(`/audit?${params}`)
  }
}

export default {
  products: productsAPI,
  stockMovements: stockMovementsAPI,
  users: usersAPI,
  roles: rolesAPI,
  permissions: permissionsAPI,
  reports: reportsAPI,
  audit: auditAPI
}

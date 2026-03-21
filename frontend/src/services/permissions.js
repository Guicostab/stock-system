// Serviço de Permissões
import { getCurrentUser } from './auth'

// Módulos do sistema
const MODULES = {
  PRODUCTS: 'products',
  STOCK: 'stock',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  USERS: 'users'
}

// Tipos de permissão
const PERMISSIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete'
}

// Permissões por perfil (simulação)
const ROLE_PERMISSIONS = {
  admin: {
    products: ['view', 'create', 'edit', 'delete'],
    stock: ['view', 'create', 'edit', 'delete'],
    reports: ['view', 'create', 'edit', 'delete'],
    settings: ['view', 'create', 'edit', 'delete'],
    users: ['view', 'create', 'edit', 'delete']
  },
  operator: {
    products: ['view', 'create', 'edit'],
    stock: ['view', 'create', 'edit'],
    reports: ['view'],
    settings: [],
    users: []
  },
  viewer: {
    products: ['view'],
    stock: ['view'],
    reports: ['view'],
    settings: [],
    users: []
  }
}

export function hasPermission(module, permission) {
  const user = getCurrentUser()
  if (!user || !user.role) return false

  const rolePermissions = ROLE_PERMISSIONS[user.role]
  if (!rolePermissions) return false

  const modulePermissions = rolePermissions[module]
  if (!modulePermissions) return false

  return modulePermissions.includes(permission)
}

export function canView(module) {
  return hasPermission(module, PERMISSIONS.VIEW)
}

export function canCreate(module) {
  return hasPermission(module, PERMISSIONS.CREATE)
}

export function canEdit(module) {
  return hasPermission(module, PERMISSIONS.EDIT)
}

export function canDelete(module) {
  return hasPermission(module, PERMISSIONS.DELETE)
}

export function isAdmin() {
  const user = getCurrentUser()
  return user && user.role === 'admin'
}

export function getUserPermissions() {
  const user = getCurrentUser()
  if (!user || !user.role) return {}

  return ROLE_PERMISSIONS[user.role] || {}
}

export { MODULES, PERMISSIONS }

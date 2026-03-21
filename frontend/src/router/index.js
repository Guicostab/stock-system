import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/ForgotPasswordView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('../layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/dashboard/DashboardView.vue')
      },
      // WMS Catalog Submenu
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/products/ProductsView.vue')
      },
      // Receiving Module
      {
        path: 'receiving',
        name: 'ReceivingList',
        component: () => import('../views/receiving/ReceivingListView.vue')
      },
      {
        path: 'receiving/:id',
        name: 'ReceivingDetail',
        component: () => import('../views/receiving/ReceivingDetailView.vue')
      },
      // Shipping Module
      {
        path: 'shipping',
        name: 'ShippingList',
        component: () => import('../views/shipping/ShippingListView.vue')
      },
      {
        path: 'shipping/:id',
        name: 'ShippingDetail',
        component: () => import('../views/shipping/ShippingDetailView.vue')
      },
      // WMS Inventory & Stock Submenu
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('../views/wms/UnifiedInventory.vue')
      },
      {
        path: 'movements',
        name: 'MovementsHistory',
        component: () => import('../views/wms/MovementsHistory.vue')
      },
      // WMS Layout Management
      {
        path: 'locations',
        name: 'LocationsManager',
        component: () => import('../views/wms/LocationsManager.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('../views/settings/ReportsView.vue')
      },
      // WMS Admin
      {
        path: 'roles',
        name: 'RolesPermissions',
        component: () => import('../views/settings/RolesPermissions.vue'),
        meta: { requireAdmin: true }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/settings/UsersView.vue'),
        meta: { requireAdmin: true }
      },
      {
        path: 'configs',
        name: 'Configurations',
        component: () => import('../views/settings/ConfigurationsView.vue'),
        meta: { requireAdmin: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/profile/ProfileView.vue')
      },
      {
        path: 'audit',
        name: 'AuditLogs',
        component: () => import('../views/settings/AuditLogs.vue'),
        meta: { requireAdmin: true }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes
})

// Navigation Guard mapping RBAC logic and public isolation
router.beforeEach((to, from, next) => {
  const isAuth = store.getters.isAuthenticated
  const userRole = store.getters.userRole

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuth) {
      next('/login')
    } else {
      if (to.matched.some(record => record.meta.requireAdmin) && userRole !== 'ADMIN') {
        next('/') // Redirect non-admins to dashboard heavily controlled zone
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.public) && isAuth) {
    next('/')
  } else {
    next()
  }
})

export default router

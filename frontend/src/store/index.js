import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: localStorage.getItem('theme') || 'light',
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    language: localStorage.getItem('language') || 'pt-BR'
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
      localStorage.setItem('theme', theme)
    },
    SET_AUTH(state, { token, user }) {
      state.token = token
      state.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    LOGOUT(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    SET_LANG(state, lang) {
      state.language = lang
      localStorage.setItem('language', lang)
    }
  },
  actions: {
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      commit('SET_THEME', newTheme)
    },
    setLanguage({ commit }, lang) {
      commit('SET_LANG', lang)
    },
    login({ commit }, credentials) {
      // Mocked Authentication flow for Frontend-first WMS 
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'admin@wemov.com' && credentials.password === 'admin') {
            const mockToken = 'jwt-mock-enterprise-token-x1x2x3'
            const mockUser = { id: 1, name: 'Admin Wemov', role: 'ADMIN', email: 'admin@wemov.com' }
            commit('SET_AUTH', { token: mockToken, user: mockUser })
            resolve(mockUser)
          } else {
            reject(new Error('Credenciais inválidas'))
          }
        }, 800)
      })
    },
    logout({ commit }) {
      commit('LOGOUT')
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    userRole: state => state.user ? state.user.role : null,
    userProfile: state => state.user,
    currentTheme: state => state.theme,
    currentLanguage: state => state.language
  }
})

// Serviço de Autenticação
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function login(email, password) {
  // Simulação de login - em produção, fazer chamada à API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Usuários de teste
      const users = [
        { id: 1, name: 'Admin', email: 'admin@estoque.com', password: 'admin123', role: 'admin' },
        { id: 2, name: 'Operador', email: 'operador@estoque.com', password: '123456', role: 'operator' }
      ]

      const user = users.find(u => u.email === email && u.password === password)

      if (user) {
        const token = 'mock_jwt_token_' + Date.now()
        const userData = { id: user.id, name: user.name, email: user.email, role: user.role }
        
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        
        // Log de auditoria
        addAuditLog('Login', 'Autenticação', 'Login realizado com sucesso')
        
        resolve({ token, user: userData })
      } else {
        reject(new Error('Email ou senha inválidos'))
      }
    }, 800)
  })
}

export function logout() {
  addAuditLog('Logout', 'Autenticação', 'Logout realizado')
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser() {
  const userData = localStorage.getItem(USER_KEY)
  return userData ? JSON.parse(userData) : null
}

export function updateUserProfile(userData) {
  const currentUser = getCurrentUser()
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData }
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
    addAuditLog('Atualização de Perfil', 'Perfil', 'Perfil atualizado')
    return updatedUser
  }
  return null
}

export function forgotPassword(email) {
  // Simulação de recuperação de senha
  return new Promise((resolve) => {
    setTimeout(() => {
      addAuditLog('Recuperação de Senha', 'Autenticação', `Solicitação de recuperação para ${email}`)
      resolve({ message: 'Email de recuperação enviado com sucesso!' })
    }, 1000)
  })
}

// Helper para logs de auditoria
function addAuditLog(action, module, details) {
  const logs = JSON.parse(localStorage.getItem('audit_logs') || '[]')
  const user = getCurrentUser()
  
  logs.unshift({
    id: Date.now(),
    user: user ? user.name : 'Sistema',
    userId: user ? user.id : 0,
    action,
    module,
    details,
    timestamp: new Date().toISOString()
  })
  
  // Manter apenas os últimos 100 logs
  if (logs.length > 100) {
    logs.pop()
  }
  
  localStorage.setItem('audit_logs', JSON.stringify(logs))
}

export { addAuditLog }

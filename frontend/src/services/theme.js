// Serviço de Tema (Claro/Escuro)
const THEME_KEY = 'app_theme'

export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light'
  applyTheme(savedTheme)
  return savedTheme
}

export function toggleTheme() {
  const currentTheme = getCurrentTheme()
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  applyTheme(newTheme)
  return newTheme
}

export function setTheme(theme) {
  applyTheme(theme)
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light'
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_KEY, theme)
}

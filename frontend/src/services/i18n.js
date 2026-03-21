import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'

import ptBrElement from 'element-ui/lib/locale/lang/pt-br'
import enElement from 'element-ui/lib/locale/lang/en'
import esElement from 'element-ui/lib/locale/lang/es'

import ptBR from '../lang/pt-BR.json'
import enUS from '../lang/en-US.json'
import esES from '../lang/es-ES.json'

Vue.use(VueI18n)

const messages = {
  'pt-BR': { ...ptBrElement, ...ptBR },
  'en-US': { ...enElement, ...enUS },
  'es-ES': { ...esElement, ...esES }
}

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'pt-BR',
  fallbackLocale: 'en-US',
  messages
})

// Configure element-ui to use vue-i18n
ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n

import { createI18n } from 'vue-i18n'
import ko from './locales/ko'
import en from './locales/en'

const savedLocale = localStorage.getItem('locale') || 'ko'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { ko, en },
})

export default i18n

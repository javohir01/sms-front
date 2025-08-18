import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ru from 'element-plus/dist/locale/ru.mjs'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2563eb',
          secondary: '#6b7280',
          accent: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
          success: '#10b981',
          surface: '#ffffff',
          background: '#f8f9fc',
          'grey-800': '#212121',
          'grey-700': '#374151',
          'grey-600': '#475467',
          'grey-500': '#6b7280',
          'grey-400': '#9ca3af',
          'grey-300': '#d1d5db',
          'grey-200': '#e5e7eb',
          'grey-100': '#f3f4f6',
        },
      },
    },
  },
})

const app = createApp(App)
app
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .use(ElementPlus, {
    locale: ru,
  })
  .mount('#app')
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1697F6',
          secondary: '#1867C0',
          accent: '#AEDDFF',
          info: '#7BC6FF',
        },
      },
    },
  },
})
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/lib/components'

export default createVuetify({
  components: {
    VCalendar,
  },
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
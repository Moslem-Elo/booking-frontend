/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
const myCustomTheme = {
  dark: true,
  colors: {
    primary: '#C5A253',
    secondary: '#424242',
    surface: '#121212',
    background: '#1E1E1E',
    error: '#CF6679',
  },
}
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})

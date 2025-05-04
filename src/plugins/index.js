/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router' // ← Router importieren

export function registerPlugins (app) {
  app.use(vuetify)
  app.use(router) // ← Router registrieren
}

import './style.css'
import './components/auth-form.js'
import { authService } from './services/auth-service.js'

import './components/dashboard-view.js'

const app = document.querySelector('#app')

// Simple router/view manager
const renderApp = (session) => {
  app.innerHTML = `
    <div class="container">
      <h1>BodyGear</h1>
      <div id="app-content"></div>
    </div>
  `
  const content = app.querySelector('#app-content')

  if (!session) {
    content.innerHTML = '<auth-form></auth-form>'
  } else {
    content.innerHTML = '<dashboard-view></dashboard-view>'
  }
}

// Initial check
const init = async () => {
  try {
    app.innerHTML = '<div style="padding: 2rem; text-align: center;">Chargement de BodyGear...</div>'
    const user = await authService.getUser()
    renderApp(user)
  } catch (error) {
    console.error('Initialization Error:', error)
    app.innerHTML = `
            <div style="padding: 2rem; color: var(--color-danger); text-align: center;">
                <h3>Erreur de chargement</h3>
                <p>Impossible de démarrer l'application.</p>
                <p style="font-family: monospace; background: #333; padding: 1rem; margin-top: 1rem;">${error.message}</p>
                <p style="margin-top: 1rem;">Vérifiez votre configuration .env et la console du navigateur.</p>
            </div>
        `
  }
}

init()

// Listen for changes
authService.onAuthStateChange((event, session) => {
  console.log('Auth State Change:', event, session)
  renderApp(session)
})

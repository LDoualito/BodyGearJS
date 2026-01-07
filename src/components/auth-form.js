import { authService } from '../services/auth-service'

export class AuthForm extends HTMLElement {
    constructor() {
        super()
        this.isLogin = true // Toggle between login and register
    }

    connectedCallback() {
        this.render()
        this.addEventListeners()
    }

    render() {
        this.innerHTML = `
      <div class="auth-container card">
        <h2>${this.isLogin ? 'Connexion' : 'Inscription'}</h2>
        <form id="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required placeholder="nom@exemple.com" />
          </div>
          <div class="form-group" style="margin-top: 1rem;">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" required placeholder="******" minlength="6" />
          </div>
          <div id="error-message" class="error" style="color: var(--color-danger); margin-top: 1rem; display: none;"></div>
          <div class="form-actions" style="margin-top: 1.5rem;">
            <button type="submit" class="btn-primary" style="width: 100%;">
              ${this.isLogin ? 'SE CONNECTER' : 'S\'INSCRIRE'}
            </button>
          </div>
        </form>
        <p style="margin-top: 1rem; text-align: center; font-size: 0.9em;">
          ${this.isLogin ? 'Pas de compte ?' : 'Déjà un compte ?'}
          <a href="#" id="toggle-auth">${this.isLogin ? 'Créer un compte' : 'Se connecter'}</a>
        </p>
      </div>
    `
    }

    addEventListeners() {
        const form = this.querySelector('#auth-form')
        const toggleLink = this.querySelector('#toggle-auth')

        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const email = this.querySelector('#email').value
            const password = this.querySelector('#password').value
            const errorDiv = this.querySelector('#error-message')

            errorDiv.style.display = 'none'
            errorDiv.textContent = ''

            try {
                let result
                if (this.isLogin) {
                    result = await authService.signIn(email, password)
                } else {
                    result = await authService.signUp(email, password)
                }

                if (result.error) {
                    throw result.error
                }

                // On success, the onAuthStateChange in main.js will handle the redirect

            } catch (err) {
                errorDiv.textContent = err.message
                errorDiv.style.display = 'block'
            }
        })

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault()
            this.isLogin = !this.isLogin
            this.render()
            this.addEventListeners() // Re-attach listeners after re-render
        })
    }
}

customElements.define('auth-form', AuthForm)

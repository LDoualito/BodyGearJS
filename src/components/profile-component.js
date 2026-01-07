import { workoutService } from '../services/workout-service'

export class ProfileComponent extends HTMLElement {
    connectedCallback() {
        this.render()
        this.loadProfile()
        this.addEventListeners()
    }

    render() {
        this.innerHTML = `
      <div class="card" style="margin-bottom: 2rem;">
        <h3>Mon Profil</h3>
        <form id="profile-form" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end;">
            <div class="form-group">
              <label for="weight">Poids (kg)</label>
              <input type="number" id="weight" step="0.1" required placeholder="70" />
            </div>
            <div class="form-group">
              <label for="height">Taille (cm)</label>
              <input type="number" id="height" required placeholder="175" />
            </div>
            <button type="submit" class="btn-primary" style="height: fit-content; padding: 0.6em 1em;">OK</button>
        </form>
        <p id="profile-msg" style="margin-top: 0.5rem; font-size: 0.9em; min-height: 1.2em;"></p>
      </div>
    `
    }

    async loadProfile() {
        const { data: profile } = await workoutService.getProfile()
        if (profile) {
            this.querySelector('#weight').value = profile.weight || ''
            this.querySelector('#height').value = profile.height || ''
        }
    }

    addEventListeners() {
        this.querySelector('#profile-form').addEventListener('submit', async (e) => {
            e.preventDefault()
            const weight = this.querySelector('#weight').value
            const height = this.querySelector('#height').value
            const msg = this.querySelector('#profile-msg')

            const { error } = await workoutService.updateProfile({
                weight: parseFloat(weight),
                height: parseFloat(height),
                updated_at: new Date()
            })

            if (error) {
                msg.textContent = 'Erreur: ' + error.message
                msg.style.color = 'var(--color-danger)'
            } else {
                msg.textContent = 'Profil mis à jour !'
                msg.style.color = 'var(--color-success)'
                setTimeout(() => msg.textContent = '', 3000)
            }
        })
    }
}

customElements.define('profile-component', ProfileComponent)

import './workout-form.js'
import './workout-list.js'
import './chart-component.js'
import './goals-component.js'
import './profile-component.js'
import { authService } from '../services/auth-service.js'

export class DashboardView extends HTMLElement {
  connectedCallback() {
    this.render()
    this.setupLogout()
  }

  render() {
    this.innerHTML = `
      <div class="dashboard-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>Tableau de Bord</h2>
        <button id="logout-btn">SE DECONNECTER</button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
        <!-- Area 1: New Workout & Profile -->
        <section>
          <profile-component></profile-component>
          <workout-form></workout-form>
        </section>
        
        <!-- Area 2: Stats & Goals -->
        <section style="display: grid; gap: 2rem;">
           <div class="card">
             <h3>Répartition des Activités</h3>
             <chart-component></chart-component>
           </div>
           
           <goals-component></goals-component>
        </section>

        <!-- Area 3: History -->
        <section>
           <workout-list></workout-list>
        </section>
      </div>
    `
  }

  setupLogout() {
    this.querySelector('#logout-btn').addEventListener('click', () => {
      authService.signOut()
    })
  }
}

customElements.define('dashboard-view', DashboardView)

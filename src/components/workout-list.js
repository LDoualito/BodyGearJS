import { workoutService } from '../services/workout-service'

export class WorkoutList extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadWorkouts()

    // Listen for updates from the form
    document.addEventListener('workout-added', () => {
      this.loadWorkouts()
    })
  }

  async loadWorkouts() {
    const listContainer = this.querySelector('#workout-items')
    listContainer.innerHTML = '<p>Chargement...</p>'

    // Get filter value
    const filterType = this.querySelector('#filter-type')?.value || 'all'

    const { data: workouts, error } = await workoutService.getWorkouts()

    if (error) {
      listContainer.innerHTML = `<p style="color: var(--color-danger)">Erreur: ${error.message}</p>`
      return
    }

    // Filter locally
    const filteredWorkouts = filterType === 'all'
      ? workouts
      : workouts.filter(w => w.type === filterType)

    if (!filteredWorkouts || filteredWorkouts.length === 0) {
      listContainer.innerHTML = '<p>Aucune séance trouvée.</p>'
      return
    }

    listContainer.innerHTML = filteredWorkouts.map(workout => `
      <div class="card" style="margin-bottom: 1rem; border-left: 4px solid var(--color-primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="margin-bottom: 0.5rem; text-transform: capitalize;">${workout.type}</h4>
            <p style="color: var(--color-text-muted); font-size: 0.9em;">
              ${new Date(workout.date).toLocaleDateString()} &bull; ${workout.duration} min &bull; 
              <span style="color: var(--color-accent); font-weight: bold;">${workout.calories} kcal</span>
            </p>
            ${workout.comment ? `<p style="margin-top: 0.5rem; font-style: italic;">"${workout.comment}"</p>` : ''}
          </div>
          <div style="display: flex; gap: 0.5rem;">
              <button class="edit-btn" data-id='${JSON.stringify(workout)}' style="padding: 0.3em 0.6em; font-size: 0.8em; border-color: var(--color-text); color: var(--color-text); background: transparent;">
                MODIF
              </button>
              <button class="delete-btn" data-id="${workout.id}" style="padding: 0.3em 0.6em; font-size: 0.8em; border-color: var(--color-danger); color: var(--color-danger); background: transparent;">
                SUPPR
              </button>
          </div>
        </div>
      </div>
    `).join('')

    this.addListeners()
  }

  addListeners() {
    this.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('Supprimer cette séance ?')) {
          const id = e.target.dataset.id
          await workoutService.deleteWorkout(id)
          this.loadWorkouts()
          this.dispatchEvent(new CustomEvent('workout-deleted', { bubbles: true, composed: true }))
        }
      })
    })

    this.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const workout = JSON.parse(e.target.dataset.id)
        this.dispatchEvent(new CustomEvent('edit-workout', {
          bubbles: true,
          composed: true,
          detail: workout
        }))
      })
    })

    // Filter listener
    const filterSelect = this.querySelector('#filter-type')
    if (filterSelect && !filterSelect.dataset.listening) {
      filterSelect.dataset.listening = "true"
      filterSelect.addEventListener('change', () => {
        this.loadWorkouts()
      })
    }
  }

  render() {
    this.innerHTML = `
      <div class="workout-list-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
             <h3>Historique</h3>
             <select id="filter-type" style="width: auto; padding: 0.3rem;">
                <option value="all">Tout voir</option>
                <option value="musculation">Musculation</option>
                <option value="cardio">Cardio</option>
                <option value="yoga">Yoga</option>
                <option value="natation">Natation</option>
                <option value="course">Course</option>
                <option value="cyclisme">Cyclisme</option>
             </select>
        </div>
        <div id="workout-items"></div>
      </div>
    `
  }
}

customElements.define('workout-list', WorkoutList)

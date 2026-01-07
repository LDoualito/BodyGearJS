import { workoutService } from '../services/workout-service'

export class WorkoutForm extends HTMLElement {
  connectedCallback() {
    this.render()
    this.addEventListeners()

    document.addEventListener('edit-workout', (e) => this.loadForEdit(e.detail))
  }

  loadForEdit(workout) {
    this.editId = workout.id
    this.querySelector('#type').value = workout.type
    this.querySelector('#duration').value = workout.duration
    // Format date for input type=date (YYYY-MM-DD)
    this.querySelector('#date').value = workout.date.split('T')[0]
    this.querySelector('#comment').value = workout.comment || ''

    this.querySelector('h3').textContent = 'Modifier une séance'
    this.querySelector('button[type="submit"]').textContent = 'MODIFIER'

    this.scrollIntoView({ behavior: 'smooth' })
  }

  render() {
    this.innerHTML = `
      <div class="card" style="margin-bottom: 2rem;">
        <h3>Enregistrer une séance</h3>
        <form id="workout-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="type">Activité</label>
              <select id="type" required>
                <option value="musculation">Musculation (MET 5)</option>
                <option value="cardio">Cardio (MET 10)</option>
                <option value="yoga">Yoga (MET 3)</option>
                <option value="natation">Natation (MET 8)</option>
                <option value="course">Course (MET 9)</option>
                <option value="cyclisme">Cyclisme (MET 7.5)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="duration">Durée (minutes)</label>
              <input type="number" id="duration" required min="1" placeholder="e.g., 60" />
            </div>
            <div class="form-group">
              <label for="date">Date</label>
              <input type="date" id="date" required value="${new Date().toISOString().split('T')[0]}" max="${new Date().toISOString().split('T')[0]}" />
            </div>
            <div class="form-group">
              <label for="comment">Commentaire</label>
              <input type="text" id="comment" placeholder="Sensations, records..." />
            </div>
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 1rem; width: 100%;">AJOUTER LA SÉANCE</button>
        </form>
      </div>
    `
  }

  addEventListeners() {
    const form = this.querySelector('#workout-form')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const dateValue = this.querySelector('#date').value
      const today = new Date().toISOString().split('T')[0]

      if (dateValue > today) {
        alert('Impossible d\'ajouter une séance dans le futur !')
        return
      }

      const workout = {
        type: this.querySelector('#type').value,
        duration: parseInt(this.querySelector('#duration').value),
        date: dateValue,
        comment: this.querySelector('#comment').value
      }

      try {
        if (this.editId) {
          const { error } = await workoutService.updateWorkout(this.editId, workout)
          if (error) throw error
          this.editId = null
          this.querySelector('h3').textContent = 'Enregistrer une séance'
          this.querySelector('button[type="submit"]').textContent = 'AJOUTER LA SÉANCE'
        } else {
          const { error } = await workoutService.addWorkout(workout)
          if (error) throw error
        }

        // Dispatch event to notify list to refresh
        this.dispatchEvent(new CustomEvent('workout-added', {
          bubbles: true,
          composed: true
        }))

        form.reset()
        // Reset date to today after reset
        this.querySelector('#date').value = new Date().toISOString().split('T')[0]

      } catch (err) {
        alert('Erreur : ' + err.message)
      }
    })
  }
}

customElements.define('workout-form', WorkoutForm)

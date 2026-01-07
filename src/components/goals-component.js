import { goalsService } from '../services/goals-service'

export class GoalsComponent extends HTMLElement {
    connectedCallback() {
        this.render()
        this.loadGoals()
        this.addFormListener()

        document.addEventListener('workout-added', () => this.loadGoals())
        document.addEventListener('workout-deleted', () => this.loadGoals())
    }

    render() {
        this.innerHTML = `
      <div class="card">
        <h3>Objectifs (Cette Semaine)</h3>
        
        <div id="goals-list" style="margin-bottom: 1.5rem;">
            <!-- Goal items will appear here -->
        </div>

        <h4>Nouveau défi</h4>
        <form id="goal-form" style="display: flex; gap: 0.5rem; align-items: flex-end;">
            <div style="flex: 1;">
                <label style="display: block; font-size: 0.8em; margin-bottom: 0.2rem;">Type</label>
                <select id="goal-type">
                    <option value="calories_per_week">Calories / Semaine</option>
                    <option value="sessions_per_week">Séances / Semaine</option>
                </select>
            </div>
            <div style="width: 100px;">
                <label style="display: block; font-size: 0.8em; margin-bottom: 0.2rem;">Cible</label>
                <input type="number" id="goal-target" required min="1" placeholder="3000" />
            </div>
            <button type="submit" class="btn-primary" style="padding: 0.5em 1em;">+</button>
        </form>
      </div>
    `
    }

    async loadGoals() {
        const list = this.querySelector('#goals-list')
        list.innerHTML = 'Chargement...'

        const { data: goals } = await goalsService.getGoals()

        if (!goals || goals.length === 0) {
            list.innerHTML = '<p style="color: var(--color-text-muted); font-size: 0.9em;">Aucun objectif défini.</p>'
            return
        }

        list.innerHTML = ''

        for (const goal of goals) {
            const progress = await goalsService.calculateProgress(goal)
            const typeLabel = goal.type === 'calories_per_week' ? 'Kcal' : 'Séances'

            const item = document.createElement('div')
            item.style.marginBottom = '1rem'
            item.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 0.2rem;">
                <span>${goal.type === 'calories_per_week' ? 'Calories Hebdo' : 'Séances Hebdo'} : ${progress.current} / ${goal.target_value} ${typeLabel}</span>
                <span class="delete-goal" data-id="${goal.id}" style="cursor: pointer; color: var(--color-text-muted);">&times;</span>
            </div>
            <div style="background: #333; height: 10px; border-radius: 5px; overflow: hidden; position: relative;">
                <div style="
                    background: ${progress.isMet ? 'var(--color-success)' : 'var(--color-primary)'}; 
                    width: ${progress.percentage}%; 
                    height: 100%; 
                    transition: width 0.5s ease;
                "></div>
            </div>
            ${!progress.isMet ? '<p style="color: var(--color-warning); font-size: 0.8em; margin-top: 0.2rem;">⚠️ Allez, courage !</p>' : '<p style="color: var(--color-success); font-size: 0.8em; margin-top: 0.2rem;">🎉 Objectif atteint !</p>'}
        `
            list.appendChild(item)
        }

        this.querySelectorAll('.delete-goal').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Supprimer cet objectif ?')) {
                    await goalsService.deleteGoal(e.target.dataset.id)
                    this.loadGoals()
                }
            })
        })
    }

    addFormListener() {
        this.querySelector('#goal-form').addEventListener('submit', async (e) => {
            e.preventDefault()
            const type = this.querySelector('#goal-type').value
            const target = this.querySelector('#goal-target').value

            await goalsService.addGoal({
                type,
                target_value: target
            })

            this.querySelector('#goal-target').value = ''
            this.loadGoals()
        })
    }
}

customElements.define('goals-component', GoalsComponent)

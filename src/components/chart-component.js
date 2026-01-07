import Chart from 'chart.js/auto'
import { workoutService } from '../services/workout-service'

export class ChartComponent extends HTMLElement {
    connectedCallback() {
        this.render()
        this.initChart()

        document.addEventListener('workout-added', () => this.updateChart())
        document.addEventListener('workout-deleted', () => this.updateChart())
    }

    render() {
        this.innerHTML = `
      <div style="position: relative; height: 300px; width: 100%;">
        <canvas id="activityChart"></canvas>
      </div>
    `
    }

    async initChart() {
        const ctx = this.querySelector('#activityChart').getContext('2d')

        // Initial configuration
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    label: 'Nombre de séances',
                    data: [],
                    backgroundColor: [
                        '#e11d48', // Red
                        '#22c55e', // Green
                        '#3b82f6', // Blue
                        '#eab308', // Yellow
                        '#a855f7', // Purple
                        '#06b6d4', // Cyan
                        '#f97316', // Orange
                        '#ec4899'  // Pink
                    ],
                    borderColor: '#111111',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: 'Courier New'
                            }
                        }
                    }
                }
            }
        })

        this.updateChart()
    }

    async updateChart() {
        const { data: workouts } = await workoutService.getWorkouts()

        if (!workouts) return

        // Group workouts by activity type for the pie chart
        const distribution = workouts.reduce((acc, curr) => {
            const type = curr.type.charAt(0).toUpperCase() + curr.type.slice(1)
            acc[type] = (acc[type] || 0) + 1
            return acc
        }, {})

        this.chart.data.labels = Object.keys(distribution)
        this.chart.data.datasets[0].data = Object.values(distribution)
        this.chart.update()
    }
}

customElements.define('chart-component', ChartComponent)

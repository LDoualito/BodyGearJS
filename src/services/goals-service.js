import { supabase } from '../lib/supabase'

export const goalsService = {
    async addGoal(goal) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not logged in')

        const { data, error } = await supabase
            .from('goals')
            .insert({
                user_id: user.id,
                type: goal.type, // 'calories_per_week', 'sessions_per_week'
                target_value: goal.target_value,
                end_date: goal.end_date
            })
            .select()

        return { data, error }
    },

    async getGoals() {
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .order('created_at', { ascending: false })

        return { data, error }
    },

    async deleteGoal(id) {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)

        return { error }
    },

    // Calculate progress for a specific goal
    async calculateProgress(goal) {
        // Determine date range (current week)
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setHours(0, 0, 0, 0)
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)) // Monday

        const { data: { user } } = await supabase.auth.getUser()

        // Fetch workouts for this week
        const { data: workouts, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startOfWeek.toISOString())

        if (error) return { current: 0, percentage: 0 }

        let current = 0
        if (goal.type === 'calories_per_week') {
            current = workouts.reduce((sum, w) => sum + (w.calories || 0), 0)
        } else if (goal.type === 'sessions_per_week') {
            current = workouts.length
        }

        const percentage = Math.min((current / goal.target_value) * 100, 100)

        return {
            current,
            target: goal.target_value,
            percentage,
            isMet: current >= goal.target_value
        }
    }
}

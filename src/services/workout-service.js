import { supabase } from '../lib/supabase'

export const workoutService = {
    // MET values for standard activities
    MET_VALUES: {
        musculation: 5,
        cardio: 10,
        yoga: 3,
        natation: 8,
        marche: 3.5,
        course: 9,
        cyclisme: 7.5
    },

    calculateCalories(activityType, durationHours, weightKg) {
        // MET formula: MET * Weight (kg) * Duration (hours)
        const met = this.MET_VALUES[activityType.toLowerCase()] || 1 // default to 1 if unknown
        return Math.round(met * weightKg * durationHours)
    },

    async addWorkout(workout) {
        // workout object should have: type, duration (mins), date, comment
        // We need to fetch user profile to get weight for calculation
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not logged in')

        const { data: profile } = await supabase
            .from('profiles')
            .select('weight')
            .eq('id', user.id)
            .single()

        const weight = profile?.weight || 70
        const durationHours = workout.duration / 60
        const calories = this.calculateCalories(workout.type, durationHours, weight)

        const { data, error } = await supabase
            .from('workouts')
            .insert({
                user_id: user.id,
                type: workout.type,
                duration: workout.duration,
                date: workout.date,
                comment: workout.comment,
                calories: calories
            })
            .select()

        return { data, error }
    },

    async updateWorkout(id, workout) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not logged in')

        const { data: profile } = await supabase
            .from('profiles')
            .select('weight')
            .eq('id', user.id)
            .single()

        const weight = profile?.weight || 70
        const durationHours = workout.duration / 60
        const calories = this.calculateCalories(workout.type, durationHours, weight)

        const { data, error } = await supabase
            .from('workouts')
            .update({
                type: workout.type,
                duration: workout.duration,
                date: workout.date,
                comment: workout.comment,
                calories: calories
            })
            .eq('id', id)
            .select()

        return { data, error }
    },

    async getWorkouts() {
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('date', { ascending: false })

        return { data, error }
    },

    async deleteWorkout(id) {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', id)

        return { error }
    },

    async updateProfile(profileData) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not logged in')

        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id)

        return { error }
    },

    async getProfile() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        return { data, error }
    }
}

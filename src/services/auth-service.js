import { supabase } from '../lib/supabase'

export const authService = {
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    async signOut() {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    async getUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    }
}

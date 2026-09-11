import { create } from "zustand";
//Crear store en Zustand
export const useFavoritesStore = create((set, get) => ({
    //Estado
    favorites: [],

    //Acciones
    addFavorite: (jobId) => {
        set((state) => ({
            favorites: state.favorites.includes(jobId)
                ? state.favorites
                : [...state.favorites, jobId]
        }))
    },

    removeFavorite: (jobId) => {
        set((state) => ({
            favorites: state.favorites.filter((id) => id !== jobId)
        }))
    },

    clearFavorites: () => {
        set({ favorites: [] })
    },

    isFavorite: (jobId) => {
        return get().favorites.includes(jobId)
    },

    toggleFavorite: (jobId) => {
        const { addFavorite, removeFavorite, isFavorite } = get()
        const isFav = isFavorite(jobId)
        isFav ? removeFavorite(jobId) : addFavorite(jobId)
    },

    countFavorites: () => get().favorites.length
}))

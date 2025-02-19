import { create } from "zustand";

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    setToken: (token) =>
        set(() => ({
            token: token
        })),
    setUser: (data) =>
        set(() => ({
            user: data
        })),
    deleteToken: () =>
        set(() => ({
            user: null,
            token: null
        }))
}));
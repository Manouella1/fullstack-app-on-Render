import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number; username: string } | null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    setUser(user: { id: number; username: string }, token: string) {
      this.user = user;
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});

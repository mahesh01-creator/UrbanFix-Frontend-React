import { create } from 'zustand';
import { authService } from '../services/authService';

const getLoggedInUser = () => {

  const path = window.location.pathname;

  if (path.startsWith('/admin')) {
    return authService.getCurrentUser('ADMIN');
  }

  if (path.startsWith('/worker')) {
    return authService.getCurrentUser('WORKER');
  }

  return authService.getCurrentUser('USER');
};

const checkAuth = () => {

  const path = window.location.pathname;

  if (path.startsWith('/admin')) {
    return !!localStorage.getItem('adminToken');
  }

  if (path.startsWith('/worker')) {
    return !!localStorage.getItem('workerToken');
  }

  return !!localStorage.getItem('userToken');
};
export const useAuthStore = create((set) => ({

  user: getLoggedInUser(),

  isAuthenticated: checkAuth(),

  theme: localStorage.getItem('theme') || 'dark',

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  logout: () => {

    // Remove everything
    localStorage.removeItem('workerToken');
    localStorage.removeItem('workerUser');

    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    localStorage.removeItem('userToken');
    localStorage.removeItem('userUser');

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  toggleTheme: () =>
    set((state) => {

      const newTheme = state.theme === 'dark'
        ? 'light'
        : 'dark';

      localStorage.setItem('theme', newTheme);

      if (newTheme === 'dark') {

        document.documentElement.classList.add('dark');

        document.body.style.background =
          'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%)';

      } else {

        document.documentElement.classList.remove('dark');

        document.body.style.background =
          'linear-gradient(135deg, #f0f0f0 0%, #ffffff 50%, #e0e0e0 100%)';
      }

      return { theme: newTheme };
    }),

  updateUser: (userData) =>
    set((state) => {

      const updatedUser = {
        ...state.user,
        ...userData,
      };

      // Save according to role
      if (updatedUser.role === 'WORKER') {

        localStorage.setItem(
          'workerUser',
          JSON.stringify(updatedUser)
        );

      } else if (updatedUser.role === 'ADMIN') {

        localStorage.setItem(
          'adminUser',
          JSON.stringify(updatedUser)
        );

      } else {

        localStorage.setItem(
          'userUser',
          JSON.stringify(updatedUser)
        );
      }

      return {
        user: updatedUser,
      };
    }),
}));
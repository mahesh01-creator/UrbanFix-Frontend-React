import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/common/Toast';
import { useAuthStore } from './store/authStore';

function App() {
  const { theme } = useAuthStore();

  useEffect(() => {
    // Apply theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%)';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = 'linear-gradient(135deg, #f0f0f0 0%, #ffffff 50%, #e0e0e0 100%)';
    }
  }, [theme]);

  return (
    <>
      <AppRoutes />
      <Toast />
    </>
  );
}

export default App;
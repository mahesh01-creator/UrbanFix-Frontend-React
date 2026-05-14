import api from './api';

export const authService = {

  login: async (credentials) => {

  const response = await api.post('/auth/login', credentials);

  const { token, ...user } = response.data;

  // ✅ STORE ONLY CURRENT ROLE
  if (user.role === 'ADMIN') {

    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));

  } else if (user.role === 'WORKER') {

    localStorage.setItem('workerToken', token);
    localStorage.setItem('workerUser', JSON.stringify(user));

  } else {

    localStorage.setItem('userToken', token);
    localStorage.setItem('userUser', JSON.stringify(user));
  }

  return { token, user };
},

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  registerAdmin: async (adminData) => {
    const response = await api.post('/auth/register/admin', adminData);
    return response.data;
  },

  registerWorker: async (workerData) => {
    const response = await api.post('/auth/register/worker', workerData);
    return response.data;
  },

  logout: () => {

  const path = window.location.pathname;

  if (path.startsWith('/admin')) {

    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

  } else if (path.startsWith('/worker')) {

    localStorage.removeItem('workerToken');
    localStorage.removeItem('workerUser');

  } else {

    localStorage.removeItem('userToken');
    localStorage.removeItem('userUser');
  }

},

  getCurrentUser: (role) => {

    let userStr = null;

    if (role === 'ADMIN') {
      userStr = localStorage.getItem('adminUser');
    }

    else if (role === 'WORKER') {
      userStr = localStorage.getItem('workerUser');
    }

    else {
      userStr = localStorage.getItem('userUser');
    }

    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (role) => {

    if (role === 'ADMIN') {
      return !!localStorage.getItem('adminToken');
    }

    if (role === 'WORKER') {
      return !!localStorage.getItem('workerToken');
    }

    return !!localStorage.getItem('userToken');
  }
};
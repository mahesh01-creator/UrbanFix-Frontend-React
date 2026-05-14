import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, role }) => {

  // Check token
  const isAuthenticated = authService.isAuthenticated(role);

  // Get correct user
  const user = authService.getCurrentUser(role);

  // No login
  if (!isAuthenticated || !user) {

    if (role === 'ADMIN') {
      return <Navigate to="/admin/login" replace />;
    }

    if (role === 'WORKER') {
      return <Navigate to="/worker/login" replace />;
    }

    return <Navigate to="/user/login" replace />;
  }

  // Wrong role
  if (user.role !== role) {

    if (role === 'ADMIN') {
      return <Navigate to="/admin/login" replace />;
    }

    if (role === 'WORKER') {
      return <Navigate to="/worker/login" replace />;
    }

    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
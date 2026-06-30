import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const userRole = (user.userType || user.role || '').toLowerCase();
  const normalizedRequired = requiredRole.toLowerCase();
  
  // Map 'user' to 'operator' since backend returns 'USER' for operators
  const mappedRole = userRole === 'user' ? 'operator' : userRole;
  
  if (requiredRole && mappedRole !== normalizedRequired) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

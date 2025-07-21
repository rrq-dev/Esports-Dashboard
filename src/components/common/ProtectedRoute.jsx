import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, requiredRole }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // User does not have the required role, redirect to their default page
    return <Navigate to={currentUser.role === 'admin' ? '/dashboard' : '/home'} replace />;
  }

  // User is authenticated and has the required role (if specified)
  return children;
}

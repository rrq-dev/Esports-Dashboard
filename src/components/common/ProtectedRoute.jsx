import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Ambil data dari localStorage (simulasi session)
        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // Validasi role admin dan user dari localStorage
        // Mengizinkan akses untuk kedua role
        if (user && (user.role === "admin" || user.role === "user")) {
          setUserData(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Pass userData to children components
  return children;
}

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import { useUser } from '@/context/UserContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, profile } = useUser();
  const location = useLocation(); // Get current location

  if (loading) {
    // Show a loading skeleton or spinner while checking auth state
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
        <Skeleton className="h-16 w-full max-w-4xl rounded-md" />
        <Skeleton className="h-64 w-full max-w-4xl rounded-md" />
        <Skeleton className="h-32 w-full max-w-4xl rounded-md" />
      </div>
    );
  }

  // Redirect to login if not authenticated OR if profile hasn't loaded yet
  if (!user || !profile) {
    // Store the intended location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and profile exists, render the child route/component
  // Using Outlet allows this component to act as a layout wrapper for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

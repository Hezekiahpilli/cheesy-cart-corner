import { PropsWithChildren } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydration } from './useAuthHydration';
import AuthGuardFallback from './AuthGuardFallback';

const RequireAuth = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const hasHydrated = useAuthHydration();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default RequireAuth;

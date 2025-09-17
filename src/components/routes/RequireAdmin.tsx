import { PropsWithChildren, useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydration } from './useAuthHydration';
import AuthGuardFallback from './AuthGuardFallback';

const RequireAdmin = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const hasHydrated = useAuthHydration();
  const { isAuthenticated, isAdmin } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin,
  }));
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isAuthenticated && !isAdmin && !hasNotified.current) {
      toast.error('You do not have access to this page');
      hasNotified.current = true;
    }
  }, [hasHydrated, isAuthenticated, isAdmin]);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default RequireAdmin;

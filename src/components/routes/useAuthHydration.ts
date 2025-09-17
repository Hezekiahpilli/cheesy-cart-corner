import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuthHydration = () => {
  const [hasHydrated, setHasHydrated] = useState(() => {
    const persist = useAuthStore.persist;
    return persist?.hasHydrated?.() ?? true;
  });

  useEffect(() => {
    const persist = useAuthStore.persist;

    if (!persist?.onFinishHydration || !persist?.hasHydrated) {
      return;
    }

    if (persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }

    setHasHydrated(false);

    const unsubscribe = persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return hasHydrated;
};

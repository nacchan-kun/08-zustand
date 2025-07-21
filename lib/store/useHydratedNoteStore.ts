import { useEffect, useState } from 'react';
import { useNoteStore } from './noteStore';

export const useHydratedNoteStore = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useNoteStore();

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window !== 'undefined') {
      useNoteStore.persist.rehydrate();
      setIsHydrated(true);
    }
  }, []);

  return {
    ...store,
    isHydrated,
  };
};

import { useState, useCallback } from 'react';

export const useLiquidTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fromPage, setFromPage] = useState('');
  const [toPage, setToPage] = useState('');
  const [pendingPage, setPendingPage] = useState<string | null>(null);

  const startTransition = useCallback((from: string, to: string, onComplete: () => void) => {
    setFromPage(from);
    setToPage(to);
    setIsTransitioning(true);
    setPendingPage(to);

    // Ultra-fast transition - complete in 600ms total
    const handleTransitionComplete = () => {
      onComplete();
      
      // Clean up after a short delay
      setTimeout(() => {
        setIsTransitioning(false);
        setPendingPage(null);
      }, 100);
    };

    return handleTransitionComplete;
  }, []);

  return {
    isTransitioning,
    fromPage,
    toPage,
    pendingPage,
    startTransition,
  };
};
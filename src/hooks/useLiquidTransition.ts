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

    // Store the completion callback
    const handleTransitionComplete = () => {
      onComplete();
      setIsTransitioning(false);
      setPendingPage(null);
    };

    // Return the completion handler
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
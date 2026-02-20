import { useEffect, useState } from 'react';

export const useMidtrans = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Midtrans script is already loaded
    if (window.snap) {
      setIsLoaded(true);
      return;
    }

    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.async = true;
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
    );


    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Midtrans payment gateway');
      setIsLoaded(true); // Set to true even on error so component can handle it
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if needed
      // Note: Keeping script in DOM is fine as it's usually a singleton
    };
  }, []);

  return { isLoaded, error };
};

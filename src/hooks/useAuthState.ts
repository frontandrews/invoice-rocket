import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged,  } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';	

export const useAuthState = (app: FirebaseApp ) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    // Cleanup function to unsubscribe the real-time listener
    return () => {
      unsubscribe();
    };
  }, [auth]);

  return isAuthenticated;
};
import { useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/authSession';

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    const sync = () => setLoggedIn(isLoggedIn());
    window.addEventListener('auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { loggedIn };
}

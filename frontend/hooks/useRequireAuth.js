// app/hooks/useRequireAuth.js
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function useRequireAuth() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setChecking(false);

      // ✅ Only redirect after auth check is done and no user is logged in
      if (!firebaseUser) {
        router.replace('/profile/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, checking };
}

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  phone?: string;
  license_number?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getMe();
      setUser(data as CurrentUser);
    } catch (err) {
      setError((err as Error)?.message || 'Failed to load user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refresh: fetchUser };
}

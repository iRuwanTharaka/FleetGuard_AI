import { useState, useEffect, useCallback } from 'react';
import managerService from '@/services/managerService';

export function useAnalytics(days = 30) {
  const [healthTrend, setHealthTrend] = useState<any[]>([]);
  const [damageTypes, setDamageTypes] = useState<any[]>([]);
  const [topDamaged, setTopDamaged] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trend, damages, top] = await Promise.all([
        managerService.getHealthTrend(days),
        managerService.getDamageTypes(days),
        managerService.getTopDamaged(days),
      ]);
      setHealthTrend(Array.isArray(trend) ? trend : []);
      setDamageTypes(Array.isArray(damages) ? damages : []);
      setTopDamaged(Array.isArray(top) ? top : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load analytics');
      setHealthTrend([]);
      setDamageTypes([]);
      setTopDamaged([]);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { healthTrend, damageTypes, topDamaged, loading, error, refetch: fetchData };
}

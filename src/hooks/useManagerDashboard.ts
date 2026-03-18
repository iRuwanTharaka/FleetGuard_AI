import { useState, useEffect } from 'react';
import managerService from '@/services/managerService';

export function useManagerDashboard() {
  const [stats, setStats] = useState<{
    total_vehicles: number;
    available: number;
    in_use: number;
    maintenance: number;
    avg_health_score: number;
    today_inspections: number;
    today_new_damages: number;
    pending_reviews: number;
  } | null>(null);
  const [healthDist, setHealthDist] = useState<{
    excellent: { count: number; percentage: number; label: string };
    good: { count: number; percentage: number; label: string };
    poor: { count: number; percentage: number; label: string };
    total: number;
  } | null>(null);
  const [alerts, setAlerts] = useState<Array<{
    inspection_id: number;
    vehicle_number: string;
    damage_count: number;
    health_score: number;
    severity: string;
    time_ago: string;
  }>>([]);
  const [activity, setActivity] = useState<Array<{
    type: string;
    message: string;
    time: string;
    health_score?: number;
    inspection_id?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, healthData, alertsData, activityData] = await Promise.all([
        managerService.getDashboardStats(),
        managerService.getHealthDistribution(),
        managerService.getRecentAlerts(5),
        managerService.getDashboardActivity(),
      ]);
      setStats(statsData);
      setHealthDist(healthData);
      setAlerts(alertsData.alerts || []);
      setActivity(activityData.activities || []);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { stats, healthDist, alerts, activity, loading, error, refresh: fetchAll };
}

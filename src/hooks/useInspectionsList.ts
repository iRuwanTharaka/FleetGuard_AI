import { useState, useCallback } from 'react';
import managerService from '@/services/managerService';

export function useInspectionsList() {
  const [inspections, setInspections] = useState<Array<Record<string, unknown>>>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<Record<string, string | number>>({
    page: 1,
    limit: 20,
    status: 'all',
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(
    async (newFilters: Record<string, string | number> = {}) => {
      const merged = { ...filters, ...newFilters };
      setFilters(merged);
      setLoading(true);
      try {
        const data = await managerService.getInspections(merged);
        setInspections((data.inspections as Array<Record<string, unknown>>) || []);
        setPagination((data.pagination as typeof pagination) || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  return { inspections, pagination, filters, loading, fetch, setFilters };
}

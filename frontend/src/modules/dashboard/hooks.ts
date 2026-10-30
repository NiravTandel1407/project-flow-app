import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000,
  });
};


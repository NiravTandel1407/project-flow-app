import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getSummary,
  });
};

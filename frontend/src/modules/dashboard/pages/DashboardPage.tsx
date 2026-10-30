import React from 'react';
import { useDashboardStats } from '../hooks';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { MetricCard } from './components/MetricCard';
import { DueTaskList } from './components/DueTaskList';
import { StatusBreakdown } from './components/StatusBreakdown';
import { FolderKanban, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your projects and task progress."
    >
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Active Projects"
              value={stats?.active_projects ?? 0}
              icon={FolderKanban}
              variant="indigo"
              change={`${stats?.total_projects ?? 0} total projects`}
            />
            <MetricCard
              label="Completed Tasks"
              value={stats?.completed_tasks ?? 0}
              icon={CheckCircle2}
              variant="emerald"
            />
            <MetricCard
              label="Pending Tasks"
              value={stats?.pending_tasks ?? 0}
              icon={Clock}
              variant="amber"
            />
            <MetricCard
              label="Overdue Tasks"
              value={stats?.overdue_tasks ?? 0}
              icon={AlertTriangle}
              variant="rose"
            />
          </div>

          {/* Charts & Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatusBreakdown
              breakdown={
                stats?.status_breakdown ?? {
                  TODO: 0,
                  IN_PROGRESS: 0,
                  COMPLETED: 0,
                  BLOCKED: 0,
                }
              }
            />
            <DueTaskList tasks={stats?.due_soon_tasks ?? []} />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default DashboardPage;


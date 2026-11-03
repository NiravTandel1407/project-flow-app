import React from 'react';
import { useDashboardSummary } from '../hooks';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { MetricCard } from './components/MetricCard';
import { DueTaskList } from './components/DueTaskList';
import { StatusBreakdown } from './components/StatusBreakdown';
import {
  FolderKanban,
  CalendarCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: summary, isLoading } = useDashboardSummary();

  const projectsByStatus = summary?.projects_by_status ?? {
    not_started: 0,
    in_progress: 0,
    on_hold: 0,
    completed: 0,
    total: 0,
  };

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your projects and task progress."
    >
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B5BFF] border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Total Projects"
              value={summary?.total_projects ?? 0}
              icon={FolderKanban}
              variant="brand"
              change={`${projectsByStatus.in_progress} in progress`}
            />

            <MetricCard
              label="Tasks Due Today"
              value={summary?.tasks_due_today_count ?? 0}
              icon={CalendarCheck}
              variant="amber"
              change="Action required"
            />

            <MetricCard
              label="Due This Week"
              value={summary?.tasks_due_this_week_count ?? 0}
              icon={Calendar}
              variant="indigo"
              change="Upcoming deadlines"
            />

            <MetricCard
              label="Overdue Tasks"
              value={summary?.overdue_tasks_count ?? 0}
              icon={AlertTriangle}
              variant="rose"
              change={
                (summary?.overdue_tasks_count ?? 0) > 0
                  ? 'Attention needed'
                  : 'All caught up'
              }
            />
          </div>

          {/* Charts & Due Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatusBreakdown projectsByStatus={projectsByStatus} />

            <DueTaskList
              tasksDueToday={summary?.tasks_due_today ?? []}
              tasksDueThisWeek={summary?.tasks_due_this_week ?? []}
              overdueTasks={summary?.overdue_tasks ?? []}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default DashboardPage;

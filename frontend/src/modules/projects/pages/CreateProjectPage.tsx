import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateProject } from '../hooks';
import { ProjectStatus, ProjectPriority } from '../types';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Loader2 } from 'lucide-react';

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('not_started');
  const [priority, setPriority] = useState<ProjectPriority>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (startDate && dueDate && dueDate < startDate) {
      setError('Due date must be on or after the start date.');
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        start_date: startDate || undefined,
        due_date: dueDate || undefined,
      });

      navigate(`/projects/${created.id}`);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => d.msg).join(', ')
          : 'Failed to create project. Please try again.'
      );
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-2">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-2 mb-7">
          <div className="text-[14px] text-[#5B6275]">
            <Link
              to="/projects"
              className="text-[#3B5BFF] hover:text-[#2A48E6] font-medium no-underline hover:underline"
            >
              Projects
            </Link>{' '}
            / <span className="text-[#5B6275]">New project</span>
          </div>
          <h1 className="m-0 text-[30px] font-bold text-[#14162B] tracking-tight">
            Create a new project
          </h1>
          <p className="m-0 text-[15px] text-[#5B6275]">
            Set up the basics now. You can add tasks and subtasks afterwards.
          </p>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="mb-6 max-w-[720px] rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Form Container Card */}
        <form
          onSubmit={handleSubmit}
          className="max-w-[720px] bg-white border border-[#E4E6EF] rounded-[14px] p-8 flex flex-col gap-[22px] shadow-sm"
        >
          {/* Project Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Project name <span className="text-[#B42318]">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website redesign"
              required
              className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="desc"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about? (optional)"
              className="w-full box-border h-[112px] p-[12px_14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] resize-none focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="status"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all cursor-pointer"
              >
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="on_hold">On hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="prio"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Priority
              </label>
              <select
                id="prio"
                value={priority}
                onChange={(e) => setPriority(e.target.value as ProjectPriority)}
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all cursor-pointer"
              >
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Start date & Due date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="start"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Start date
              </label>
              <input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="DD / MM / YYYY"
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="due"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Due date
              </label>
              <input
                id="due"
                type="date"
                value={dueDate}
                min={startDate || undefined}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="DD / MM / YYYY"
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
              />
              <div className="mt-[6px] text-[12px] text-[#5B6275]">
                Must be on or after the start date.
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end items-center gap-3 pt-[22px] border-t border-[#E4E6EF]">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="h-[44px] px-[22px] border border-[#CDD1E0] rounded-[10px] bg-white font-semibold text-[15px] text-[#3C4157] hover:bg-[#F5F6FA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="h-[44px] px-[24px] border-0 rounded-[10px] bg-[#3B5BFF] hover:bg-[#2A48E6] font-semibold text-[15px] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              )}
              Create project
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default CreateProjectPage;


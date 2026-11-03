import React, { useState, useEffect } from 'react';
import { Project, ProjectCreate, ProjectUpdate, ProjectStatus, ProjectPriority } from '../../types';
import { useCreateProject, useUpdateProject } from '../../hooks';
import { X, Loader2 } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('not_started');
  const [priority, setPriority] = useState<ProjectPriority>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description || '');
      setStatus(projectToEdit.status);
      setPriority(projectToEdit.priority || 'medium');
      setStartDate(projectToEdit.start_date ? projectToEdit.start_date.split('T')[0] : '');
      setDueDate(projectToEdit.due_date ? projectToEdit.due_date.split('T')[0] : '');
    } else {
      setName('');
      setDescription('');
      setStatus('not_started');
      setPriority('medium');
      setStartDate('');
      setDueDate('');
    }
    setError(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

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
      if (projectToEdit) {
        const payload: ProjectUpdate = {
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          start_date: startDate || undefined,
          due_date: dueDate || undefined,
        };
        await updateMutation.mutateAsync({ id: projectToEdit.id, payload });
      } else {
        const payload: ProjectCreate = {
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          start_date: startDate || undefined,
          due_date: dueDate || undefined,
        };
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => d.msg).join(', ')
          : 'Failed to save project. Please try again.'
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card (Matching Main.dc.html design specs) */}
      <div className="relative w-full max-w-[720px] bg-white border border-[#E4E6EF] rounded-[14px] p-5 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-7 sm:right-7 p-1.5 rounded-lg text-[#5B6275] hover:text-[#14162B] hover:bg-[#F5F6FA] transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-1.5 sm:gap-2 mb-5 sm:mb-6 pr-8">
          <div className="text-[13px] sm:text-[14px] text-[#5B6275] font-medium">
            Projects / {projectToEdit ? 'Edit project' : 'New project'}
          </div>
          <h2 className="m-0 text-2xl sm:text-[30px] font-bold text-[#14162B] tracking-tight leading-tight">
            {projectToEdit ? 'Edit project' : 'Create a new project'}
          </h2>
          <p className="m-0 text-sm sm:text-[15px] text-[#5B6275]">
            Set up the basics now. You can add tasks and subtasks afterwards.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] sm:gap-[22px]">
          {/* Project name */}
          <div>
            <label
              htmlFor="modal-project-name"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Project name <span className="text-[#B42318]">*</span>
            </label>
            <input
              id="modal-project-name"
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
              htmlFor="modal-project-desc"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Description
            </label>
            <textarea
              id="modal-project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about? (optional)"
              className="w-full box-border h-[100px] sm:h-[112px] p-[12px_14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] resize-none focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label
                htmlFor="modal-project-status"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Status
              </label>
              <select
                id="modal-project-status"
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
                htmlFor="modal-project-prio"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Priority
              </label>
              <select
                id="modal-project-prio"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label
                htmlFor="modal-project-start"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Start date
              </label>
              <input
                id="modal-project-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="DD / MM / YYYY"
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="modal-project-due"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Due date
              </label>
              <input
                id="modal-project-due"
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
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 sm:pt-[22px] border-t border-[#E4E6EF]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto h-[44px] px-[22px] border border-[#CDD1E0] rounded-[10px] bg-white font-semibold text-[15px] text-[#3C4157] hover:bg-[#F5F6FA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-[44px] px-[24px] border-0 rounded-[10px] bg-[#3B5BFF] hover:bg-[#2A48E6] font-semibold text-[15px] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              {projectToEdit ? 'Save changes' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;

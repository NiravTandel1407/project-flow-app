import React, { useState, useEffect } from 'react';
import { Project, ProjectCreate, ProjectUpdate, ProjectStatus, ProjectPriority } from '../../types';
import { useCreateProject, useUpdateProject } from '../../hooks';
import { Modal } from '@/shared/components/ui/Modal';
import { Loader2 } from 'lucide-react';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit project' : 'Create a new project'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="modal-name"
            className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
          >
            Project name <span className="text-[#B42318]">*</span>
          </label>
          <input
            id="modal-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website redesign"
            required
            className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="modal-desc"
            className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
          >
            Description
          </label>
          <textarea
            id="modal-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about? (optional)"
            className="w-full box-border h-[100px] p-[12px_14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] resize-none focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="modal-status"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Status
            </label>
            <select
              id="modal-status"
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
              htmlFor="modal-prio"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Priority
            </label>
            <select
              id="modal-prio"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="modal-start"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Start date
            </label>
            <input
              id="modal-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="modal-due"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Due date
            </label>
            <input
              id="modal-due"
              type="date"
              value={dueDate}
              min={startDate || undefined}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
            />
            <div className="mt-1.5 text-[11px] text-[#5B6275]">
              Must be on or after start date.
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#E4E6EF]">
          <button
            type="button"
            onClick={onClose}
            className="h-[44px] px-[20px] border border-[#CDD1E0] rounded-[10px] bg-white font-semibold text-[14px] text-[#3C4157] hover:bg-[#F5F6FA] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[44px] px-[22px] border-0 rounded-[10px] bg-[#3B5BFF] hover:bg-[#2A48E6] font-semibold text-[14px] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
            {projectToEdit ? 'Save changes' : 'Create project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

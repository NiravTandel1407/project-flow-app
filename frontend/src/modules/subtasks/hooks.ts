import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subtasksApi } from './api';
import { SubtaskCreate } from './types';

export const useSubtasks = (taskId: number) => {
  return useQuery({
    queryKey: ['subtasks', taskId],
    queryFn: () => subtasksApi.getSubtasksByTask(taskId),
    enabled: !!taskId,
  });
};

export const useToggleSubtask = (taskId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_done, is_completed }: { id: number; is_done?: boolean; is_completed?: boolean }) => {
      const finalDone = is_done !== undefined ? is_done : !!is_completed;
      return subtasksApi.toggleSubtask(id, finalDone);
    },
    onSuccess: () => {
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-progress'] });
    },
  });
};

export const useCreateSubtask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubtaskCreate) => subtasksApi.createSubtask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-progress'] });
    },
  });
};

export const useDeleteSubtask = (taskId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subtasksApi.deleteSubtask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project-progress'] });
    },
  });
};

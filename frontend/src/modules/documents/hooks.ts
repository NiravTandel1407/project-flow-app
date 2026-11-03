import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from './api';

export const useProjectDocuments = (projectId: number) => {
  return useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentsApi.getDocuments(projectId),
    enabled: !!projectId,
  });
};

export const useUploadDocument = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => documentsApi.uploadDocument(projectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
    },
  });
};

export const useDeleteDocument = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) =>
      documentsApi.deleteDocument(projectId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
    },
  });
};


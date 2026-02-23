import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Professional {
  id: string;
  name: string;
  slug: string;
  professionalHeadline?: string | null;
  aboutMe?: string | null;
  profilePicture?: string | null;
  banner?: string | null;
  location?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  adminId: string;
  admin: {
    id: string;
    email: string;
    name?: string;
  };
  _count?: {
    products?: number;
    inquiries?: number;
  };
}

export interface ProfessionalQueryParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ProfessionalApiResponse {
  professionals: Professional[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// API Functions
const fetchProfessionals = async (params: ProfessionalQueryParams): Promise<ProfessionalApiResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search,
    status: params.status,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response = await fetch(`/api/admin/professionals?${searchParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch professionals');
  }
  return response.json();
};

const createProfessional = async (data: any): Promise<Professional> => {
  const response = await fetch('/api/admin/professionals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create professional');
  }
  return response.json();
};

const updateProfessional = async ({ id, data }: { id: string; data: any }): Promise<Professional> => {
  const response = await fetch(`/api/professionals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update professional');
  }
  return response.json();
};

const deleteProfessional = async (id: string): Promise<void> => {
  const response = await fetch(`/api/professionals/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete professional');
  }
};

const toggleProfessionalStatus = async (id: string, isActive: boolean): Promise<Professional> => {
  const response = await fetch(`/api/professionals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle professional status');
  }
  return response.json();
};

const bulkUpdateProfessionalStatus = async (ids: string[], isActive: boolean): Promise<void> => {
  const response = await fetch('/api/admin/professionals/bulk/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, isActive }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update professional status');
  }
};

const bulkDeleteProfessionals = async (ids: string[]): Promise<void> => {
  const response = await fetch('/api/admin/professionals/bulk/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete professionals');
  }
};

// Query Keys
export const professionalKeys = {
  all: ['professionals'] as const,
  lists: () => [...professionalKeys.all, 'list'] as const,
  list: (params: ProfessionalQueryParams) => [...professionalKeys.lists(), params] as const,
  details: () => [...professionalKeys.all, 'detail'] as const,
  detail: (id: string) => [...professionalKeys.details(), id] as const,
};

// Hooks

/**
 * Hook to fetch professionals with pagination, search, and sorting
 */
export function useProfessionals(params: ProfessionalQueryParams) {
  const { toast } = useToast();

  return useQuery({
    queryKey: professionalKeys.list(params),
    queryFn: () => fetchProfessionals(params),
    staleTime: 10 * 1000, // 10 seconds - reduced for faster updates
    gcTime: 2 * 60 * 1000, // 2 minutes - cache persists for 2 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

/**
 * Hook to fetch a single professional by ID
 */
export function useProfessional(id: string) {
  return useQuery({
    queryKey: professionalKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/professionals/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch professional');
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create a new professional with optimistic update
 */
export function useCreateProfessional() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createProfessional,
    onMutate: async (newProfessional) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: professionalKeys.lists() });

      // Snapshot previous value
      const previousProfessionals = queryClient.getQueriesData<ProfessionalApiResponse>({
        queryKey: professionalKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<ProfessionalApiResponse>({ queryKey: professionalKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          professionals: [newProfessional as unknown as Professional, ...old.professionals],
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems + 1,
          },
        };
      });

      return { previousProfessionals };
    },
    onError: (err, newProfessional, context) => {
      // Rollback on error
      if (context?.previousProfessionals) {
        context.previousProfessionals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to create professional',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Invalidate all professional queries
      queryClient.invalidateQueries({ queryKey: professionalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Professional "${data.name}" created successfully!`,
      });
    },
  });
}

/**
 * Hook to update a professional with optimistic update
 */
export function useUpdateProfessional() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateProfessional,
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: professionalKeys.lists() });
      await queryClient.cancelQueries({ queryKey: professionalKeys.detail(id) });

      // Snapshot previous values
      const previousProfessionals = queryClient.getQueriesData<ProfessionalApiResponse>({
        queryKey: professionalKeys.lists(),
      });
      const previousProfessional = queryClient.getQueryData<Professional>(professionalKeys.detail(id));

      // Optimistically update lists
      queryClient.setQueriesData<ProfessionalApiResponse>({ queryKey: professionalKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          professionals: old.professionals.map((prof) =>
            prof.id === id ? { ...prof, ...data } : prof
          ),
        };
      });

      // Optimistically update detail
      if (previousProfessional) {
        queryClient.setQueryData(professionalKeys.detail(id), (old: Professional | undefined) => {
          if (!old) return old;
          return { ...old, ...data };
        });
      }

      return { previousProfessionals, previousProfessional };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousProfessionals) {
        context.previousProfessionals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousProfessional) {
        queryClient.setQueryData(professionalKeys.detail(id), context.previousProfessional);
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to update professional',
        variant: 'destructive',
      });
    },
    onSettled: (_, __, { id }) => {
      // Invalidate all professional queries
      queryClient.invalidateQueries({ queryKey: professionalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: professionalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Professional "${data.name}" updated successfully!`,
      });
    },
  });
}

/**
 * Hook to delete a professional with optimistic update
 */
export function useDeleteProfessional() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteProfessional,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: professionalKeys.lists() });

      // Snapshot previous value
      const previousProfessionals = queryClient.getQueriesData<ProfessionalApiResponse>({
        queryKey: professionalKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<ProfessionalApiResponse>({ queryKey: professionalKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          professionals: old.professionals.filter((prof) => prof.id !== id),
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems - 1,
          },
        };
      });

      return { previousProfessionals, deletedId: id };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousProfessionals) {
        context.previousProfessionals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete professional',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Invalidate all professional queries
      queryClient.invalidateQueries({ queryKey: professionalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (_, id) => {
      toast({
        title: 'Success',
        description: 'Professional deleted successfully',
      });
    },
  });
}

/**
 * Hook to toggle professional status with optimistic update
 */
export function useToggleProfessionalStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleProfessionalStatus(id, isActive),
    onMutate: async ({ id, isActive }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: professionalKeys.lists() });

      // Snapshot previous value
      const previousProfessionals = queryClient.getQueriesData<ProfessionalApiResponse>({
        queryKey: professionalKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<ProfessionalApiResponse>({ queryKey: professionalKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          professionals: old.professionals.map((prof) =>
            prof.id === id ? { ...prof, isActive } : prof
          ),
        };
      });

      return { previousProfessionals };
    },
    onError: (err, { id, isActive }, context) => {
      // Rollback on error
      if (context?.previousProfessionals) {
        context.previousProfessionals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to toggle status',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Professional ${data.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    },
  });
}

/**
 * Hook for bulk status update
 */
export function useBulkUpdateProfessionalStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) =>
      bulkUpdateProfessionalStatus(ids, isActive),
    onMutate: async ({ ids, isActive }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: professionalKeys.lists() });

      // Snapshot previous value
      const previousProfessionals = queryClient.getQueriesData<ProfessionalApiResponse>({
        queryKey: professionalKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<ProfessionalApiResponse>({ queryKey: professionalKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          professionals: old.professionals.map((prof) =>
            ids.includes(prof.id) ? { ...prof, isActive } : prof
          ),
        };
      });

      return { previousProfessionals };
    },
    onError: (err, { ids, isActive }, context) => {
      // Rollback on error
      if (context?.previousProfessionals) {
        context.previousProfessionals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to update professionals',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (_, { ids, isActive }) => {
      toast({
        title: 'Success',
        description: `${ids.length} professionals ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    },
  });
}

/**
 * Hook for bulk delete
 */
export function useBulkDeleteProfessionals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: bulkDeleteProfessionals,
    onMutate: async (ids) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: professionalKeys.lists() });

      // Snapshot previous value
      const previousProfessionals = queryClient.getQueriesData<ProfessionalApiResponse>({
        queryKey: professionalKeys.lists(),
      });

      // Optimistically update - remove deleted professionals
      queryClient.setQueriesData<ProfessionalApiResponse>({ queryKey: professionalKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          professionals: old.professionals.filter((prof) => !ids.includes(prof.id)),
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems - ids.length,
          },
        };
      });

      return { previousProfessionals };
    },
    onError: (err, ids, context) => {
      // Rollback on error
      if (context?.previousProfessionals) {
        context.previousProfessionals.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete professionals',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: professionalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (_, ids) => {
      toast({
        title: 'Success',
        description: `${ids.length} professionals deleted successfully`,
      });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { invalidateBusinesses, invalidateCategories } from '@/lib/cacheInvalidation';

// Types
export interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  admin: {
    id: string;
    email: string;
    name?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  _count: {
    products: number;
    inquiries: number;
  };
}

export interface BusinessQueryParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface BusinessApiResponse {
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// API Functions
const fetchBusinesses = async (params: BusinessQueryParams): Promise<BusinessApiResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search,
    status: params.status,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const response = await fetch(`/api/admin/businesses?${searchParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch businesses');
  }
  return response.json();
};

const createBusiness = async (data: any): Promise<Business> => {
  const response = await fetch('/api/admin/businesses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create business');
  }
  return response.json();
};

const updateBusiness = async ({ id, data }: { id: string; data: any }): Promise<Business> => {
  const response = await fetch(`/api/admin/businesses/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update business');
  }
  return response.json();
};

const deleteBusiness = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/businesses/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete business');
  }
};

const toggleBusinessStatus = async (id: string, isActive: boolean): Promise<Business> => {
  const response = await fetch(`/api/admin/businesses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle business status');
  }
  return response.json();
};

const bulkUpdateStatus = async (ids: string[], isActive: boolean): Promise<void> => {
  const response = await fetch('/api/admin/businesses/bulk/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, isActive }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update business status');
  }
};

const bulkDelete = async (ids: string[]): Promise<void> => {
  const response = await fetch('/api/admin/businesses/bulk/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete businesses');
  }
};

const duplicateBusiness = async (id: string): Promise<Business> => {
  const response = await fetch(`/api/admin/businesses/${id}/duplicate`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to duplicate business');
  }
  return response.json();
};

// Query Keys
export const businessKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessKeys.all, 'list'] as const,
  list: (params: BusinessQueryParams) => [...businessKeys.lists(), params] as const,
  details: () => [...businessKeys.all, 'detail'] as const,
  detail: (id: string) => [...businessKeys.details(), id] as const,
};

// Hooks

/**
 * Hook to fetch businesses with pagination, search, and sorting
 */
export function useBusinesses(params: BusinessQueryParams) {
  const { toast } = useToast();

  return useQuery({
    queryKey: businessKeys.list(params),
    queryFn: () => fetchBusinesses(params),
    staleTime: 10 * 1000, // 10 seconds - reduced for faster updates
    gcTime: 2 * 60 * 1000, // 2 minutes - cache persists for 2 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

/**
 * Hook to fetch a single business by ID
 */
export function useBusiness(id: string) {
  return useQuery({
    queryKey: businessKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/admin/businesses/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch business');
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create a new business with optimistic update
 */
export function useCreateBusiness() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createBusiness,
    onMutate: async (newBusiness) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessKeys.lists() });

      // Snapshot previous value
      const previousBusinesses = queryClient.getQueriesData<BusinessApiResponse>({
        queryKey: businessKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<BusinessApiResponse>({ queryKey: businessKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          businesses: [newBusiness as unknown as Business, ...old.businesses],
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems + 1,
          },
        };
      });

      return { previousBusinesses };
    },
    onError: (err, newBusiness, context) => {
      // Rollback on error
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to create business',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Invalidate all business queries
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Business "${data.name}" created successfully!`,
      });
    },
  });
}

/**
 * Hook to update a business with optimistic update
 */
export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateBusiness,
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessKeys.lists() });
      await queryClient.cancelQueries({ queryKey: businessKeys.detail(id) });

      // Snapshot previous values
      const previousBusinesses = queryClient.getQueriesData<BusinessApiResponse>({
        queryKey: businessKeys.lists(),
      });
      const previousBusiness = queryClient.getQueryData<Business>(businessKeys.detail(id));

      // Optimistically update lists
      queryClient.setQueriesData<BusinessApiResponse>({ queryKey: businessKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          businesses: old.businesses.map((biz) =>
            biz.id === id ? { ...biz, ...data } : biz
          ),
        };
      });

      // Optimistically update detail
      if (previousBusiness) {
        queryClient.setQueryData(businessKeys.detail(id), (old: Business | undefined) => {
          if (!old) return old;
          return { ...old, ...data };
        });
      }

      return { previousBusinesses, previousBusiness };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousBusiness) {
        queryClient.setQueryData(businessKeys.detail(id), context.previousBusiness);
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to update business',
        variant: 'destructive',
      });
    },
    onSettled: (_, __, { id }) => {
      // Invalidate all business queries
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Business "${data.name}" updated successfully!`,
      });
    },
  });
}

/**
 * Hook to delete a business with optimistic update
 */
export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteBusiness,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessKeys.lists() });

      // Snapshot previous value
      const previousBusinesses = queryClient.getQueriesData<BusinessApiResponse>({
        queryKey: businessKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<BusinessApiResponse>({ queryKey: businessKeys.lists() }, (old) => {
        if (!old) return old;
        const deletedBusiness = old.businesses.find((biz) => biz.id === id);
        return {
          ...old,
          businesses: old.businesses.filter((biz) => biz.id !== id),
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems - 1,
          },
        };
      });

      return { previousBusinesses, deletedId: id };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete business',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Invalidate all business queries
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (_, id) => {
      toast({
        title: 'Success',
        description: 'Business deleted successfully',
      });
    },
  });
}

/**
 * Hook to toggle business status with optimistic update
 */
export function useToggleBusinessStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleBusinessStatus(id, isActive),
    onMutate: async ({ id, isActive }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessKeys.lists() });

      // Snapshot previous value
      const previousBusinesses = queryClient.getQueriesData<BusinessApiResponse>({
        queryKey: businessKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<BusinessApiResponse>({ queryKey: businessKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          businesses: old.businesses.map((biz) =>
            biz.id === id ? { ...biz, isActive } : biz
          ),
        };
      });

      return { previousBusinesses };
    },
    onError: (err, { id, isActive }, context) => {
      // Rollback on error
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
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
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Business ${data.isActive ? 'activated' : 'suspended'} successfully`,
      });
    },
  });
}

/**
 * Hook for bulk status update
 */
export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) =>
      bulkUpdateStatus(ids, isActive),
    onMutate: async ({ ids, isActive }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessKeys.lists() });

      // Snapshot previous value
      const previousBusinesses = queryClient.getQueriesData<BusinessApiResponse>({
        queryKey: businessKeys.lists(),
      });

      // Optimistically update
      queryClient.setQueriesData<BusinessApiResponse>({ queryKey: businessKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          businesses: old.businesses.map((biz) =>
            ids.includes(biz.id) ? { ...biz, isActive } : biz
          ),
        };
      });

      return { previousBusinesses };
    },
    onError: (err, { ids, isActive }, context) => {
      // Rollback on error
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to update businesses',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (_, { ids, isActive }) => {
      toast({
        title: 'Success',
        description: `${ids.length} businesses ${isActive ? 'activated' : 'suspended'} successfully`,
      });
    },
  });
}

/**
 * Hook for bulk delete
 */
export function useBulkDelete() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: bulkDelete,
    onMutate: async (ids) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessKeys.lists() });

      // Snapshot previous value
      const previousBusinesses = queryClient.getQueriesData<BusinessApiResponse>({
        queryKey: businessKeys.lists(),
      });

      // Optimistically update - remove deleted businesses
      queryClient.setQueriesData<BusinessApiResponse>({ queryKey: businessKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          businesses: old.businesses.filter((biz) => !ids.includes(biz.id)),
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems - ids.length,
          },
        };
      });

      return { previousBusinesses };
    },
    onError: (err, ids, context) => {
      // Rollback on error
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete businesses',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onSuccess: (_, ids) => {
      toast({
        title: 'Success',
        description: `${ids.length} businesses deleted successfully`,
      });
    },
  });
}

/**
 * Hook to duplicate a business
 */
export function useDuplicateBusiness() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: duplicateBusiness,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: 'Success',
        description: `Business "${data.name}" duplicated successfully!`,
      });
    },
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message || 'Failed to duplicate business',
        variant: 'destructive',
      });
    },
  });
}

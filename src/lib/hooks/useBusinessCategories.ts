"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Types (reuse from business types)
export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
  };
  children?: {
    id: string;
    name: string;
  }[];
  _count?: {
    products: number;
  };
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string;
}

// API Functions
const fetchBusinessCategories = async (): Promise<BusinessCategory[]> => {
  const response = await fetch('/api/business/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return data.categories || [];
};

const createBusinessCategory = async (data: CategoryFormData): Promise<BusinessCategory> => {
  const response = await fetch('/api/business/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create category');
  }
  const result = await response.json();
  return result.category;
};

const updateBusinessCategory = async ({ id, data }: { id: string; data: CategoryFormData }): Promise<BusinessCategory> => {
  const response = await fetch(`/api/business/categories?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update category');
  }
  const result = await response.json();
  return result.category;
};

const deleteBusinessCategory = async (id: string): Promise<void> => {
  const response = await fetch(`/api/business/categories?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete category');
  }
};

// Query Keys
export const businessCategoryKeys = {
  all: ['business-categories'] as const,
  lists: () => [...businessCategoryKeys.all, 'list'] as const,
  list: () => [...businessCategoryKeys.lists()] as const,
};

// Hooks

/**
 * Hook to fetch business categories
 */
export function useBusinessCategories() {
  return useQuery({
    queryKey: businessCategoryKeys.list(),
    queryFn: fetchBusinessCategories,
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

/**
 * Hook to create a new business category
 */
export function useCreateBusinessCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createBusinessCategory,
    onMutate: async (newCategory) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessCategoryKeys.lists() });

      // Snapshot previous value
      const previousCategories = queryClient.getQueryData<BusinessCategory[]>(businessCategoryKeys.list());

      // Optimistically update
      queryClient.setQueryData<BusinessCategory[]>(businessCategoryKeys.list(), (old) => {
        if (!old) return old;
        const optimisticCategory: BusinessCategory = {
          ...newCategory as BusinessCategory,
          id: `temp-${Date.now()}`,
          slug: newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          _count: { products: 0 },
        };
        return [optimisticCategory, ...old];
      });

      return { previousCategories };
    },
    onError: (err, newCategory, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(businessCategoryKeys.list(), context.previousCategories);
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: businessCategoryKeys.all });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Category "${data.name}" created successfully!`,
      });
    },
  });
}

/**
 * Hook to update a business category
 */
export function useUpdateBusinessCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateBusinessCategory,
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessCategoryKeys.lists() });

      // Snapshot previous values
      const previousCategories = queryClient.getQueryData<BusinessCategory[]>(businessCategoryKeys.list());

      // Optimistically update
      queryClient.setQueryData<BusinessCategory[]>(businessCategoryKeys.list(), (old) => {
        if (!old) return old;
        return old.map((cat) =>
          cat.id === id ? { ...cat, ...data } : cat
        );
      });

      return { previousCategories };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(businessCategoryKeys.list(), context.previousCategories);
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to update category',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: businessCategoryKeys.all });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Category "${data.name}" updated successfully!`,
      });
    },
  });
}

/**
 * Hook to delete a business category
 */
export function useDeleteBusinessCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteBusinessCategory,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: businessCategoryKeys.lists() });

      // Snapshot previous value
      const previousCategories = queryClient.getQueryData<BusinessCategory[]>(businessCategoryKeys.list());

      // Optimistically update
      queryClient.setQueryData<BusinessCategory[]>(businessCategoryKeys.list(), (old) => {
        if (!old) return old;
        return old.filter((cat) => cat.id !== id);
      });

      return { previousCategories, deletedId: id };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(businessCategoryKeys.list(), context.previousCategories);
      }
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete category',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: businessCategoryKeys.all });
    },
    onSuccess: (_, id) => {
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
  });
}
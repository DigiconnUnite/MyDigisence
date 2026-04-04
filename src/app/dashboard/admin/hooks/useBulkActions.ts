import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { requestAdminMutation } from "./adminMutation";

const entityConfig = {
  business: {
    apiCollection: 'businesses',
    labelSingular: 'business',
    labelPlural: 'businesses',
    deactivateVerb: 'suspended',
    deactivateErrorVerb: 'suspend',
  },
  professional: {
    apiCollection: 'professionals',
    labelSingular: 'professional',
    labelPlural: 'professionals',
    deactivateVerb: 'deactivated',
    deactivateErrorVerb: 'deactivate',
  },
} as const;

interface BulkActionsHandlers {
  fetchData: () => Promise<void>;
  fetchEntities: () => Promise<void>;
  setSelectedIds: (ids: Set<string>) => void;
  setLoading: (loading: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

export function useBulkActions(
  entityType: 'business' | 'professional',
  selectedIds: Set<string>,
  handlers: BulkActionsHandlers
) {
  const { toast } = useToast();
  const config = entityConfig[entityType];

  const handleBulkActivate = useCallback(async () => {
    if (selectedIds.size === 0) return;
    handlers.setLoading(true);
    const result = await requestAdminMutation(
      `/api/admin/${config.apiCollection}/bulk/status`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), isActive: true }),
      },
      'Bulk activation failed'
    );

    if (result.ok) {
      toast({ title: 'Success', description: `${selectedIds.size} ${config.labelPlural} activated` });
      handlers.setSelectedIds(new Set());
      await Promise.all([handlers.fetchEntities(), handlers.fetchData()]);
    } else {
      toast({ title: 'Error', description: `Failed to activate ${config.labelPlural}`, variant: 'destructive' });
    }

    handlers.setLoading(false);
  }, [selectedIds, handlers, toast, config.apiCollection, config.labelPlural]);

  const handleBulkDeactivate = useCallback(async () => {
    if (selectedIds.size === 0) return;
    handlers.setLoading(true);
    const result = await requestAdminMutation(
      `/api/admin/${config.apiCollection}/bulk/status`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), isActive: false }),
      },
      'Bulk deactivation failed'
    );

    if (result.ok) {
      toast({ title: 'Success', description: `${selectedIds.size} ${config.labelPlural} ${config.deactivateVerb}` });
      handlers.setSelectedIds(new Set());
      await Promise.all([handlers.fetchEntities(), handlers.fetchData()]);
    } else {
      toast({ title: 'Error', description: `Failed to ${config.deactivateErrorVerb} ${config.labelPlural}`, variant: 'destructive' });
    }

    handlers.setLoading(false);
  }, [selectedIds, handlers, toast, config.apiCollection, config.labelPlural, config.deactivateVerb, config.deactivateErrorVerb]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    handlers.setShowDeleteDialog(true);
  }, [selectedIds, handlers]);

  const confirmBulkDelete = useCallback(async () => {
    handlers.setLoading(true);
    handlers.setShowDeleteDialog(false);
    const result = await requestAdminMutation(
      `/api/admin/${config.apiCollection}/bulk/delete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      },
      'Bulk deletion failed'
    );

    if (result.ok) {
      toast({ title: 'Success', description: `${selectedIds.size} ${config.labelPlural} deleted` });
      handlers.setSelectedIds(new Set());
      await Promise.all([handlers.fetchEntities(), handlers.fetchData()]);
    } else {
      toast({ title: 'Error', description: `Failed to delete ${config.labelPlural}`, variant: 'destructive' });
    }

    handlers.setLoading(false);
  }, [selectedIds, handlers, toast, config.apiCollection, config.labelPlural]);

  return {
    handleBulkActivate,
    handleBulkDeactivate,
    handleBulkDelete,
    confirmBulkDelete,
  };
}
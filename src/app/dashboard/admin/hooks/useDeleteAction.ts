import { useCallback, useState } from "react";
import { requestAdminMutation } from "./adminMutation";

interface UseDeleteActionOptions<T> {
  buildUrl: (item: T) => string;
  onSuccess: (item: T) => Promise<void> | void;
  onError?: (message: string) => void;
  defaultErrorMessage?: string;
}

export function useDeleteAction<T>({
  buildUrl,
  onSuccess,
  onError,
  defaultErrorMessage = "Failed to delete item",
}: UseDeleteActionOptions<T>) {
  const [deleting, setDeleting] = useState(false);

  const runDelete = useCallback(
    async (item: T) => {
      setDeleting(true);
      const result = await requestAdminMutation(buildUrl(item), { method: "DELETE" }, defaultErrorMessage);

      if (result.ok) {
        await onSuccess(item);
      } else if (onError) {
        onError(result.error || defaultErrorMessage);
      }

      setDeleting(false);
      return result;
    },
    [buildUrl, defaultErrorMessage, onError, onSuccess]
  );

  return {
    deleting,
    runDelete,
  };
}

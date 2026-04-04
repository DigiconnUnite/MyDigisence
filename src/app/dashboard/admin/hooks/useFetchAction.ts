import { useCallback, useState } from "react";
import { requestAdminMutation } from "./adminMutation";

interface UseFetchActionOptions<TPayload, TResult> {
  url: string | ((payload: TPayload) => string);
  method?: "POST" | "PUT" | "PATCH";
  defaultErrorMessage?: string;
  onSuccess?: (result: TResult | null, payload: TPayload) => Promise<void> | void;
  onError?: (message: string, payload: TPayload) => void;
}

export function useFetchAction<TPayload = any, TResult = any>({
  url,
  method = "POST",
  defaultErrorMessage = "Request failed",
  onSuccess,
  onError,
}: UseFetchActionOptions<TPayload, TResult>) {
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (payload: TPayload) => {
      setLoading(true);
      const endpoint = typeof url === "function" ? url(payload) : url;

      const result = await requestAdminMutation<TResult>(
        endpoint,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        defaultErrorMessage
      );

      if (result.ok) {
        await onSuccess?.(result.data, payload);
      } else {
        onError?.(result.error || defaultErrorMessage, payload);
      }

      setLoading(false);
      return result;
    },
    [defaultErrorMessage, method, onError, onSuccess, url]
  );

  return {
    loading,
    run,
  };
}

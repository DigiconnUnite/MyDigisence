import { useCallback } from "react";

export function useFormHandler<T = Record<string, FormDataEntryValue | null>>(
  onSubmit: (payload: T, form: HTMLFormElement, event: React.FormEvent<HTMLFormElement>) => void | Promise<void>,
  mapFormData?: (formData: FormData) => T
) {
  return useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload = mapFormData
        ? mapFormData(formData)
        : (Object.fromEntries(formData.entries()) as T);

      await onSubmit(payload, form, event);
    },
    [mapFormData, onSubmit]
  );
}

export type AdminMutationResult<T> =
  | { ok: true; data: T | null }
  | { ok: false; error: string };

export async function requestAdminMutation<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  defaultError = "Request failed"
): Promise<AdminMutationResult<T>> {
  try {
    const response = await fetch(input, init);
    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (response.ok) {
      return { ok: true, data: payload as T | null };
    }

    return {
      ok: false,
      error: typeof payload?.error === "string" ? payload.error : defaultError,
    };
  } catch {
    return { ok: false, error: defaultError };
  }
}

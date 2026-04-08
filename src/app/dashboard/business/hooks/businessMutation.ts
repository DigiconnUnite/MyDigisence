import type { ApiErrorResponse } from "../types";

export type BusinessMutationResult<T> =
  | { ok: true; data: T | null }
  | { ok: false; error: string };

async function parseMutationPayload<T>(response: Response): Promise<T | ApiErrorResponse | null> {
  try {
    return (await response.json()) as T | ApiErrorResponse;
  } catch {
    return null;
  }
}

export async function requestBusinessMutation<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  defaultError = "Request failed",
): Promise<BusinessMutationResult<T>> {
  try {
    const response = await fetch(input, {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    const payload = await parseMutationPayload<T>(response);

    if (response.ok) {
      return { ok: true, data: (payload as T | null) ?? null };
    }

    const errorPayload = payload as ApiErrorResponse | null;
    return {
      ok: false,
      error: typeof errorPayload?.error === "string" ? errorPayload.error : defaultError,
    };
  } catch {
    return { ok: false, error: defaultError };
  }
}

export async function fetchBusinessJsonOrNull<T>(
  url: string,
  signal: AbortSignal,
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal,
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchBusinessList<T>(
  url: string,
  signal: AbortSignal,
): Promise<T | null> {
  const response = await fetch(url, {
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

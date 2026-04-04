export const fetchAdminList = async <T,>(url: string, signal: AbortSignal): Promise<T | null> => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as T;
};

export const fetchAdminJsonOrNull = async (url: string, signal: AbortSignal) => {
  try {
    const response = await fetch(url, { signal, cache: "no-store" });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
};

export const exportAdminCsv = async (
  endpoint: string,
  filenamePrefix: string,
  onSuccess: (description: string) => void,
  onError: (description: string) => void
) => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      onError(`Failed to export ${filenamePrefix}`);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${filenamePrefix}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
    onSuccess(`${filenamePrefix[0].toUpperCase()}${filenamePrefix.slice(1)} exported successfully`);
  } catch {
    onError(`Failed to export ${filenamePrefix}`);
  }
};
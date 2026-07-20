export function toEventFormData(
  eventData: Record<string, string | File | Blob | undefined>,
): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(eventData)) {
    if (value === undefined || value === null) continue;
    formData.append(key, value);
  }
  return formData;
}

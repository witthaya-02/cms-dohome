// src/lib/utils/extract-object.ts
export function extractValue(obj: Record<string, unknown>): Record<string, any> {
  const result: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  });

  return result;
}

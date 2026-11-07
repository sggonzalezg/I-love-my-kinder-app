// Without generated database types supabase-js guesses embedded rows as arrays; the select strings define the real shape.
export function throwOnError<T>(result: { data: unknown; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

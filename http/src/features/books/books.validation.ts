import { z } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

const idSchema = z.object({
  id: z.string().regex(/^\d+$/, "id must be a number"),
});

export function idValidator(
  id: string | undefined
): ValidationResult<{ id: string }> {
  const result = idSchema.safeParse({ id });

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map(
    (issue) => `${issue.path.join(".")}: ${issue.message}`
  );

  return { success: false, errors };
}

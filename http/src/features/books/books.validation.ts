import { z } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

// Id validator
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

// create book validator
const bookCreationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required and cannot be empty" })
    .max(255, { message: "Title cannot exceed 255 characters" }),

  author: z
    .string()
    .trim()
    .min(1, { message: "Author cannot be empty when provided" })
    .max(100, { message: "Author name cannot exceed 100 characters" })
    .optional(),

  category: z
    .string()
    .trim()
    .min(1, { message: "Category cannot be empty when provided" })
    .max(50, { message: "Category cannot exceed 50 characters" })
    .optional(),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: "Each tag must be a non-empty string" })
        .max(30, { message: "Tag cannot exceed 30 characters" })
    )
    .min(1, { message: "Tags array cannot be empty when provided" })
    .max(10, { message: "Cannot have more than 10 tags" })
    .refine((tags) => new Set(tags).size === tags.length, {
      message: "Tags must be unique",
    })
    .optional(),
});

export function validateBookCreation(
  body: unknown
): ValidationResult<z.infer<typeof bookCreationSchema>> {
  const result = bookCreationSchema.safeParse(body);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });

  return { success: false, errors };
}

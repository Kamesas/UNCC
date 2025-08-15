import { z } from "zod";

export const idSchema = z.object({
  id: z.string().regex(/^\d+$/, "id must be a number"),
});

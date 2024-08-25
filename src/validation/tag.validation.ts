import { z } from "zod";

const tagFilterValidation = z
  .object({
    category: z
      .string({ invalid_type_error: "Category slug must be a string." })
      .max(50, { message: "Category slug too long. Please enter no more than 50." })
      .transform((val) => val.toLowerCase())
      .optional(),
  })
  .partial()
  .strip();

export { tagFilterValidation };

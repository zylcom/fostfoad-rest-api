import { z } from "zod";

const review = z
  .object({
    description: z.string(),
    rating: z
      .number({ invalid_type_error: "Rating must be a number.", required_error: "Rating is required." })
      .min(1, { message: "Your rating must be at least 1." })
      .max(5, { message: "Your rating is to big. Please enter no more than 5." }),
    productSlug: z
      .string({ invalid_type_error: "Product slug must be a string.", required_error: "Product slug is required." })
      .min(1, "Product slug is not allowed to be empty."),
    username: z
      .string({ invalid_type_error: "Username must be a string.", required_error: "Username is required." })
      .min(1, "Username is not allowed to be empty."),
  })
  .partial()
  .strip();

const createReviewValidation = review.required({ rating: true, productSlug: true, username: true });

const updateReviewValidation = review.required({ rating: true, productSlug: true, username: true });

export { createReviewValidation, updateReviewValidation };

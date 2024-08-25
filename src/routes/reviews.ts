import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createReviewValidation, updateReviewValidation } from "../validation/review.validation";
import { HTTPException } from "hono/http-exception";
import { parseError } from "../lib/utils";
import { prisma } from "../database/client";
import { Prisma } from "@prisma/client";

const reviewsRoutes = new Hono();

reviewsRoutes.post(
  "/",
  zValidator("json", createReviewValidation, async (result, c) => {
    if (!result.success) throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });

    const { rating, description, productSlug } = result.data;
    const user = c.get("user");

    const countReview = await prisma.review.count({
      where: {
        AND: [{ productSlug }, { username: user.username }],
      },
    });

    if (countReview !== 0) throw new HTTPException(409, { message: "Review already exist." });

    const review = await prisma.review
      .create({
        data: {
          rating,
          description,
          user: { connect: { username: user.username } },
          product: { connect: { slug: productSlug } },
        },
      })
      .catch(() => {
        throw new HTTPException(404, { message: "Product not found." });
      });

    await prisma.product
      .findUniqueOrThrow({
        where: { slug: productSlug },
        include: { reviews: { select: { rating: true } } },
      })
      .then((product) => {
        const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        return prisma.product.update({ where: { slug: product.slug }, data: { averageRating } });
      });

    return c.json({ status: "success", code: 201, data: { review } }, 201);
  }),
);
reviewsRoutes.put(
  "/",
  zValidator("json", updateReviewValidation, async (result, c) => {
    if (!result.success) throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });

    const { description, rating, productSlug } = result.data;
    const user = c.get("user");

    const review = await prisma.review
      .update({
        where: { review: { productSlug, username: user.username } },
        data: {
          description,
          rating,
        },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          throw new HTTPException(404, { message: e.meta?.cause as string });
        }

        throw new HTTPException(404, { message: (e as Error).message });
      });

    return c.json({ status: "success", code: 200, data: { review } });
  }),
);

export default reviewsRoutes;

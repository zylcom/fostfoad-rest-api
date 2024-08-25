import { Hono } from "hono";
import { prisma } from "../database/client";
import { zValidator } from "@hono/zod-validator";
import { tagFilterValidation } from "../validation/tag.validation";
import { HTTPException } from "hono/http-exception";
import { parseError } from "../lib/utils";

const tagsRoutes = new Hono();

tagsRoutes.get(
  "/",
  zValidator("query", tagFilterValidation, async (result, c) => {
    if (!result.success) throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });

    const { category } = result.data;

    console.log(category);

    const tags = await prisma.tag.findMany({ where: { products: { some: { categorySlug: { equals: category } } } } });

    return c.json({ status: "success", code: 200, data: { tags } });
  }),
);

export default tagsRoutes;

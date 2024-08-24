import { Hono } from "hono";

const reviewsRoutes = new Hono();

reviewsRoutes.post("/:productSlug", (c) => c.text(c.req.param("productSlug")));
reviewsRoutes.put("/:productSlug", (c) => c.text(c.req.param("productSlug")));

export default reviewsRoutes ;

import { Hono } from "hono";

const likesRoutes = new Hono();

likesRoutes.put("/:productSlug", (c) => c.text(c.req.param("productSlug")));

export  default likesRoutes ;

import { Hono } from "hono";

const productsRoutes = new Hono();

productsRoutes.get("/", async (c) => {
  return c.json({});
});
productsRoutes.get("/search", async (c) => {
  return c.json({});
});
productsRoutes.get("/:slug", async (c) => {
  return c.json({});
});

export default productsRoutes ;

import { Hono } from "hono";
import cartsService from "../services/carts.service.js";
const cartsRoutes = new Hono();
cartsRoutes.get("/", async (c) => {
    const payload = c.get("jwtPayload");
    const cart = await cartsService.getCart(payload.username);
    return c.json({ status: "success", code: 200, data: { cart } });
});
cartsRoutes.delete("/", (c) => c.text("Cart cleared"));
export { cartsRoutes };

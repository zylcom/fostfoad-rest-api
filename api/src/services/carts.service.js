import { prisma } from "../database/client.js";
import { HTTPException } from "hono/http-exception";
async function getCart(username) {
    const cart = await prisma.cart.findUnique({ where: { username }, include: { cartItems: { include: { product: true } } } });
    if (!cart)
        throw new HTTPException(404, { cause: { status: "error", code: 404, data: { cart: null, message: "Cart not found." } } });
    return cart;
}
export default { getCart };

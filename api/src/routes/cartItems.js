import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { findItemValidation, upsertCartItemValidation } from "../validation/cartItems.validation.js";
import { HTTPException } from "hono/http-exception";
import { calculateTotalPrice, parseError } from "../lib/utils.js";
import { prisma } from "../database/client.js";
const cartItemsRoutes = new Hono();
cartItemsRoutes.get("/", (c) => c.text("Cart items"));
cartItemsRoutes.put("/", zValidator("json", upsertCartItemValidation, async (result, c) => {
    if (!result.success)
        throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    const { cartId, productSlug, quantity } = result.data;
    const productCount = await prisma.product.count({ where: { slug: productSlug } });
    if (productCount !== 1)
        throw new HTTPException(404, { message: "Product not found." });
    const item = await prisma.cartItem
        .upsert({
        update: { cart: { connect: { id: cartId } }, product: { connect: { slug: productSlug } }, quantity },
        create: { cart: { connect: { id: cartId } }, product: { connect: { slug: productSlug } }, quantity },
        where: { item: { productSlug, cartId } },
    })
        .then(async (result) => {
        const items = await prisma.cartItem.findMany({ where: { cartId }, include: { product: true } });
        const totalPrice = calculateTotalPrice(items);
        await prisma.cart.update({
            where: { id: cartId },
            data: {
                totalPrice,
            },
        });
        return result;
    });
    console.log(item);
    return c.json({ status: "success", code: 200, data: { item } }, 200);
}));
cartItemsRoutes.get("/:productSlug", zValidator("param", findItemValidation, async (result, c) => {
    if (!result.success)
        throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    const { productSlug } = result.data;
    const user = c.get("user");
    const item = await prisma.cartItem.findUnique({ where: { item: { cartId: user.cart.id, productSlug } }, include: { product: true } });
    return c.json({ status: "success", code: 200, data: { item } }, 200);
}));
cartItemsRoutes.delete("/:productSlug", (c) => c.text(c.req.param("productSlug")));
export { cartItemsRoutes };

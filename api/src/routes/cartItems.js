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
    const { productSlug, quantity } = result.data;
    const user = c.get("user");
    const item = await prisma.cartItem
        .upsert({
        update: { cart: { connect: { id: user.cart.id } }, product: { connect: { slug: productSlug } }, quantity },
        create: { cart: { connect: { id: user.cart.id } }, product: { connect: { slug: productSlug } }, quantity },
        where: { item: { productSlug, cartId: user.cart.id } },
    })
        .then(async (result) => {
        const items = await prisma.cartItem.findMany({ where: { cartId: user.cart.id }, include: { product: true } });
        const totalPrice = calculateTotalPrice(items);
        await prisma.cart.update({
            where: { id: user.cart.id },
            data: {
                totalPrice,
            },
        });
        return result;
    })
        .catch(() => {
        throw new HTTPException(404, { message: "Product not found." });
    });
    return c.json({ status: "success", code: 200, data: { item } }, 200);
}));
cartItemsRoutes.get("/:productSlug", zValidator("param", findItemValidation, async (result, c) => {
    if (!result.success)
        throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    const { productSlug } = result.data;
    const user = c.get("user");
    const item = await prisma.cartItem.findUnique({ where: { item: { cartId: user.cart.id, productSlug } }, include: { product: true } });
    if (!item)
        throw new HTTPException(404, { message: "Product not found." });
    return c.json({ status: "success", code: 200, data: { item } }, 200);
}));
cartItemsRoutes.delete("/:productSlug", zValidator("param", findItemValidation, async (result, c) => {
    if (!result.success)
        throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    const { productSlug } = result.data;
    const user = c.get("user");
    await prisma.cartItem
        .delete({ where: { item: { cartId: user.cart.id, productSlug } } })
        .then(async () => {
        const items = await prisma.cartItem.findMany({ where: { cartId: user.cart.id }, include: { product: true } });
        const totalPrice = calculateTotalPrice(items);
        await prisma.cart.update({
            where: { id: user.cart.id },
            data: {
                totalPrice,
            },
        });
    })
        .catch(() => {
        throw new HTTPException(404, { message: "Product not found." });
    });
    return c.json({ status: "success", code: 200, data: { message: "Item deleted." } }, 200);
}));
export default cartItemsRoutes;

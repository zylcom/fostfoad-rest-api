//import { HTTPException } from "hono/http-exception";
//import { prisma } from "../database/client";
//
//async function upsertItem({ slug, quantity, cartId }: { slug: string; quantity: number; cartId: string | number }) {
//  const productCount = await prisma.product.count({ where: { slug } });
//
//  if (productCount !== 1) throw new HTTPException(404, { message: "Product not found." });
//
//  const item = await prisma.cartItem.cartItem
//    .upsert({
//      update: { cart: { connect: { id: request.cartId } }, product: { connect: { slug: request.productSlug } }, quantity: request.quantity },
//      create: { cart: { connect: { id: request.cartId } }, product: { connect: { slug: request.productSlug } }, quantity: request.quantity },
//      where: { item: { productSlug: request.productSlug, cartId: request.cartId } },
//      include: { product: true },
//    })
//    .then(async (result) => {
//      const items = await prismaClient.cartItem.findMany({ where: { cartId: request.cartId }, include: { product: true } });
//      const totalPrice = calculateTotalPrice(items);
//
//      await prismaClient.cart.update({
//        where: { id: request.cartId },
//        data: {
//          totalPrice,
//        },
//      });
//
//      return result;
//    });
//}
//
//export default { upsertItem };

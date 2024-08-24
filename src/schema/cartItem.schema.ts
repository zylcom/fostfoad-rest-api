import { Prisma } from "@prisma/client";
import { z } from "zod";

export const CartItemSchema = z.object({
  quantity: z.number(),
  product: z.object({
    name: z.string(),
    price: z.number(),
  }),
});

export type CartItem = Prisma.CartItemGetPayload<{ include: { product: true } }>;

import { z } from "zod";
const cartIdValidation = z.coerce
    .number({ invalid_type_error: "Cart id must be number!", required_error: "Cart id is required!" })
    .positive({ message: "Cart id must be positive number!" });
const getCartItemValidation = z.string({ required_error: "Username is required!" }).max(100).min(1, "Username is not allowed to be empty!");
const findItemValidation = z
    .object({
    //cartId: cartIdValidation,
    productSlug: z.string({ required_error: "Product slug is required!" }).min(1, "Product slug is not allowed to be empty!"),
})
    .strict();
const upsertCartItemValidation = z
    .object({
    cartId: cartIdValidation,
    productSlug: z.string({ required_error: "Product slug is required!" }).min(1, "Product slug is not allowed to be empty!"),
    quantity: z.coerce
        .number({ invalid_type_error: "Quantity must be number!" })
        .int({ message: "Quantity must be an integer!" })
        .min(1)
        .positive({ message: "Quantity must be positive number!" }),
})
    .strict();
const deleteItemValidation = findItemValidation;
export { getCartItemValidation, findItemValidation, upsertCartItemValidation, deleteItemValidation };

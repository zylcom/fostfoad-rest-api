import { ZodError } from "zod";
import { CartItem } from "../schema/cartItem.schema";
import { prisma } from "../database/client";
import { faker } from "@faker-js/faker";

const generatedId: number[] = [];

export function parseError(error: ZodError) {
  let errors: Record<string, string> = {};

  console.log(error.issues);

  error.issues.forEach((err) => {
    errors = { ...errors, [err.path[0]]: err.message };
  });

  return errors;
}

export function calculateTotalPrice(items: CartItem[]) {
  return items.reduce((acc, item) => {
    return acc + item.quantity * item.product.price;
  }, 0);
}

export function generateUniqueRandomId(max: number) {
  let randomId;

  // Keep generating random id until we find one that is unique
  do {
    randomId = Math.floor(Math.random() * max) + 1; // Generate a random id between 1 and 100
  } while (generatedId.includes(randomId)); // Check if the id has been generated before

  // Add the id to the generated id array
  generatedId.push(randomId);

  return randomId;
}

export async function randomizeLikeProduct(max: number) {
  const data = [];

  for (let index = 0; index < Math.floor(Math.random() * max); index++) {
    const user = await prisma.user.findUnique({ where: { id: generateUniqueRandomId(max) } });

    if (user) data.push({ user: { connect: { username: user.username } } });
  }

  generatedId.length = 0;

  return data;
}

export async function randomizeReviewProduct(max: number) {
  const data = [];

  for (let index = 0; index < Math.floor(Math.random() * max); index++) {
    const user = await prisma.user.findUnique({ where: { id: generateUniqueRandomId(max) } });

    if (user) {
      data.push({
        description: faker.lorem.sentence(),
        rating: Math.floor(Math.random() * 5) + 1,
        user: { connect: { username: user.username } },
      });
    }
  }

  generatedId.length = 0;

  return data;
}

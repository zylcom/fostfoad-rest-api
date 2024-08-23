import { PrismaClient } from "@prisma/client";
import { logger } from "hono/logger";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("error", (e) => {
  logger(() => {
    console.log(e);
  });
});

prisma.$on("warn", (e) => {
  logger(() => {
    console.log(e);
  });
});

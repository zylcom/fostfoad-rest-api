import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import usersRoutes from "./src/routes/users";
import cartsRoutes from "./src/routes/carts";
import authRoutes from "./src/routes/auth";
import cartItemsRoutes from "./src/routes/cartItems";
import reviewsRoutes from "./src/routes/reviews";
import likesRoutes from "./src/routes/likes";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "./src/middlewares";
import { Prisma } from "@prisma/client";
import tagsRoutes from "./src/routes/tags";

declare module "hono" {
  interface ContextVariableMap {
    user: Prisma.UserGetPayload<{ select: { id: true; username: true; cart: true; profile: true } }>;
  }
}

const port = Number(process.env.PORT) || 3000;
const app = new Hono<{
  Variables: { jwtPayload: { username: string } };
}>();

app.use(logger());
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", authRoutes);
app.route("/tags", tagsRoutes);

app.use((c, next) => jwt({ secret: process.env.JWT_SECRET_KEY! })(c, next));
app.use(authMiddleware);

app.route("/users", usersRoutes);
app.route("/carts", cartsRoutes);
app.route("/carts/items", cartItemsRoutes);
app.route("/reviews", reviewsRoutes);
app.route("/likes", likesRoutes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    //console.log(c.error?.message, err.message);

    return c.json(
      {
        status: "error",
        code: err.status,
        errors: {
          message: err.message,
          ...(err.cause as Object),
        },
      },
      err.status,
    );
  }

  return c.json(err);
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

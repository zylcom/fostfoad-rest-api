import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import usersRoutes from "./routes/users";
import cartsRoutes from "./routes/carts";
import authRoutes from "./routes/auth";
import cartItemsRoutes from "./routes/cartItems";
import reviewsRoutes from "./routes/reviews";
import likesRoutes from "./routes/likes";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "./middlewares";
import { Prisma } from "@prisma/client";
import tagsRoutes from "./routes/tags";

declare module "hono" {
  interface ContextVariableMap {
    user: Prisma.UserGetPayload<{ select: { id: true; username: true; cart: true; profile: true } }>;
  }
}

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
  console.log(c.error?.message, err.message);

  if (err instanceof HTTPException) {
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

  return c.json({ status: "error", code: 500, data: { message: err.message } });
});

export default app;

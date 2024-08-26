import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import usersRoutes from "./routes/users.js";
import cartsRoutes from "./routes/carts.js";
import authRoutes from "./routes/auth.js";
import cartItemsRoutes from "./routes/cartItems.js";
import reviewsRoutes from "./routes/reviews.js";
import likesRoutes from "./routes/likes.js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "./middlewares/index.js";
import tagsRoutes from "./routes/tags.js";
const app = new Hono();
app.use(logger());
app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/auth", authRoutes);
app.route("/tags", tagsRoutes);
app.use((c, next) => jwt({ secret: process.env.JWT_SECRET_KEY })(c, next));
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
          ...err.cause,
        },
      },
      err.status,
    );
  }
  return c.json(err);
});
export default app;

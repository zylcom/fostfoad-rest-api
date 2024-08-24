import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import usersRoutes from "../src/routes/users.js";
import cartsRoutes from "../src/routes/carts.js";
import authRoutes from "../src/routes/auth.js";
import cartItemsRoutes from "../src/routes/cartItems.js";
import reviewsRoutes from "../src/routes/reviews.js";
import likesRoutes from "../src/routes/likes.js";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../src/middlewares/index.js";
const port = Number(process.env.PORT) || 3000;
const app = new Hono();
app.use(logger());
app.get("/", (c) => {
    return c.text("Hello Hono!");
});
app.route("/auth", authRoutes);
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
        return c.json({
            status: "error",
            code: err.status,
            errors: {
                message: err.message,
                ...err.cause,
            },
        }, err.status);
    }
    return c.json(err);
});
console.log(`Server is running on port ${port}`);
serve({
    fetch: app.fetch,
    port,
});

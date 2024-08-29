import { createMiddleware } from "hono/factory";
import { prisma } from "../database/client.js";
import { HTTPException } from "hono/http-exception";
export const authMiddleware = createMiddleware(async (c, next) => {
    try {
        const payload = c.get("jwtPayload");
        const user = await prisma.user.findUnique({ where: { username: payload.username }, select: { id: true, username: true, cart: true, profile: true } });
        if (!user)
            throw new HTTPException(401, { message: "Unauthorized" });
        c.set("user", user);
        await next();
    }
    catch (error) {
        if (error instanceof HTTPException)
            throw new HTTPException(401, { message: "Unauthorized" });
        throw new Error("Internal server error");
    }
});

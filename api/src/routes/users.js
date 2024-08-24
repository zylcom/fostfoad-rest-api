import { Hono } from "hono";
import { prisma } from "../database/client.js";
const usersRoutes = new Hono();
usersRoutes.get("/current", async (c) => {
    const payload = c.get("jwtPayload");
    const user = await prisma.user.findUnique({
        where: { username: payload.username },
        select: { id: true, username: true, profile: { select: { name: true, address: true, avatar: true } }, cart: true },
    });
    return c.json({ data: { user } }, 200);
});
usersRoutes.patch("/current", (c) => c.json({ data: { message: "Coming soon" } }));
export default usersRoutes;

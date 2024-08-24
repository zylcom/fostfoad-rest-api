import bcrypt from "bcrypt";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { loginUserValidation, registerUserValidation } from "../validation/auth.validation.js";
import { parseError } from "../lib/utils.js";
import { prisma } from "../database/client.js";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
const authRoutes = new Hono();
authRoutes.post("/login", zValidator("json", loginUserValidation, async (result, c) => {
    if (!result.success)
        throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    const { username, password } = result.data;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user)
        throw new HTTPException(401, { message: "We couldn't find an account matching those credentials." });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
        throw new HTTPException(401, { message: "We couldn't find an account matching those credentials." });
    const token = await sign({ username: user.username, exp: Math.floor(Date.now() / 1000) + 60 * 15 }, process.env.JWT_SECRET_KEY);
    return c.json({ status: "success", code: 200, data: { token } });
}));
authRoutes.post("/register", zValidator("json", registerUserValidation, async (result, c) => {
    if (!result.success)
        throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    const { username, name, password, phonenumberForm: { number }, } = result.data;
    const countUser = await prisma.user.count({ where: { username } });
    if (countUser)
        throw new HTTPException(409, { message: "Username already exists." });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            password: passwordHash,
            phonenumber: number,
            profile: { create: { name } },
            cart: { create: {} },
        },
        select: {
            id: true,
            username: true,
        },
    });
    const token = await sign({ username: user.username, exp: Math.floor(Date.now() / 1000) + 60 * 15 }, process.env.JWT_SECRET_KEY);
    return c.json({ status: "success", code: 201, data: { token } }, 201);
}));
export { authRoutes };

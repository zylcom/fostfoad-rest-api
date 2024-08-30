import bcrypt from "bcrypt";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { parseError } from "../lib/utils";
import { prisma } from "../database/client";
import { UserRegisterSchema, UserLoginSchema } from "../schema/user.schema";

const authRoutes = new Hono();

authRoutes.post(
  "/login",
  zValidator("json", UserLoginSchema, async (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    }

    const { username, password } = result.data;

    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, password: true },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HTTPException(401, { message: "Invalid credentials." });
      }

      const token = await sign(
        { username, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 60 * 15 },
        process.env.JWT_SECRET_KEY!,
      ).catch((error) => {
        throw new HTTPException(500, { message: "Error generating token.", cause: error });
      });

      return c.json({ status: "success", code: 200, message: "Login successfully", data: { token } }, 200);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      } else {
        throw new HTTPException(500, { message: "Internal server error." });
      }
    }
  }),
);

authRoutes.post(
  "/register",
  zValidator("json", UserRegisterSchema, async (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: "Validation error.", cause: parseError(result.error) });
    }

    const {
      username,
      password,
      profile: { name },
      phonenumber: { number },
    } = result.data;

    try {
      const existingUser = await prisma.user.findUnique({ where: { username } });

      if (existingUser) {
        throw new HTTPException(409, { message: "Username already exists." });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          password: passwordHash,
          phonenumber: number,
          profile: { create: { name } },
          cart: { create: {} },
        },
        select: { id: true, username: true },
      });

      const token = await sign(
        { username, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 60 * 15 },
        process.env.JWT_SECRET_KEY!,
      ).catch((error) => {
        throw new HTTPException(500, { message: "Error generating token.", cause: error });
      });

      return c.json({ status: "success", code: 201, message: "Register successfully", data: { token } }, 201);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      } else {
        throw new HTTPException(500, { message: "Internal server error." });
      }
    }
  }),
);

export default authRoutes;

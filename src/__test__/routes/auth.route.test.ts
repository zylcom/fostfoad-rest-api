import { hash } from "bcrypt";
import { prisma } from "../../database/client";
import authRoutes from "../../routes/auth";
import app from "../../app";
import exp from "constants";

describe("POST /auth/register", () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        password: await hash("password", 10),
        username: "test-user",
        phonenumber: "01234567890",
        cart: { create: {} },
        profile: { create: { name: "Test User" } },
      },
    });
  });

  afterAll(async () => {
    await prisma.cart.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.likeOnProduct.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  it("should can create new user", async () => {
    const res = await authRoutes.request("/register", {
      method: "POST",
      body: JSON.stringify({ name: "Hono test user", password: "rahasia123", username: "hono-user", phonenumberForm: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(201);
    expect(await res.json()).toHaveProperty("data.token");
  });

  it("should not create user if username already used", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Hono test user", password: "rahasia123", username: "hono-user", phonenumberForm: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(409);
    expect(await res.json()).toHaveProperty("errors");
  });

  it("should not create user if username input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Hono test user", password: "rahasia123", username: "", phonenumberForm: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty("errors.username");
  });

  it("should not create user if name input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "", password: "rahasia123", username: "username", phonenumberForm: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty("errors.name");
  });

  it("should not create user if password input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Hono test user", password: "", username: "hono-user", phonenumberForm: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty("errors.password");
  });

  it("should not create user if phonenumberForm input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Hono test user", password: "rahasia123", username: "hono-user", phonenumberForm: {} }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty("errors.phonenumberForm");
  });
});

describe("POST /auth/login", () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        password: await hash("password", 10),
        username: "test-user",
        phonenumber: "01234567890",
        cart: { create: {} },
        profile: { create: { name: "Test User" } },
      },
    });
  });

  afterAll(async () => {
    await prisma.cart.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.likeOnProduct.deleteMany();
    await prisma.user.deleteMany();

    await prisma.$disconnect();
  });

  it("should can login if user has valid credentials", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "test-user", password: "password" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toHaveProperty("data.token");
  });

  it("should not login if user credentials not valid", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "invalid-user", password: "not-valid" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(401);
    expect(await res.json()).toHaveProperty("errors.message");
  });

  it("should not login if username input is empty", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "", password: "not-valid" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty("errors.username");
  });

  it("should not login if password input is empty", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "invalid-user", password: "" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty("errors.password");
  });
});

import { hash } from "bcrypt";
import { prisma } from "../../database/client";
import authRoutes from "../../routes/auth";
import app from "../../app";

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
      body: JSON.stringify({ profile: { name: "Hono test user" }, password: "rahasia123", username: "hono-user", phonenumber: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(201);
    expect(resJson).toHaveProperty("data.token");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("success");
  });

  it("should not create user if username already used", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ profile: { name: "Hono test user" }, password: "rahasia123", username: "hono-user", phonenumber: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(409);
    expect(resJson).toHaveProperty("errors");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });

  it("should not create user if username input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Hono test user", password: "rahasia123", username: "", phonenumber: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(400);
    expect(resJson).toHaveProperty("errors.username");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });

  it("should not create user if name input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ profile: { name: "" }, password: "rahasia123", username: "username", phonenumber: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(400);
    expect(resJson).toHaveProperty("errors.profile.name");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });

  it("should not create user if password input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ profile: { name: "Hono test user" }, password: "", username: "hono-user", phonenumber: { number: "0987654321" } }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(400);
    expect(resJson).toHaveProperty("errors.password");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });

  it("should not create user if phonenumber input is empty", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ profile: { name: "Hono test user" }, password: "rahasia123", username: "hono-user", phonenumber: {} }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(400);
    expect(resJson).toHaveProperty("errors.phonenumber");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });

  it("should not create user if phonenumber is invalid", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        profile: { name: "Hono test user" },
        password: "rahasia123",
        username: "hono-user",
        phonenumber: { number: "0101010101", countryCode: "invalid-country-code" },
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(400);
    expect(resJson).toHaveProperty("errors.phonenumber");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
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

    const resJson = await res.json();

    expect(res.status).toBe(200);
    expect(resJson).toHaveProperty("data.token");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("success");
  });

  it("should not login if user credentials not valid", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "invalid-user", password: "not-valid" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(401);
    expect(resJson).toHaveProperty("errors");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });

  it("should not login if username input is empty", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "", password: "not-valid" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(400);
    expect(resJson).toHaveProperty("errors.username");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });

  it("should not login if password input is empty", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "invalid-user", password: "" }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const resJson = await res.json();

    expect(res.status).toBe(400);
    expect(resJson).toHaveProperty("errors.password");
    expect(resJson).toHaveProperty("message");
    expect(resJson).toHaveProperty("status");
    expect(resJson).toHaveProperty("code");
    expect(resJson.status).toBe("error");
  });
});

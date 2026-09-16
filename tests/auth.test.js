const jwt = require("jsonwebtoken");
const { createToken, requireAuth, requireUserAuth } = require("../middleware/auth");

describe("authentication", () => {
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  test("issues a signed token containing only the user id and email", () => {
    process.env.JWT_SECRET = "test-secret";

    const token = createToken({ _id: "user-123", email: "reader@example.com", password: "hash" });

    expect(jwt.verify(token, "test-secret")).toMatchObject({ sub: "user-123", email: "reader@example.com" });
    expect(jwt.verify(token, "test-secret")).not.toHaveProperty("password");
  });

  test("does not sign or authorize tokens when the JWT secret is missing", () => {
    delete process.env.JWT_SECRET;
    const req = { headers: { authorization: "Bearer a.token.value" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    expect(() => createToken({ _id: "user-123", email: "reader@example.com" })).toThrow("JWT_SECRET");
    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "AUTH_CONFIGURATION_ERROR", message: "Authentication is not configured" } });
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects a request without a bearer token using a JSON error", () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    expect(next).not.toHaveBeenCalled();
  });

  test("attaches verified claims for a valid bearer token", () => {
    process.env.JWT_SECRET = "test-secret";
    const req = { headers: { authorization: `Bearer ${createToken({ _id: "user-123", email: "reader@example.com" })}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(req.auth).toMatchObject({ sub: "user-123", email: "reader@example.com" });
    expect(next).toHaveBeenCalledWith();
  });

  test("forbids a signed-in user from updating another user's state", () => {
    const req = { auth: { sub: "user-123" }, params: { id: "another-user" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireUserAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "FORBIDDEN", message: "You cannot access another user's state" } });
    expect(next).not.toHaveBeenCalled();
  });
});

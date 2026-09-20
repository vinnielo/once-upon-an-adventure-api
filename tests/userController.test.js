jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn()
  }
}));

const { User } = require("../models");
const controller = require("../controllers/dataController");
const jwt = require("jsonwebtoken");

const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe("user controller", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    jest.clearAllMocks();
  });

  test("login returns a token and never returns the password hash", async () => {
    User.findOne.mockResolvedValue({
      _id: "user-1",
      email: "reader@example.com",
      password: "hashed-password",
      isCorrectPassword: jest.fn().mockResolvedValue(true),
      toObject() { return { _id: this._id, email: this.email, password: this.password }; }
    });
    const res = response();

    await controller.login({ body: { email: "reader@example.com", password: "plain-text" } }, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: { _id: "user-1", email: "reader@example.com" } }));
    const body = res.json.mock.calls[0][0];
    expect(body.user).not.toHaveProperty("password");
    expect(jwt.verify(body.token, "test-secret")).toMatchObject({ sub: "user-1", email: "reader@example.com" });
  });

  test("create returns a sanitized user", async () => {
    User.create.mockResolvedValue({
      _id: "user-2", email: "new@example.com", password: "hashed-password",
      toObject() { return { _id: this._id, email: this.email, password: this.password }; }
    });
    const res = response();

    await controller.create({ body: { email: "new@example.com", password: "plain-text" } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const body = res.json.mock.calls[0][0];
    expect(body.user).toEqual({ _id: "user-2", email: "new@example.com" });
    expect(jwt.verify(body.token, "test-secret")).toMatchObject({ sub: "user-2", email: "new@example.com" });
  });
});

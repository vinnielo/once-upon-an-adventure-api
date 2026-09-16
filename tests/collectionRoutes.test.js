jest.mock("../controllers/dataController", () => ({
  create: jest.fn(), login: jest.fn(), findAll: jest.fn((req, res) => res.json({ enumerated: true })),
  findUser: jest.fn(), findUserStory: jest.fn(), findUserInventory: jest.fn()
}));
const mockEnumerationHandler = jest.fn((req, res) => res.json({ enumerated: true }));
jest.mock("../controllers/spriteController", () => ({
  findAll: mockEnumerationHandler, create: mockEnumerationHandler, updateHomeFirst: mockEnumerationHandler,
  updateGuardTalk: mockEnumerationHandler, updateOrcTalk: mockEnumerationHandler, updateJaceTalk: mockEnumerationHandler,
  updateThiefTalk: mockEnumerationHandler, updatePermit: mockEnumerationHandler, updatePlace: mockEnumerationHandler,
  updateMoney: mockEnumerationHandler, updateLives: mockEnumerationHandler
}));
jest.mock("../controllers/storyController", () => ({ findAll: mockEnumerationHandler, create: mockEnumerationHandler, updateStory: mockEnumerationHandler }));
jest.mock("../controllers/inventoryController", () => ({ findAll: mockEnumerationHandler, create: mockEnumerationHandler }));

const request = require("supertest");
const { createToken } = require("../middleware/auth");
const app = require("../app");

describe("collection routes", () => {
  beforeAll(() => { process.env.JWT_SECRET = "test-secret"; });
  afterAll(() => { delete process.env.JWT_SECRET; });

  test.each(["/api/user", "/api/sprite", "/api/story", "/api/inventory"])("does not enumerate %s for an authenticated user", async (url) => {
    const token = createToken({ _id: "user-1", email: "reader@example.com" });
    const response = await request(app).get(url).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });
});
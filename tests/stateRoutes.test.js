const request = require("supertest");
const app = require("../app");

describe("state route protection", () => {
  test.each([
    ["put", "/api/sprite/money/user-1/10"],
    ["put", "/api/story/update/user-1/Once"],
    ["post", "/api/inventory/user-1"]
  ])("%s %s rejects requests without a bearer token", async (method, url) => {
    const response = await request(app)[method](url).send({ itemName: "Key" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: { code: "UNAUTHORIZED", message: "Authentication required" } });
  });
});

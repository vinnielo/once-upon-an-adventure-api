const request = require("supertest");
const app = require("../app");

describe("API baseline", () => {
  test("returns a JSON 404 error for an unknown route", async () => {
    const response = await request(app).get("/not-a-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: { code: "NOT_FOUND", message: "Route not found" } });
    expect(response.headers["content-type"]).toMatch(/json/);
  });
});

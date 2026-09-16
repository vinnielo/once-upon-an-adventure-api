const mockConnect = jest.fn();

jest.mock("mongoose", () => ({
  connect: mockConnect,
  connection: { once: jest.fn() }
}));

describe("database connection configuration", () => {
  const originalMongoUri = process.env.MONGODB_URI;

  beforeEach(() => {
    jest.resetModules();
    mockConnect.mockClear();
  });

  afterEach(() => {
    if (originalMongoUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalMongoUri;
  });

  test("fails clearly without MONGODB_URI", () => {
    delete process.env.MONGODB_URI;

    expect(() => require("../config/connection")).toThrow("MONGODB_URI environment variable must be set");
    expect(mockConnect).not.toHaveBeenCalled();
  });

  test("connects using MONGODB_URI", () => {
    process.env.MONGODB_URI = "mongodb://example.test/onceupon";

    require("../config/connection");

    expect(mockConnect).toHaveBeenCalledWith("mongodb://example.test/onceupon");
  });
});
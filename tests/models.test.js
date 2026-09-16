jest.mock("../models/inventory", () => "InventoryModel");

describe("model exports", () => {
  test("exports Inventory for inventory controllers", () => {
    expect(require("../models").Inventory).toBe("InventoryModel");
  });
});

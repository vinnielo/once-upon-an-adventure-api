const Sprite = require("../models/SpriteChar");

describe("sprite schema", () => {
  test("rejects negative lives and money values", () => {
    const sprite = new Sprite({ name: "Hero", lives: -1, money: -1 });
    const error = sprite.validateSync();

    expect(error.errors.lives).toBeDefined();
    expect(error.errors.money).toBeDefined();
  });
});

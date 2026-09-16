const mockSharedListen = jest.fn();
const mockServerListen = jest.fn();
const mockOnce = jest.fn((event, callback) => callback());

jest.mock("../app", () => ({ listen: mockSharedListen }));
jest.mock("../config/connection", () => ({ once: mockOnce }));
jest.mock("../routes", () => ({}));
jest.mock("express", () => {
  const mockExpress = jest.fn(() => ({ use: jest.fn(), listen: mockServerListen }));
  mockExpress.urlencoded = jest.fn();
  mockExpress.json = jest.fn();
  return mockExpress;
});

describe("production server", () => {
  test("starts the shared app composition after the database connection opens", () => {
    require("../server");

    expect(mockOnce).toHaveBeenCalledWith("open", expect.any(Function));
    expect(mockSharedListen).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
    expect(mockServerListen).not.toHaveBeenCalled();
  });
});
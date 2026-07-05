import { AppError } from "../../src/utils/AppError";

describe("AppError", () => {
  it("defaults to a 500 status code", () => {
    const err = new AppError("boom");
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(true);
  });

  it("badRequest() produces a 400 with details", () => {
    const err = AppError.badRequest("bad input", [{ path: "email", message: "invalid" }]);
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual([{ path: "email", message: "invalid" }]);
  });

  it.each([
    ["unauthorized", 401],
    ["forbidden", 403],
    ["notFound", 404],
  ] as const)("%s() produces status %d", (method, status) => {
    const err = (AppError as any)[method]();
    expect(err.statusCode).toBe(status);
  });

  it("conflict() produces a 409", () => {
    const err = AppError.conflict("duplicate");
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe("duplicate");
  });
});

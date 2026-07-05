import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../src/utils/jwt";

const user = { id: "user-123", email: "demo@test.com", role: "USER" };

describe("jwt utils", () => {
  it("signs and verifies an access token round-trip", () => {
    const token = signAccessToken(user);
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe(user.id);
    expect(payload.email).toBe(user.email);
    expect(payload.role).toBe(user.role);
  });

  it("signs and verifies a refresh token round-trip", () => {
    const token = signRefreshToken({ id: user.id });
    const payload = verifyRefreshToken(token);
    expect(payload.sub).toBe(user.id);
  });

  it("throws on a tampered access token", () => {
    const token = signAccessToken(user);
    const tampered = token.slice(0, -2) + "xx";
    expect(() => verifyAccessToken(tampered)).toThrow();
  });
});

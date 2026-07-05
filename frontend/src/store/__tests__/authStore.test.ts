import { describe, expect, it, beforeEach } from "vitest";
import { useAuthStore } from "../authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it("starts with no session", () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("setSession stores user and tokens", () => {
    useAuthStore.getState().setSession({
      user: { id: "1", email: "a@b.com", name: "A", role: "USER" },
      accessToken: "access",
      refreshToken: "refresh",
    });
    expect(useAuthStore.getState().user?.email).toBe("a@b.com");
    expect(useAuthStore.getState().accessToken).toBe("access");
  });

  it("updateAccessToken only changes the access token", () => {
    useAuthStore.getState().setSession({
      user: { id: "1", email: "a@b.com", name: "A", role: "USER" },
      accessToken: "old",
      refreshToken: "refresh",
    });
    useAuthStore.getState().updateAccessToken("new");
    expect(useAuthStore.getState().accessToken).toBe("new");
    expect(useAuthStore.getState().refreshToken).toBe("refresh");
  });

  it("clearSession resets everything", () => {
    useAuthStore.getState().setSession({
      user: { id: "1", email: "a@b.com", name: "A", role: "USER" },
      accessToken: "access",
      refreshToken: "refresh",
    });
    useAuthStore.getState().clearSession();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });
});

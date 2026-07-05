import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import type { LoginInput, RegisterInput } from "../models/auth.schema";

function toPublicUser(user: { id: string; email: string; name: string; role: string }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

async function issueTokenPair(user: { id: string; email: string; role: string }) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenHash = await bcrypt.hash(refreshToken, env.bcryptSaltRounds);
  await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw AppError.conflict("An account with this email already exists");

    const password = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, password },
    });

    const tokens = await issueTokenPair(user);
    return { user: toPublicUser(user), ...tokens };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw AppError.unauthorized("Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw AppError.unauthorized("Invalid email or password");

    const tokens = await issueTokenPair(user);
    return { user: toPublicUser(user), ...tokens };
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) throw AppError.unauthorized("Refresh token is required");

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized("Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash) throw AppError.unauthorized("Session no longer valid");

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) throw AppError.unauthorized("Refresh token does not match active session");

    const tokens = await issueTokenPair(user);
    return { user: toPublicUser(user), ...tokens };
  },

  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound("User not found");
    return toPublicUser(user);
  },
};

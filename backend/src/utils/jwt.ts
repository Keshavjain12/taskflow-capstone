import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  role: string;
}

const accessSignOptions: SignOptions = {
  expiresIn: env.jwt.accessExpiresIn as SignOptions["expiresIn"],
};

const refreshSignOptions: SignOptions = {
  expiresIn: env.jwt.refreshExpiresIn as SignOptions["expiresIn"],
};

export function signAccessToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role },
    env.jwt.accessSecret as Secret,
    accessSignOptions,
  );
}

export function signRefreshToken(payload: { id: string }): string {
  return jwt.sign({ sub: payload.id }, env.jwt.refreshSecret as Secret, refreshSignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwt.accessSecret as Secret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.refreshSecret as Secret) as JwtPayload;
}

import type { NextApiRequest } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { JWTData } from "../models/user";

const jwtSecret: jwt.Secret = process.env.JWT_SECRET ?? "";

export function isAuthenticated(req: NextApiRequest): boolean {
  if (!req.headers.cookie) {
    return false;
  }

  const cookies = cookie.parse(req.headers.cookie);
  if (!cookies.token) {
    return false;
  }

  const decoded = jwt.verify(cookies.token, jwtSecret) as JWTData;
  if (!decoded) {
    return false;
  }

  req.cookies = {
    id: decoded.id,
    username: decoded.username,
  };
  return true;
}

export function isAuthenticatedCookie(
  cookies: Partial<{ [key: string]: string }>
) {
  if (!cookies.token) {
    return false;
  }
  const decoded = jwt.verify(cookies.token, jwtSecret) as JWTData;
  if (!decoded) {
    return false;
  }
  return true;
}

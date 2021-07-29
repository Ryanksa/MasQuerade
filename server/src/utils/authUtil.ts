import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";

export interface UserSession extends Session {
  username?: string;
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(req.session as UserSession).username) {
    return res.status(401).end("Access denied");
  }
  next();
};

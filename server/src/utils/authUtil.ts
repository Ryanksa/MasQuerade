import { Request, Response, NextFunction } from "express";
import { UserSession } from "../types/customTypes";

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

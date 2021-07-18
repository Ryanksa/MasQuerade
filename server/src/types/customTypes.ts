import { Session } from "express-session";

export interface UserSession extends Session {
  username?: string;
}

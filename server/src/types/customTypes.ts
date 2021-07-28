import { Session } from "express-session";

export interface UserSession extends Session {
  username?: string;
}

export enum ChatRoomActions {
  ADD = "ADD",
  REMOVE = "REMOVE"
}
import { ChatRoom, ChatMessage } from "./chat";
import { User } from "./user";

export type ResponseData = {
  message: string;
};

export type UserResponseData = {
  message: string;
  data?: User;
};

export type UsersResponseData = {
  message: string;
  data?: User[];
};

export type ChatRoomResponseData = {
  message: string;
  data?: ChatRoom;
};

export type ChatRoomsResponseData = {
  message: string;
  data?: ChatRoom[];
  hasMore?: boolean;
};

export type ChatMessageResponseData = {
  message: string;
  data?: ChatMessage;
};

export type ChatMessagesResponseData = {
  message: string;
  data?: ChatMessage[];
};

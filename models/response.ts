import { ChatRoom, ChatMessage } from "./chat";
import { User } from "./user";

export interface ResponseData {
  message: string;
}

export interface UserResponseData extends ResponseData {
  data?: User;
}

export interface UsersResponseData extends ResponseData {
  data?: User[];
}

export interface ChatRoomResponseData extends ResponseData {
  data?: ChatRoom;
}

export interface ChatRoomsResponseData extends ResponseData {
  data?: ChatRoom[];
  hasMore?: boolean;
}

export interface ChatMessageResponseData extends ResponseData {
  data?: ChatMessage;
}

export interface ChatMessagesResponseData extends ResponseData {
  data?: ChatMessage[];
}

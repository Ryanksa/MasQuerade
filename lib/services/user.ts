import { ChatRoomResponseData } from "../models/response";
import { post_ } from "./fetch";

export const directMessageUser = async (
  username: string
): Promise<ChatRoomResponseData> => {
  const res = await post_("/api/user/chat", { username });
  const data: ChatRoomResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

import axios from "axios";
import { ChatRoomResponseData } from "../models/response";

export const directMessageUser = (
  username: string
): Promise<ChatRoomResponseData> => {
  return axios
    .post("/api/user/chat/", { username })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ChatRoomResponseData;
    })
    .catch((err) => {
      return err;
    });
};

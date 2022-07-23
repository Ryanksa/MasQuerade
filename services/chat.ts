import axios from "axios";

export const createChatRoom = (roomName: string) => {
  return axios
    .post("/api/chat/room/", { roomName })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

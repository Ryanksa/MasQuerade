import axios from "axios";
import { ChatRoom } from "../models/chat";

let chatRoomSubEvent: EventSource | null;

export const getChatRooms = (page: number, size: number) => {
  return axios
    .get(`/api/chat/room/list?page=${page}&size=${size}`)
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

export const subscribeNewChatRooms = (
  callback: (chatRoom: ChatRoom) => void
) => {
  chatRoomSubEvent = new EventSource("/api/chat/room/");
  chatRoomSubEvent.onmessage = (event) => {
    const chatRoom: ChatRoom = JSON.parse(event.data);
    callback(chatRoom);
  };
};

export const unsubscribeNewChatRooms = () => {
  if (chatRoomSubEvent) {
    chatRoomSubEvent.close();
  }
};

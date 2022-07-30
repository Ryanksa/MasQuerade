import axios from "axios";
import { ChatRoom, ChatMessage } from "../models/chat";
import {
  ResponseData,
  ChatRoomsResponseData,
  ChatMessagesResponseData,
} from "../models/response";

let chatRoomSubEvent: EventSource | null;
let chatMessageSubEvent: EventSource | null;

export const getChatRooms = (
  page: number,
  size: number
): Promise<ChatRoomsResponseData> => {
  return axios
    .get(`/api/chat/room/list?page=${page}&size=${size}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ChatRoomsResponseData;
    })
    .catch((err) => {
      return err;
    });
};

export const createChatRoom = (roomName: string): Promise<ResponseData> => {
  return axios
    .post("/api/chat/room/", { roomName })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ResponseData;
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

export const getChatMessages = (
  roomId: string,
  page: number,
  size: number
): Promise<ChatMessagesResponseData> => {
  return axios
    .get(`/api/chat/message/room?id=${roomId}&page=${page}&size=${size}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ChatMessagesResponseData;
    })
    .catch((err) => {
      return err;
    });
};

export const sendChatMessage = (
  roomId: string,
  content: string
): Promise<ResponseData> => {
  return axios
    .post("/api/chat/message/", { roomId, content })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ResponseData;
    })
    .catch((err) => {
      return err;
    });
};

export const subscribeNewChatMessages = (
  callback: (chatMessage: ChatMessage) => void
) => {
  chatMessageSubEvent = new EventSource("/api/chat/message/");
  chatMessageSubEvent.onmessage = (event) => {
    const chatMessage: ChatMessage = JSON.parse(event.data);
    callback(chatMessage);
  };
};

export const unsubscribeNewChatMessages = () => {
  if (chatMessageSubEvent) {
    chatMessageSubEvent.close();
  }
};

export const updateLastActive = (roomId: string): Promise<ResponseData> => {
  return axios
    .post(`/api/chat/room/${roomId}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ResponseData;
    })
    .catch((err) => {
      return err;
    });
};

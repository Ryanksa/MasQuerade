import axios from "axios";
import { ChatRoom } from "../models/chat";
import { Member } from "../models/user";
import {
  ResponseData,
  ChatRoomsResponseData,
  ChatRoomResponseData,
} from "../models/response";
import { Event } from "../models/listener";

let chatRoomSubEvent: EventSource | null;
let roomMemberSubEvent: EventSource | null;

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
    });
};

export const createChatRoom = (roomName: string): Promise<ResponseData> => {
  return axios.post("/api/chat/room", { roomName }).then((res) => {
    if (res.status !== 200) {
      throw new Error(`${res.status}: ${res.data.message}`);
    }
    return res.data as ResponseData;
  });
};

export const updateChatRoom = (roomId: string, newRoomName: string) => {
  return axios
    .put(`/api/chat/room/${roomId}`, { roomName: newRoomName })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ChatRoomResponseData;
    });
};

export const deleteChatRoom = (roomId: string) => {
  return axios.delete(`/api/chat/room/${roomId}`).then((res) => {
    if (res.status !== 200) {
      throw new Error(`${res.status}: ${res.data.message}`);
    }
    return res.data as ChatRoomResponseData;
  });
};

export const subscribeChatRooms = (
  callback: (event: Event<ChatRoom>) => void
) => {
  chatRoomSubEvent = new EventSource("/api/chat/room");
  chatRoomSubEvent.onmessage = (event) => {
    const eventData: Event<ChatRoom> = JSON.parse(event.data);
    callback(eventData);
  };
};

export const unsubscribeChatRooms = () => {
  if (chatRoomSubEvent) {
    chatRoomSubEvent.close();
  }
};

export const updateLastActive = (roomId: string): Promise<ResponseData> => {
  return axios.post(`/api/chat/room/${roomId}`).then((res) => {
    if (res.status !== 200) {
      throw new Error(`${res.status}: ${res.data.message}`);
    }
    return res.data as ResponseData;
  });
};

export const addRoomMember = (
  roomId: string,
  username: string,
  moderator: boolean
): Promise<ResponseData> => {
  return axios
    .post("/api/chat/room/member", { roomId, username, moderator })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ResponseData;
    });
};

export const deleteRoomMember = (
  roomId: string,
  username: string
): Promise<ResponseData> => {
  return axios
    .delete(`/api/chat/room/member?roomId=${roomId}&username=${username}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ResponseData;
    });
};

export const subscribeRoomMember = (
  callback: (event: Event<Member>) => void
) => {
  roomMemberSubEvent = new EventSource("/api/chat/room/member");
  roomMemberSubEvent.onmessage = (event) => {
    const eventData: Event<Member> = JSON.parse(event.data);
    callback(eventData);
  };
};

export const unsubscribeRoomMember = () => {
  if (roomMemberSubEvent) {
    roomMemberSubEvent.close();
  }
};

import axios from "axios";
import { ChatRoom, ChatMessage } from "../models/chat";
import { Member } from "../models/user";
import {
  ResponseData,
  ChatRoomsResponseData,
  ChatMessagesResponseData,
} from "../models/response";
import { Callback, Event, Operation } from "../models/listener";

let chatRoomSubEvent: EventSource | null;
let chatMessageSubEvent: EventSource | null;
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
  callback: (event: Event<ChatRoom>) => void
) => {
  chatRoomSubEvent = new EventSource("/api/chat/room/");
  chatRoomSubEvent.onmessage = (event) => {
    const eventData: Event<ChatRoom> = JSON.parse(event.data);
    callback(eventData);
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
  callback: (event: Event<ChatMessage>) => void
) => {
  chatMessageSubEvent = new EventSource("/api/chat/message/");
  chatMessageSubEvent.onmessage = (event) => {
    const eventData: Event<ChatMessage> = JSON.parse(event.data);
    callback(eventData);
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

export const addRoomMember = (
  roomId: string,
  username: string,
  moderator: boolean
): Promise<ResponseData> => {
  return axios
    .post("/api/chat/room/member/", { roomId, username, moderator })
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
    })
    .catch((err) => {
      return err;
    });
};

export const subscribeNewRoomMember = (
  callback: (event: Event<Member>) => void
) => {
  roomMemberSubEvent = new EventSource("/api/chat/room/member/");
  roomMemberSubEvent.onmessage = (event) => {
    const eventData: Event<Member> = JSON.parse(event.data);
    callback(eventData);
  };
};

export const unsubscribeNewRoomMember = () => {
  if (roomMemberSubEvent) {
    roomMemberSubEvent.close();
  }
};

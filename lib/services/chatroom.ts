import { ChatRoom } from "../models/chat";
import { Member } from "../models/user";
import {
  ResponseData,
  ChatRoomsResponseData,
  ChatRoomResponseData,
} from "../models/response";
import { Event } from "../models/listener";
import { delete_, get_, post_, put_ } from "./fetch";

let chatRoomSubEvent: EventSource | null;
let roomMemberSubEvent: EventSource | null;

export const getChatRooms = async (
  page: number,
  size: number
): Promise<ChatRoomsResponseData> => {
  const res = await get_(`/api/chat/room/list?page=${page}&size=${size}`);
  const data: ChatRoomsResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const createChatRoom = async (
  roomName: string
): Promise<ResponseData> => {
  const res = await post_("/api/chat/room", { roomName });
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const updateChatRoom = async (
  roomId: string,
  newRoomName: string
): Promise<ChatRoomResponseData> => {
  const res = await put_(`/api/chat/room/${roomId}`, { roomName: newRoomName });
  const data: ChatRoomResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const deleteChatRoom = async (
  roomId: string
): Promise<ChatRoomResponseData> => {
  const res = await delete_(`/api/chat/room/${roomId}`);
  const data: ChatRoomResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
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

export const updateLastActive = async (
  roomId: string
): Promise<ResponseData> => {
  const res = await post_(`/api/chat/room/${roomId}`);
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const addRoomMember = async (
  roomId: string,
  username: string,
  moderator: boolean
): Promise<ResponseData> => {
  const res = await post_("/api/chat/room/member", {
    roomId,
    username,
    moderator,
  });
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const deleteRoomMember = async (
  roomId: string,
  username: string
): Promise<ResponseData> => {
  const res = await delete_(
    `/api/chat/room/member?roomId=${roomId}&username=${username}`
  );
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
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

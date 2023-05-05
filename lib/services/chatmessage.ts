import { ChatMessage } from "../models/chat";
import {
  ResponseData,
  ChatMessageResponseData,
  ChatMessagesResponseData,
} from "../models/response";
import { Event } from "../models/listener";
import { delete_, get_, post_ } from "./fetch";

let chatMessageSubEvent: EventSource | null;

export const getChatMessages = async (
  roomId: string,
  page: number,
  size: number
): Promise<ChatMessagesResponseData> => {
  const res = await get_(
    `/api/chat/message/room?id=${roomId}&page=${page}&size=${size}`
  );
  const data: ChatMessagesResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const sendChatMessage = async (
  roomId: string,
  content: string
): Promise<ResponseData> => {
  const res = await post_("/api/chat/message", { roomId, content });
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const deleteChatMessage = async (messageId: string) => {
  const res = await delete_(`/api/chat/message/${messageId}`);
  const data: ChatMessageResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const subscribeChatMessages = (
  callback: (event: Event<ChatMessage>) => void
) => {
  chatMessageSubEvent = new EventSource("/api/chat/message");
  chatMessageSubEvent.onmessage = (event) => {
    const eventData: Event<ChatMessage> = JSON.parse(event.data);
    callback(eventData);
  };
};

export const unsubscribeChatMessages = () => {
  if (chatMessageSubEvent) {
    chatMessageSubEvent.close();
  }
};

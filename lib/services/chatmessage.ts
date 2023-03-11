import axios from "axios";
import { ChatMessage } from "../models/chat";
import { ResponseData, ChatMessagesResponseData } from "../models/response";
import { Event } from "../models/listener";

let chatMessageSubEvent: EventSource | null;

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
    });
};

export const sendChatMessage = (
  roomId: string,
  content: string
): Promise<ResponseData> => {
  return axios.post("/api/chat/message", { roomId, content }).then((res) => {
    if (res.status !== 200) {
      throw new Error(`${res.status}: ${res.data.message}`);
    }
    return res.data as ResponseData;
  });
};

export const subscribeNewChatMessages = (
  callback: (event: Event<ChatMessage>) => void
) => {
  chatMessageSubEvent = new EventSource("/api/chat/message");
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

import { Listener } from "../models/listener";
import { ChatMessage } from "../models/chat";

type MessageCallback = (msg: ChatMessage) => void;

const listeners: Listener<MessageCallback[]> = {};

export const addListener = (userId: string, callback: MessageCallback) => {
  if (!listeners[userId]) {
    listeners[userId] = [];
  }
  listeners[userId].push(callback);
};

export const removeListener = (userId: string, callback: MessageCallback) => {
  if (!listeners[userId]) {
    return;
  }
  const filtered = listeners[userId].filter((cb) => cb !== callback);
  listeners[userId] = filtered;
};

export const notifyListeners = (userId: string, msg: ChatMessage) => {
  if (!listeners[userId]) {
    return;
  }
  listeners[userId].forEach((callback) => {
    callback(msg);
  });
};

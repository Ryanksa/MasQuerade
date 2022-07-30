import { Listener } from "../models/listener";
import { ChatRoom } from "../models/chat";

type MessageCallback = (room: ChatRoom) => void;

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

export const notifyListeners = (userId: string, room: ChatRoom) => {
  if (!listeners[userId]) {
    return;
  }
  listeners[userId].forEach((callback) => {
    callback(room);
  });
};

import { Listener, Event, Callback } from "../models/listener";
import { ChatRoom } from "../models/chat";

const listeners: Listener<ChatRoom> = {};

export const addListener = (userId: string, callback: Callback<ChatRoom>) => {
  if (!listeners[userId]) {
    listeners[userId] = [];
  }
  listeners[userId].push(callback);
};

export const removeListener = (
  userId: string,
  callback: Callback<ChatRoom>
) => {
  if (!listeners[userId]) {
    return;
  }
  const filtered = listeners[userId].filter((cb) => cb !== callback);
  listeners[userId] = filtered;
};

export const notifyListeners = (userId: string, event: Event<ChatRoom>) => {
  if (!listeners[userId]) {
    return;
  }
  listeners[userId].forEach((callback) => {
    callback(event);
  });
};

import { Listener, Event, Callback } from "../models/listener";
import { ChatMessage } from "../models/chat";

const listeners: Listener<ChatMessage> = {};

export const addListener = (
  userId: string,
  callback: Callback<ChatMessage>
) => {
  if (!listeners[userId]) {
    listeners[userId] = [];
  }
  listeners[userId].push(callback);
};

export const removeListener = (
  userId: string,
  callback: Callback<ChatMessage>
) => {
  if (!listeners[userId]) {
    return;
  }
  const filtered = listeners[userId].filter((cb) => cb !== callback);
  listeners[userId] = filtered;
};

export const notifyListeners = (userId: string, event: Event<ChatMessage>) => {
  if (!listeners[userId]) {
    return;
  }
  listeners[userId].forEach((callback) => {
    callback(event);
  });
};

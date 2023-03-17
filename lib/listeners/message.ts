import { Listener, Event, Callback } from "../models/listener";
import { ChatMessage } from "../models/chat";

const listeners: Listener<ChatMessage> = {};

export const addListener = (
  userId: string,
  callback: Callback<ChatMessage>
) => {
  if (!(userId in listeners)) {
    listeners[userId] = [];
  }
  listeners[userId].push(callback);
};

export const removeListener = (
  userId: string,
  callback: Callback<ChatMessage>
) => {
  if (!(userId in listeners)) {
    return;
  }
  listeners[userId] = listeners[userId].filter((cb) => cb !== callback);
  if (listeners[userId].length === 0) {
    delete listeners[userId];
  }
};

export const notifyListeners = (userId: string, event: Event<ChatMessage>) => {
  if (!(userId in listeners)) {
    return;
  }
  for (const callback of listeners[userId]) {
    callback(event);
  }
};

import { Callback, Listener, Event } from "../models/listener";
import { Member } from "../models/user";

const listeners: Listener<Member> = {};

export const addListener = (userId: string, callback: Callback<Member>) => {
  if (!listeners[userId]) {
    listeners[userId] = [];
  }
  listeners[userId].push(callback);
};

export const removeListener = (userId: string, callback: Callback<Member>) => {
  if (!listeners[userId]) {
    return;
  }
  const filtered = listeners[userId].filter((cb) => cb !== callback);
  listeners[userId] = filtered;
};

export const notifyListeners = (userId: string, event: Event<Member>) => {
  if (!listeners[userId]) {
    return;
  }
  listeners[userId].forEach((callback) => {
    callback(event);
  });
};

import { Callback, Listener, Event } from "../models/listener";
import { Member } from "../models/user";

const listeners: Listener<Member> = {};

export const addListener = (userId: string, callback: Callback<Member>) => {
  if (!(userId in listeners)) {
    listeners[userId] = [];
  }
  listeners[userId].push(callback);
};

export const removeListener = (userId: string, callback: Callback<Member>) => {
  if (!(userId in listeners)) {
    return;
  }
  listeners[userId] = listeners[userId].filter((cb) => cb !== callback);
  if (listeners[userId].length === 0) {
    delete listeners[userId];
  }
};

export const notifyListeners = (userId: string, event: Event<Member>) => {
  if (!(userId in listeners)) {
    return;
  }
  for (const callback of listeners[userId]) {
    callback(event);
  }
};

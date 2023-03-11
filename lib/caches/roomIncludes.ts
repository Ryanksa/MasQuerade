import { RoomIncludes } from "@prisma/client";
import { RoomIncludesCache } from "../models/cache";

const INVALIDATE_INTERVAL = 1000 * 60 * 60 * 3;

const cache: RoomIncludesCache = {};

export const retrieveRoomIncludes = async (
  roomId: string,
  onMiss: () => Promise<RoomIncludes[]>
) => {
  if (!(roomId in cache)) {
    cache[roomId] = {
      roomIncludes: await onMiss(),
      lastHit: new Date().getTime(),
    };
  } else {
    cache[roomId].lastHit = new Date().getTime();
  }
  return cache[roomId].roomIncludes;
};

export const updateRoomIncludes = (
  roomId: string,
  roomIncludes: RoomIncludes[]
) => {
  cache[roomId] = {
    roomIncludes: roomIncludes,
    lastHit: new Date().getTime(),
  };
};

export const deleteRoomIncludes = (roomId: string) => {
  delete cache[roomId];
};

export const hasRoomIncludes = (roomId: string) => {
  return roomId in cache;
};

setInterval(() => {
  const invalidEpoch = new Date().getTime() - INVALIDATE_INTERVAL;
  for (const roomId of Object.keys(cache)) {
    if (cache[roomId].lastHit <= invalidEpoch) {
      delete cache[roomId];
    }
  }
}, INVALIDATE_INTERVAL);

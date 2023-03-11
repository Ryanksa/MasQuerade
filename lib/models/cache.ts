import { RoomIncludes } from "@prisma/client";

export type RoomIncludesCache = {
  [roomId: string]: {
    roomIncludes: RoomIncludes[];
    lastHit: number;
  };
};

import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../utils/auth";
import prisma from "../../../../utils/prisma";
import { ChatRoomsResponseData } from "../../../../models/response";

function get(req: NextApiRequest, res: NextApiResponse<ChatRoomsResponseData>) {
  let search: string = "";
  if (req.query.search) {
    search = String(req.query.search);
  }
  let page: number = 0;
  if (req.query.page) {
    page = +req.query.page;
  }
  let size: number = 10;
  if (req.query.size) {
    size = +req.query.size;
  }
  const userId: string = req.cookies.id ?? "";

  return prisma.chatRoom
    .findMany({
      select: { id: true, name: true, lastActive: true, includes: true },
      where: {
        name: {
          contains: search,
        },
        includes: {
          some: { userId: userId },
        },
      },
      orderBy: {
        lastActive: "desc",
      },
      skip: page * size,
      take: size + 1,
    })
    .then((rooms) => {
      res.status(200).json({
        message: `Chat rooms retrieved`,
        data: rooms.slice(0, size).map((room) => {
          const userRoomIncludes = room.includes.filter(
            (i) => i.userId === userId
          )[0];
          return {
            id: room.id,
            room: room.name,
            lastActive: room.lastActive.toISOString(),
            seenLatest: userRoomIncludes.lastActive >= room.lastActive,
          };
        }),
        hasMore: rooms.length > size,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Something went wrong on the server",
      });
    });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatRoomsResponseData>
) {
  if (!isAuthenticated(req)) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    default:
      res.status(404).end();
  }
}

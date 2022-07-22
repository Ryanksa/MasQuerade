import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ChatRoom } from "../../../../models/chat";

type ResponseData = {
  message: string;
  data?: ChatRoom[];
};

function get(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  let search: string = "";
  if (req.body.search) {
    search = "" + req.body.search;
  }
  let page: number = 0;
  if (req.body.page) {
    page = +req.body.page;
  }
  let size: number = 10;
  if (req.body.size) {
    size = +req.body.size;
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
      take: size,
    })
    .then((rooms) => {
      res.status(200).json({
        message: `Chat rooms retrieved`,
        data: rooms.map((room) => {
          const userRoomIncludes = room.includes.filter(
            (i) => i.userId === userId
          )[0];
          return {
            id: room.id,
            room: room.name,
            lastActive: room.lastActive,
            seenLatest: userRoomIncludes.lastActive >= room.lastActive,
          };
        }),
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
  res: NextApiResponse<ResponseData>
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

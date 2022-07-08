import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { isAuthenticated } from "../../../middleware/auth";
import { User } from "../../../models/user";

type ResponseData = {
  message: string;
  users?: User[];
};

function get(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const userId: string = req.cookies.id ?? "";

  return prisma.chatRoom
    .findMany({
      select: { includes: true },
      where: {
        includes: {
          some: { userId: userId },
        },
      },
      orderBy: { lastActive: "desc" },
      skip: 0,
      take: 5,
    })
    .then((chatRooms) => {
      let usersInSameRoom: string[] = [];
      chatRooms.forEach((room) => {
        const inRoom = room.includes
          .filter((include) => include.userId !== userId)
          .map((include) => include.userId);
        usersInSameRoom = [...usersInSameRoom, ...inRoom];
      });

      return prisma.user.findMany({
        where: {
          id: { in: usersInSameRoom },
        },
      });
    })
    .then((users) => {
      res.status(200).json({
        message: "Recommended users",
        users: users.map((user) => ({
          username: user.username,
          name: user.name,
          socialStats: user.socialStats,
        })),
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

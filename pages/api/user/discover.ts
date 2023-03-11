import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/utils/prisma";
import { isAuthenticated } from "../../../lib/utils/auth";
import { UsersResponseData } from "../../../lib/models/response";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponseData>
) {
  try {
    const userId: string = req.cookies.id ?? "";

    const chatRooms = await prisma.chatRoom.findMany({
      select: { includes: true },
      where: {
        includes: {
          some: { userId: userId },
        },
      },
      orderBy: { lastActive: "desc" },
      skip: 0,
      take: 5,
    });

    let usersInSameRoom: string[] = [];
    chatRooms.forEach((room) => {
      const inRoom = room.includes
        .filter((include) => include.userId !== userId)
        .map((include) => include.userId);
      usersInSameRoom = [...usersInSameRoom, ...inRoom];
    });

    const users = await prisma.user.findMany({
      where: {
        id: { in: usersInSameRoom },
      },
      orderBy: { socialStats: "desc" },
      skip: 0,
      take: 5,
    });

    res.status(200).json({
      message: "Recommended users",
      data: users.map((user) => ({
        username: user.username,
        name: user.name,
        socialStats: user.socialStats,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong on the server",
    });
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponseData>
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

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/utils/prisma";
import { isAuthenticated } from "../../../lib/utils/auth";
import { ChatRoomResponseData } from "../../../lib/models/response";

async function post(
  req: NextApiRequest,
  res: NextApiResponse<ChatRoomResponseData>
) {
  try {
    const user1Id: string = req.cookies.id ?? "";

    if (!req.body.username) {
      res.status(400).json({
        message: "username is required",
      });
      return;
    }
    const username: string = req.body.username;

    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      res.status(404).json({
        message: `User ${username} does not exist`,
      });
      return;
    }
    const user2Id = user.id;

    const withTwoUsers = await prisma.roomIncludes.groupBy({
      by: ["roomId"],
      _count: {
        userId: true,
      },
      having: {
        userId: {
          _count: {
            equals: 2,
          },
        },
      },
    });
    const roomIdsWithTwoUsers = withTwoUsers.map((q) => q.roomId);
    const roomIncludes = await prisma.roomIncludes.findMany({
      select: {
        room: true,
      },
      where: {
        roomId: { in: roomIdsWithTwoUsers },
        userId: { in: [user1Id, user2Id] },
      },
    });

    const seen: { [id: string]: boolean } = {};
    for (let include of roomIncludes) {
      if (seen[include.room.id]) {
        res.status(200).json({
          message: `Chat room with ${user2Id}`,
          data: {
            id: include.room.id,
            room: include.room.name,
            lastActive: include.room.lastActive.toISOString(),
          },
        });
        return;
      }
      seen[include.room.id] = true;
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: [user1Id, user2Id] },
      },
    });
    const user1 = users.find((u) => u.id === user1Id);
    const user2 = users.find((u) => u.id === user2Id);

    const chatRoom = await prisma.chatRoom.create({
      data: { name: `${user1?.name} / ${user2?.name}` },
    });

    await prisma.roomIncludes.createMany({
      data: [
        { roomId: chatRoom.id, userId: user1Id, moderator: true },
        { roomId: chatRoom.id, userId: user2Id, moderator: true },
      ],
    });

    res.status(200).json({
      message: `Chat room with ${user2Id}`,
      data: {
        id: chatRoom.id,
        room: chatRoom.name,
        lastActive: chatRoom.lastActive.toISOString(),
      },
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
  res: NextApiResponse<ChatRoomResponseData>
) {
  if (!isAuthenticated(req)) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  switch (req.method) {
    case "POST":
      post(req, res);
      break;
    default:
      res.status(404).end();
  }
}

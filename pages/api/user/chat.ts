import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { isAuthenticated } from "../../../utils/auth";
import { ChatRoomResponseData } from "../../../models/response";

function post(req: NextApiRequest, res: NextApiResponse<ChatRoomResponseData>) {
  const user1Id: string = req.cookies.id ?? "";
  if (!req.body.username) {
    res.status(400).json({
      message: "username is required",
    });
    return;
  }
  const username: string = req.body.username;

  return prisma.user
    .findUnique({
      where: { username: username },
    })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: `User ${username} does not exist`,
        });
        return;
      }
      const user2Id = user.id;

      return prisma.roomIncludes
        .groupBy({
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
        })
        .then((includes) => {
          const roomsWithTwoUsers = includes.map((i) => i.roomId);
          return prisma.roomIncludes.findMany({
            select: {
              room: true,
            },
            where: {
              roomId: { in: roomsWithTwoUsers },
              userId: { in: [user1Id, user2Id] },
            },
          });
        })
        .then((includes) => {
          let room;
          const seen: { [id: string]: boolean } = {};
          for (let i of includes) {
            if (seen[i.room.id]) {
              room = i.room;
              break;
            }
            seen[i.room.id] = true;
          }
          if (room) {
            res.status(200).json({
              message: `Chat room with ${user2Id}`,
              data: {
                id: room.id,
                room: room.name,
                lastActive: room.lastActive.toISOString(),
              },
            });
            return;
          }

          return prisma.user.findMany({
            where: {
              id: { in: [user1Id, user2Id] },
            },
          });
        })
        .then((users) => {
          if (!users) return;
          const user1 = users.find((u) => u.id === user1Id);
          const user2 = users.find((u) => u.id === user2Id);
          return prisma.chatRoom.create({
            data: { name: `${user1?.name} / ${user2?.name}` },
          });
        })
        .then((room) => {
          if (!room) return;
          prisma.roomIncludes
            .createMany({
              data: [
                { roomId: room.id, userId: user1Id, moderator: true },
                { roomId: room.id, userId: user2Id, moderator: true },
              ],
            })
            .then(() => {
              res.status(200).json({
                message: `Chat room with ${user2Id}`,
                data: {
                  id: room.id,
                  room: room.name,
                  lastActive: room.lastActive.toISOString(),
                },
              });
            });
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

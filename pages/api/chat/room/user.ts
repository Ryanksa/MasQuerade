import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../utils/prisma";
import { isAuthenticated } from "../../../../utils/auth";
import { notifyListeners } from "../../../../listeners/room";
import { ResponseData } from "../../../../models/response";

function postHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (!req.body.roomId || !req.body.username) {
    res.status(400).send({
      message: "roomId and username are required",
    });
    return;
  }
  const roomId: string = req.body.roomId;
  const username: string = req.body.username;
  const moderator: boolean = req.body.moderator ?? false;
  const reqUserId: string = req.cookies.id ?? "";

  return prisma.roomIncludes
    .findFirst({
      where: {
        roomId: roomId,
        userId: reqUserId,
        moderator: true,
      },
    })
    .then((include) => {
      if (!include) {
        res.status(403).send({
          message: "Must be a moderator of the chat room to add users",
        });
        return;
      }

      return prisma.user.findUnique({
        where: { username: username },
      });
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `User ${username} not found`,
        });
        return;
      }

      return prisma.roomIncludes
        .findFirst({
          where: { roomId: roomId, userId: user.id },
        })
        .then((include) => {
          if (include) {
            res.status(400).send({
              message: `User ${username} is already in chat room ${roomId}`,
            });
            return;
          }

          return prisma.roomIncludes.create({
            data: {
              roomId: roomId,
              userId: user.id,
              moderator: moderator,
            },
          });
        });
    })
    .then(() => {
      prisma.chatRoom
        .findUnique({
          where: { id: roomId },
        })
        .then((room) => {
          if (room) {
            notifyListeners(reqUserId, {
              id: room.id,
              room: room.name,
              lastActive: room.lastActive.toISOString(),
            });
          }
        });

      res.status(200).send({
        message: `Added user ${username} to chat room ${roomId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong on the server",
      });
    });
}

function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!req.body.roomId || !req.body.username) {
    res.status(400).send({
      message: "roomId and username are required",
    });
    return;
  }
  const roomId: string = req.body.roomId;
  const username: string = req.body.username;
  const reqUserId: string = req.cookies.id ?? "";

  return prisma.roomIncludes
    .findFirst({
      where: {
        roomId: roomId,
        userId: reqUserId,
        moderator: true,
      },
    })
    .then((include) => {
      if (!include) {
        res.status(403).send({
          message: "Must be a moderator of the chat room to delete users",
        });
        return;
      }

      return prisma.user.findUnique({
        where: { username: username },
      });
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `User ${username} not found`,
        });
        return;
      }

      return prisma.roomIncludes
        .findFirst({
          where: { roomId: roomId, userId: user.id },
        })
        .then((include) => {
          if (!include) {
            res.status(400).send({
              message: `User ${username} is not in chat room ${roomId}`,
            });
            return;
          }

          return prisma.roomIncludes.deleteMany({
            where: {
              roomId: roomId,
              userId: user.id,
            },
          });
        });
    })
    .then(() => {
      res.status(200).send({
        message: `Deleted user ${username} to chat room ${roomId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong on the server",
      });
    });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!isAuthenticated(req)) {
    res.status(401).send({ message: "Unauthorized access" });
    return;
  }

  switch (req.method) {
    case "POST":
      postHandler(req, res);
      break;
    case "DELETE":
      deleteHandler(req, res);
      break;
    default:
      res.status(404).end();
  }
}

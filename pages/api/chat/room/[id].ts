import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../utils/auth";
import prisma from "../../../../utils/prisma";
import { ChatRoom } from "../../../../models/chat";

type ResponseData = {
  message: string;
  data?: ChatRoom;
};

function getHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({
      message: "id is required",
    });
    return;
  }
  const userId: string = req.cookies.id ?? "";

  return prisma.chatRoom
    .findUnique({
      where: { id: id },
    })
    .then((chatRoom) => {
      if (!chatRoom) {
        res.status(404).json({
          message: `Chat room ${id} not found`,
        });
        return;
      }

      return prisma.roomIncludes
        .findMany({
          where: {
            roomId: chatRoom.id,
            userId: userId,
          },
        })
        .then((includes) => {
          if (includes.length === 0) {
            res.status(403).json({
              message: "Must be in the chat room to get it",
            });
            return;
          }

          res.status(200).json({
            message: `Chat room ${id}`,
            data: {
              id: chatRoom.id,
              room: chatRoom.name,
              lastActive: chatRoom.lastActive.toISOString(),
            },
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

function putHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { id } = req.query;
  if (typeof id !== "string" || id === "") {
    res.status(400).json({
      message: "id is required",
    });
    return;
  }

  if (!req.body.roomName) {
    res.status(400).json({
      message: "New room name is required",
    });
    return;
  }
  const roomName: string = req.body.roomName;

  const userId: string = req.cookies.id ?? "";

  prisma.chatRoom
    .findUnique({
      where: { id: id },
    })
    .then((chatRoom) => {
      if (!chatRoom) {
        res.status(404).json({
          message: `Chat room ${id} not found`,
        });
        return;
      }

      return prisma.roomIncludes.findMany({
        where: {
          roomId: chatRoom.id,
          userId: userId,
          moderator: true,
        },
      });
    })
    .then((includes) => {
      if (!includes || includes.length === 0) {
        res.status(403).json({
          message: "Must be a moderator of the chat room to update it",
        });
        return;
      }

      return prisma.chatRoom.update({
        where: { id: id },
        data: { name: roomName },
      });
    })
    .then((chatRoom) => {
      if (!chatRoom) return;

      res.status(200).json({
        message: `Updated chat room ${id}`,
        data: {
          id: chatRoom.id,
          room: chatRoom.name,
          lastActive: chatRoom.lastActive.toISOString(),
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Something went wrong on the server",
      });
    });
}

function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { id } = req.query;
  if (typeof id !== "string" || id === "") {
    res.status(400).json({
      message: "id is required",
    });
    return;
  }
  const userId: string = req.cookies.id ?? "";

  return prisma.chatRoom
    .findUnique({
      where: { id: id },
    })
    .then((chatRoom) => {
      if (!chatRoom) {
        res.status(404).json({
          message: `Chat room ${id} not found`,
        });
        return;
      }

      return prisma.roomIncludes.findMany({
        where: {
          roomId: chatRoom.id,
          userId: userId,
          moderator: true,
        },
      });
    })
    .then((includes) => {
      if (!includes || includes.length === 0) {
        res.status(403).json({
          message: "Must be an moderator of the chat room to delete it",
        });
        return;
      }

      return prisma.roomIncludes.deleteMany({
        where: { roomId: id },
      });
    })
    .then(() => {
      return prisma.chatRoom.delete({
        where: { id: id },
      });
    })
    .then((chatRoom) => {
      if (!chatRoom) return;

      res.status(200).json({
        message: `Deleted chat room ${id}`,
        data: {
          id: chatRoom.id,
          room: chatRoom.name,
          lastActive: chatRoom.lastActive.toISOString(),
        },
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
      getHandler(req, res);
      break;
    case "PUT":
      putHandler(req, res);
      break;
    case "DELETE":
      deleteHandler(req, res);
      break;
    default:
      res.status(404).end();
  }
}

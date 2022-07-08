import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { isAuthenticated } from "../../../../middleware/auth";
import { ChatMessage } from "../../../../models/chat";

type ResponseData = {
  message: string;
  data?: ChatMessage[];
};

function get(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (!req.body.roomId) {
    res.status(400).json({
      message: "roomId is required",
    });
    return;
  }
  const roomId: string = req.body.roomId;

  let page: number = 0;
  if (req.body.page) {
    page = +req.body.page;
  }

  let size: number = 10;
  if (req.body.size) {
    size = +req.body.size;
  }

  const userId = req.cookies.id ?? "";

  return prisma.roomIncludes
    .findFirst({
      where: { roomId: roomId, userId: userId },
    })
    .then((includes) => {
      if (!includes) {
        res.status(403).json({
          message: "Must be in the chat room to get messages from there",
        });
        return;
      }

      return prisma.chatMessage.findMany({
        select: {
          id: true,
          user: true,
          room: true,
          content: true,
          postedOn: true,
        },
        where: { roomId: roomId },
        orderBy: { postedOn: "desc" },
        skip: page * size,
        take: size,
      });
    })
    .then((chatMessages) => {
      if (!chatMessages) return;

      res.status(200).json({
        message: `Chat messages in chat room ${roomId}`,
        data: chatMessages.map((msg) => ({
          id: msg.id,
          username: msg.user.username,
          name: msg.user.name,
          roomId: msg.room.id,
          room: msg.room.name,
          content: msg.content,
          postedOn: msg.postedOn,
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

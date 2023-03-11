import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/utils/prisma";
import { isAuthenticated } from "../../../../lib/utils/auth";
import { ChatMessagesResponseData } from "../../../../lib/models/response";
import { retrieveRoomIncludes } from "../../../../lib/caches/roomIncludes";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<ChatMessagesResponseData>
) {
  try {
    const roomId = req.query.id;
    if (typeof roomId !== "string") {
      res.status(400).json({
        message: "roomId is required",
      });
      return;
    }

    let page: number = 0;
    if (req.query.page) {
      page = +req.query.page;
    }

    let size: number = 10;
    if (req.query.size) {
      size = +req.query.size;
    }

    const userId = req.cookies.id ?? "";

    const roomIncludes = await retrieveRoomIncludes(roomId, () =>
      prisma.roomIncludes.findMany({ where: { roomId: roomId } })
    );
    if (!roomIncludes.find((include) => include.userId === userId)) {
      res.status(403).json({
        message: "Must be in the chat room to get messages from there",
      });
      return;
    }

    const chatMessages = await prisma.chatMessage.findMany({
      select: {
        id: true,
        user: true,
        roomId: true,
        content: true,
        postedOn: true,
      },
      where: { roomId: roomId },
      orderBy: { postedOn: "desc" },
      skip: page * size,
      take: size,
    });

    res.status(200).json({
      message: `Chat messages in chat room ${roomId}`,
      data: chatMessages.map((msg) => ({
        id: msg.id,
        username: msg.user.username,
        name: msg.user.name,
        roomId: msg.roomId,
        content: msg.content,
        postedOn: msg.postedOn.toISOString(),
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
  res: NextApiResponse<ChatMessagesResponseData>
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

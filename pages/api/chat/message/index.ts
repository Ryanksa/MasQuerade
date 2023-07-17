import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/utils/prisma";
import { isAuthenticated } from "../../../../lib/utils/auth";
import {
  addListener,
  removeListener,
  notifyListeners,
} from "../../../../lib/listeners/message";
import { ChatMessage } from "../../../../lib/models/chat";
import { ResponseData } from "../../../../lib/models/response";
import { Callback, Operation } from "../../../../lib/models/listener";
import { getRandomArbitrary } from "../../../../lib/utils/general";

async function post(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (!req.body.roomId || !req.body.content) {
      res.status(400).send({
        message: "roomId and content are required",
      });
      return;
    }
    const roomId = req.body.roomId;
    const content = req.body.content;
    const postedOn = new Date();
    const userId: string = req.cookies.id ?? "";

    const roomIncludes = await prisma.roomIncludes.findMany({
      where: { roomId: roomId },
    });
    if (!roomIncludes.find((include) => include.userId === userId)) {
      res.status(403).send({
        message: "Must be in the chat room to post a message there",
      });
      return;
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        userId: userId,
        roomId: roomId,
        content: content,
        postedOn: postedOn,
      },
      select: { id: true },
    });

    for (const include of roomIncludes) {
      notifyListeners(include.userId, {
        data: {
          id: chatMessage.id,
          username: req.cookies.username ?? "",
          name: req.cookies.name ?? "",
          roomId: roomId,
          content: content,
          postedOn: postedOn.toISOString(),
        },
        operation: Operation.Add,
      });
    }

    await prisma.chatRoom.update({
      data: { lastActive: new Date() },
      where: { id: roomId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { socialStats: { increment: getRandomArbitrary(0, 3) } },
    });

    res.status(200).send({
      message: `Posted message in chat room ${roomId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong on the server",
    });
  }
}

function get(req: NextApiRequest, res: NextApiResponse) {
  const userId: string = req.cookies.id ?? "";

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  const callback: Callback<ChatMessage> = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  addListener(userId, callback);

  const close = () => {
    removeListener(userId, callback);
    res.end();
  };
  req.on("aborted", close);
  req.on("close", close);
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
      post(req, res);
      break;
    case "GET":
      get(req, res);
      break;
    default:
      res.status(404).end();
  }
}

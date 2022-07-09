import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { isAuthenticated } from "../../../../middleware/auth";
import {
  addListener,
  removeListener,
  notifyListeners,
} from "../../../../lib/message-listener";
import { ChatMessage } from "../../../../models/chat";

function post(req: NextApiRequest, res: NextApiResponse<string>) {
  if (!req.body.roomId || !req.body.content) {
    res.status(400).send("roomId and content are required");
    return;
  }
  const roomId = req.body.roomId;
  const content = req.body.content;
  const userId: string = req.cookies.id ?? "";

  return prisma.roomIncludes
    .findFirst({
      where: { roomId: roomId, userId: userId },
    })
    .then((includes) => {
      if (!includes) {
        res
          .status(403)
          .send("Must be in the chat room to post a message there");
      }

      return prisma.chatMessage.create({
        data: {
          userId: userId,
          roomId: roomId,
          content: content,
          postedOn: new Date(),
        },
        select: {
          id: true,
          user: true,
          room: true,
          content: true,
          postedOn: true,
        },
      });
    })
    .then((chatMessage) => {
      const msg = {
        id: chatMessage.id,
        username: chatMessage.user.username,
        name: chatMessage.user.name,
        roomId: chatMessage.room.id,
        room: chatMessage.room.name,
        content: chatMessage.content,
        postedOn: chatMessage.postedOn,
      };

      return prisma.roomIncludes
        .findMany({
          where: {
            roomId: msg.roomId,
          },
        })
        .then((includes) => {
          includes.forEach((include) => {
            notifyListeners(include.userId, msg);
          });

          return prisma.chatRoom.update({
            data: { lastActive: new Date() },
            where: { id: msg.roomId },
          });
        });
    })
    .then(() => {
      res.status(200).send(`Posted message in chat room ${roomId}`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Something went wrong on the server");
    });
}

function get(req: NextApiRequest, res: NextApiResponse) {
  const userId: string = req.cookies.id ?? "";

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  const callback = (msg: ChatMessage) => {
    res.write(JSON.stringify({ ...msg }));
  };
  addListener(userId, callback);

  const close = () => {
    removeListener(userId, callback);
    res.status(200).end();
  };
  req.on("aborted", close);
  req.on("close", close);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (!isAuthenticated(req)) {
    res.status(401).send("Unauthorized access");
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

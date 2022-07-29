import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../utils/prisma";
import { isAuthenticated } from "../../../../utils/auth";
import {
  addListener,
  removeListener,
  notifyListeners,
} from "../../../../listeners/message";
import { ChatMessage } from "../../../../models/chat";
import { incrementSocialStats } from "../../../../utils/general";

type ResponseData = {
  message: string;
};

function post(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (!req.body.roomId || !req.body.content) {
    res.status(400).send({
      message: "roomId and content are required",
    });
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
        res.status(403).send({
          message: "Must be in the chat room to post a message there",
        });
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
        postedOn: chatMessage.postedOn.toISOString(),
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
        });
    })
    .then(() => {
      return prisma.chatRoom.update({
        data: { lastActive: new Date() },
        where: { id: roomId },
      });
    })
    .then(() => {
      return prisma.user
        .findUnique({
          where: { id: userId },
        })
        .then((user) => {
          if (!user) return;
          return prisma.user.update({
            where: { id: userId },
            data: { socialStats: user.socialStats + incrementSocialStats() },
          });
        });
    })
    .then(() => {
      res.status(200).send({
        message: `Posted message in chat room ${roomId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong on the server",
      });
    });
}

function get(req: NextApiRequest, res: NextApiResponse) {
  const userId: string = req.cookies.id ?? "";

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  const callback = (msg: ChatMessage) => {
    res.write(`data: ${JSON.stringify(msg)}\n\n`);
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

import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import {
  addListener,
  removeListener,
  notifyListeners,
} from "../../../../listeners/room";
import { ChatRoom } from "../../../../models/chat";

type ResponseData = {
  message: string;
};

function post(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (!req.body.roomName) {
    res.status(400).send({
      message: "Cannot create chat room without room name",
    });
    return;
  }
  const roomName: string = req.body.roomName;
  const userId: string = req.cookies.id ?? "";

  return prisma.chatRoom
    .create({
      data: { name: roomName },
    })
    .then((chatRoom) => {
      return prisma.roomIncludes
        .create({
          data: {
            userId: userId,
            roomId: chatRoom.id,
            moderator: true,
          },
        })
        .then((include) => {
          notifyListeners(include.userId, {
            id: chatRoom.id,
            room: chatRoom.name,
            lastActive: chatRoom.lastActive.toISOString(),
          });
          res.status(200).send({
            message: `Created chat room ${roomName}`,
          });
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

  const callback = (room: ChatRoom) => {
    res.write(`data: ${JSON.stringify(room)}`);
    res.end("\n\n");
  };
  addListener(userId, callback);

  const close = () => {
    removeListener(userId, callback);
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

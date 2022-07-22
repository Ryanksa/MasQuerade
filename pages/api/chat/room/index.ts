import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

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
      return prisma.roomIncludes.create({
        data: {
          userId: userId,
          roomId: chatRoom.id,
          moderator: true,
        },
      });
    })
    .then(() => {
      res.status(200).send({
        message: `Created chat room ${roomName}`,
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
      post(req, res);
      break;
    default:
      res.status(404).end();
  }
}

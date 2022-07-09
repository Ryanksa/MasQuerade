import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../middleware/auth";
import prisma from "../../../../lib/prisma";

function post(req: NextApiRequest, res: NextApiResponse<string>) {
  if (!req.body.roomName) {
    res.status(400).send("Cannot create chat room without room name");
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
      res.status(200).send(`Created chat room ${roomName}`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Something went wrong on the server");
    });
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
    default:
      res.status(404).end();
  }
}

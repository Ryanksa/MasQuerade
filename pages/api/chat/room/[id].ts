import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../middleware/auth";
import prisma from "../../../../lib/prisma";
import { ChatRoom } from "../../../../models/chat";

type ResponseData = {
  message: string;
  chatRoom?: ChatRoom;
};

function getHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { id } = req.query;
  if (typeof id !== "string" || id === "") {
    res.status(400).json({
      message: "id is required",
    });
    return;
  }

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

      res.status(200).json({
        message: `Chat room ${id}`,
        chatRoom: {
          id: chatRoom.id,
          room: chatRoom.name,
          lastActive: chatRoom.lastActive,
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

function updateHandler(
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

  if (!req.body.name) {
    res.status(400).json({
      message: "New room name is required",
    });
    return;
  }
  const name: string = req.body.name;

  return prisma.chatRoom
    .update({
      where: { id: id },
      data: { name: name },
    })
    .then((chatRoom) => {
      res.status(200).json({
        message: `Updated chat room ${id}`,
        chatRoom: {
          id: chatRoom.id,
          room: chatRoom.name,
          lastActive: chatRoom.lastActive,
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

  return prisma.chatRoom
    .delete({
      where: { id: id },
    })
    .then((chatRoom) => {
      res.status(200).json({
        message: `Deleted chat room ${id}`,
        chatRoom: {
          id: chatRoom.id,
          room: chatRoom.name,
          lastActive: chatRoom.lastActive,
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
    case "UPDATE":
      updateHandler(req, res);
      break;
    case "DELETE":
      deleteHandler(req, res);
      break;
    default:
      res.status(404).end();
  }
}

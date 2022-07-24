import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ChatMessage } from "../../../../models/chat";

type ResponseData = {
  message: string;
  data?: ChatMessage;
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

  return prisma.chatMessage
    .findUnique({
      select: {
        id: true,
        user: true,
        room: true,
        content: true,
        postedOn: true,
      },
      where: { id: id },
    })
    .then((chatMessage) => {
      if (!chatMessage) {
        res.status(404).json({
          message: `Chat message ${id} not found`,
        });
        return;
      }

      if (userId !== chatMessage.user.id) {
        res.status(403).json({
          message: `Must be poster to get the chat message`,
        });
        return;
      }

      res.status(200).json({
        message: `Chat message ${id}`,
        data: {
          id: chatMessage.id,
          username: chatMessage.user.username,
          name: chatMessage.user.name,
          roomId: chatMessage.room.id,
          room: chatMessage.room.name,
          content: chatMessage.content,
          postedOn: chatMessage.postedOn.toISOString(),
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

function putHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { id } = req.query;
  if (typeof id !== "string" || id === "") {
    res.status(400).json({
      message: "id is required",
    });
    return;
  }

  if (!req.body.content) {
    res.status(400).json({
      message: "content is required",
    });
    return;
  }
  const content: string = req.body.content;

  const userId: string = req.cookies.id ?? "";

  return prisma.chatMessage
    .findFirst({
      where: { id: id, userId: userId },
    })
    .then((chatMessage) => {
      if (!chatMessage) {
        res.status(403).json({
          message: "Must be poster to update the chat message",
        });
        return;
      }

      return prisma.chatMessage.update({
        data: { content: content },
        where: { id: id },
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
      if (!chatMessage) return;

      res.status(200).json({
        message: `Updated chat message ${id}`,
        data: {
          id: chatMessage.id,
          username: chatMessage.user.username,
          name: chatMessage.user.name,
          roomId: chatMessage.room.id,
          room: chatMessage.room.name,
          content: chatMessage.content,
          postedOn: chatMessage.postedOn.toISOString(),
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

  return prisma.chatMessage
    .findFirst({
      where: { id: id, userId: userId },
    })
    .then((chatMessage) => {
      if (!chatMessage) {
        res.status(403).json({
          message: "Must be poster to delete the chat message",
        });
        return;
      }

      return prisma.chatMessage.delete({
        where: { id: id },
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
      if (!chatMessage) return;

      res.status(200).json({
        message: `Deleted chat message ${id}`,
        data: {
          id: chatMessage.id,
          username: chatMessage.user.username,
          name: chatMessage.user.name,
          roomId: chatMessage.room.id,
          room: chatMessage.room.name,
          content: chatMessage.content,
          postedOn: chatMessage.postedOn.toISOString(),
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

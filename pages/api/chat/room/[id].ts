import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../lib/utils/auth";
import prisma from "../../../../lib/utils/prisma";
import {
  ResponseData,
  ChatRoomResponseData,
} from "../../../../lib/models/response";
import {
  retrieveRoomIncludes,
  updateRoomIncludes,
  deleteRoomIncludes,
  hasRoomIncludes,
} from "../../../../lib/caches/roomIncludes";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse<ChatRoomResponseData>
) {
  try {
    const { id } = req.query;
    if (typeof id !== "string") {
      res.status(400).json({
        message: "id is required",
      });
      return;
    }
    const userId: string = req.cookies.id ?? "";

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: id },
    });
    if (!chatRoom) {
      res.status(404).json({
        message: `Chat room ${id} not found`,
      });
      return;
    }

    const roomIncludes = await retrieveRoomIncludes(chatRoom.id, () =>
      prisma.roomIncludes.findMany({ where: { roomId: chatRoom.id } })
    );
    if (!roomIncludes.find((include) => include.userId === userId)) {
      res.status(403).json({
        message: "Must be in the chat room to get it",
      });
      return;
    }

    res.status(200).json({
      message: `Chat room ${id}`,
      data: {
        id: chatRoom.id,
        room: chatRoom.name,
        lastActive: chatRoom.lastActive.toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong on the server",
    });
  }
}

async function putHandler(
  req: NextApiRequest,
  res: NextApiResponse<ChatRoomResponseData>
) {
  try {
    const { id } = req.query;
    if (typeof id !== "string" || id === "") {
      res.status(400).json({
        message: "id is required",
      });
      return;
    }

    if (!req.body.roomName) {
      res.status(400).json({
        message: "New room name is required",
      });
      return;
    }
    const roomName: string = req.body.roomName;

    const userId: string = req.cookies.id ?? "";

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: id },
    });
    if (!chatRoom) {
      res.status(404).json({
        message: `Chat room ${id} not found`,
      });
      return;
    }

    const roomIncludes = await retrieveRoomIncludes(chatRoom.id, () =>
      prisma.roomIncludes.findMany({ where: { roomId: chatRoom.id } })
    );
    if (
      !roomIncludes.find(
        (include) =>
          include.userId === userId &&
          include.roomId === chatRoom.id &&
          include.moderator
      )
    ) {
      res.status(403).json({
        message: "Must be a moderator of the chat room to update it",
      });
      return;
    }

    await prisma.chatRoom.update({
      where: { id: id },
      data: { name: roomName },
    });

    res.status(200).json({
      message: `Updated chat room ${id}`,
      data: {
        id: chatRoom.id,
        room: chatRoom.name,
        lastActive: chatRoom.lastActive.toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong on the server",
    });
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ChatRoomResponseData>
) {
  try {
    const { id } = req.query;
    if (typeof id !== "string" || id === "") {
      res.status(400).json({
        message: "id is required",
      });
      return;
    }
    const userId: string = req.cookies.id ?? "";

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: id },
    });
    if (!chatRoom) {
      res.status(404).json({
        message: `Chat room ${id} not found`,
      });
      return;
    }

    const roomIncludes = await retrieveRoomIncludes(chatRoom.id, () =>
      prisma.roomIncludes.findMany({ where: { roomId: chatRoom.id } })
    );
    if (
      !roomIncludes.find(
        (include) =>
          include.userId === userId &&
          include.roomId === chatRoom.id &&
          include.moderator
      )
    ) {
      res.status(403).json({
        message: "Must be an moderator of the chat room to delete it",
      });
      return;
    }

    await prisma.roomIncludes.deleteMany({
      where: { roomId: id },
    });

    await prisma.chatRoom.delete({
      where: { id: id },
    });

    deleteRoomIncludes(id);

    res.status(200).json({
      message: `Deleted chat room ${id}`,
      data: {
        id: chatRoom.id,
        room: chatRoom.name,
        lastActive: chatRoom.lastActive.toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong on the server",
    });
  }
}

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { id } = req.query;
    if (typeof id !== "string" || id === "") {
      res.status(400).json({
        message: "id is required",
      });
      return;
    }
    const userId: string = req.cookies.id ?? "";
    const lastActive = new Date();

    await prisma.roomIncludes.updateMany({
      data: { lastActive: lastActive },
      where: { roomId: id, userId: userId },
    });

    if (hasRoomIncludes(id)) {
      const roomIncludes = await retrieveRoomIncludes(
        id,
        () => new Promise((resolve, _) => resolve([]))
      );
      for (const include of roomIncludes) {
        if (include.userId === userId) {
          include.lastActive = lastActive;
        }
      }
      updateRoomIncludes(id, roomIncludes);
    }

    res.status(200).json({
      message: `Updated last active date in room ${id}`,
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
  res: NextApiResponse<ChatRoomResponseData>
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
    case "POST":
      postHandler(req, res);
      break;
    default:
      res.status(404).end();
  }
}

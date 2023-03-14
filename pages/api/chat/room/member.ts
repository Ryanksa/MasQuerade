import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/utils/prisma";
import { isAuthenticated } from "../../../../lib/utils/auth";
import {
  addListener,
  removeListener,
  notifyListeners,
} from "../../../../lib/listeners/member";
import { Member } from "../../../../lib/models/user";
import { Callback, Operation } from "../../../../lib/models/listener";
import { ResponseData } from "../../../../lib/models/response";
import {
  retrieveRoomIncludes,
  updateRoomIncludes,
} from "../../../../lib/caches/roomIncludes";

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (!req.body.roomId || !req.body.username) {
      res.status(400).send({
        message: "roomId and username are required",
      });
      return;
    }
    const roomId: string = req.body.roomId;
    const username: string = req.body.username;
    const moderator: boolean = req.body.moderator ?? false;
    const reqUserId: string = req.cookies.id ?? "";

    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      res.status(404).send({
        message: `User ${username} not found`,
      });
      return;
    }

    const cachedRoomIncludes = await retrieveRoomIncludes(roomId, () =>
      prisma.roomIncludes.findMany({
        where: { roomId: roomId },
      })
    );

    if (
      !cachedRoomIncludes.find(
        (include) => include.userId === reqUserId && include.moderator
      )
    ) {
      res.status(403).send({
        message: "Must be a moderator of the chat room to add users",
      });
      return;
    }

    if (cachedRoomIncludes.find((include) => include.userId === user.id)) {
      res.status(400).send({
        message: `User ${username} is already in chat room ${roomId}`,
      });
      return;
    }

    const roomIncludes = await prisma.roomIncludes.create({
      data: {
        roomId: roomId,
        userId: user.id,
        moderator: moderator,
      },
    });

    for (const include of cachedRoomIncludes) {
      notifyListeners(include.userId, {
        data: {
          username: user.username,
          name: user.name,
          socialStats: user.socialStats,
          moderator: moderator,
        },
        operation: Operation.Add,
      });
    }

    cachedRoomIncludes.push(roomIncludes);
    updateRoomIncludes(roomId, cachedRoomIncludes);

    res.status(200).send({
      message: `Added user ${username} to chat room ${roomId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong on the server",
    });
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (!req.query.roomId || !req.query.username) {
      res.status(400).send({
        message: "roomId and username are required",
      });
      return;
    }
    const roomId: string = String(req.query.roomId);
    const username: string = String(req.query.username);
    const reqUserId: string = req.cookies.id ?? "";

    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      res.status(404).send({
        message: `User ${username} not found`,
      });
      return;
    }

    const roomIncludes = await retrieveRoomIncludes(roomId, () =>
      prisma.roomIncludes.findMany({ where: { roomId: roomId } })
    );

    if (
      reqUserId !== user.id &&
      !roomIncludes.find(
        (include) => include.userId === reqUserId && include.moderator
      )
    ) {
      res.status(403).send({
        message: "Must be a moderator of the chat room to delete users",
      });
      return;
    }

    if (!roomIncludes.find((include) => include.userId === user.id)) {
      res.status(400).send({
        message: `User ${username} is not in chat room ${roomId}`,
      });
      return;
    }

    await prisma.roomIncludes.deleteMany({
      where: {
        roomId: roomId,
        userId: user.id,
      },
    });

    const deletedIndex = roomIncludes.findIndex(
      (include) => include.userId === user.id
    );
    roomIncludes[deletedIndex] = roomIncludes[roomIncludes.length];
    roomIncludes.pop();

    for (const include of roomIncludes) {
      notifyListeners(include.userId, {
        data: {
          username: user.username,
          name: user.name,
          socialStats: user.socialStats,
          moderator: false,
        },
        operation: Operation.Delete,
      });
    }

    updateRoomIncludes(roomId, roomIncludes);

    res.status(200).send({
      message: `Deleted user ${username} to chat room ${roomId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Something went wrong on the server",
    });
  }
}

function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const userId: string = req.cookies.id ?? "";

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  const callback: Callback<Member> = (event) => {
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
      postHandler(req, res);
      break;
    case "DELETE":
      deleteHandler(req, res);
      break;
    case "GET":
      getHandler(req, res);
      break;
    default:
      res.status(404).end();
  }
}

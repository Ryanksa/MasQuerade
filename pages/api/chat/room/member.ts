import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../utils/prisma";
import { isAuthenticated } from "../../../../utils/auth";
import {
  addListener,
  removeListener,
  notifyListeners,
} from "../../../../listeners/member";
import { Member } from "../../../../models/user";
import { Callback, Operation } from "../../../../models/listener";
import { ResponseData } from "../../../../models/response";

function postHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
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

  return prisma.roomIncludes
    .findFirst({
      where: {
        roomId: roomId,
        userId: reqUserId,
        moderator: true,
      },
    })
    .then((include) => {
      if (!include) {
        res.status(403).send({
          message: "Must be a moderator of the chat room to add users",
        });
        return;
      }

      return prisma.user.findUnique({
        where: { username: username },
      });
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `User ${username} not found`,
        });
        return;
      }

      return prisma.roomIncludes
        .findMany({
          where: { roomId: roomId },
        })
        .then((includes) => {
          if (includes.find((i) => i.userId === user.id)) {
            res.status(400).send({
              message: `User ${username} is already in chat room ${roomId}`,
            });
            return;
          }

          return prisma.roomIncludes
            .create({
              data: {
                roomId: roomId,
                userId: user.id,
                moderator: moderator,
              },
            })
            .then(() => {
              return includes.forEach((i) => {
                notifyListeners(i.userId, {
                  data: {
                    username: user.username,
                    name: user.name,
                    socialStats: user.socialStats,
                    moderator: moderator,
                  },
                  operation: Operation.Add,
                });
              });
            });
        });
    })
    .then(() => {
      res.status(200).send({
        message: `Added user ${username} to chat room ${roomId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong on the server",
      });
    });
}

function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!req.query.roomId || !req.query.username) {
    res.status(400).send({
      message: "roomId and username are required",
    });
    return;
  }
  const roomId: string = String(req.query.roomId);
  const username: string = String(req.query.username);
  const reqUserId: string = req.cookies.id ?? "";

  return prisma.roomIncludes
    .findFirst({
      where: {
        roomId: roomId,
        userId: reqUserId,
      },
    })
    .then((include) => {
      if (!include || (!include.moderator && include.userId !== reqUserId)) {
        res.status(403).send({
          message: "Must be a moderator of the chat room to delete users",
        });
        return;
      }

      return prisma.user.findUnique({
        where: { username: username },
      });
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `User ${username} not found`,
        });
        return;
      }

      return prisma.roomIncludes
        .findMany({
          where: { roomId: roomId },
        })
        .then((includes) => {
          if (!includes.find((i) => i.userId === user.id)) {
            res.status(400).send({
              message: `User ${username} is not in chat room ${roomId}`,
            });
            return;
          }

          return prisma.roomIncludes
            .deleteMany({
              where: {
                roomId: roomId,
                userId: user.id,
              },
            })
            .then(() => {
              return includes.forEach((i) => {
                if (i.userId !== user.id) {
                  notifyListeners(i.userId, {
                    data: {
                      username: user.username,
                      name: user.name,
                      socialStats: user.socialStats,
                      moderator: false,
                    },
                    operation: Operation.Delete,
                  });
                }
              });
            });
        });
    })
    .then(() => {
      res.status(200).send({
        message: `Deleted user ${username} to chat room ${roomId}`,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong on the server",
      });
    });
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

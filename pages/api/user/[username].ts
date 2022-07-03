import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { isAuthenticated } from "../../../middleware/auth";
import { User } from "../../../models/user";

type ResponseData = {
  message: string;
  user?: User;
};

function get(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (!isAuthenticated(req)) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  const { username } = req.query;
  if (typeof username !== "string" || username === "") {
    res.status(400).json({
      message: "Username is required",
    });
    return;
  }

  return prisma.user
    .findUnique({
      where: { username: username },
    })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        message: `User ${username}`,
        user: {
          name: user.name,
          username: user.username,
          socialStats: user.socialStats,
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
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    default:
      res.status(404).end();
  }
}

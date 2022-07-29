import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { isAuthenticated } from "../../../utils/auth";
import { UserResponseData } from "../../../models/response";

function get(req: NextApiRequest, res: NextApiResponse<UserResponseData>) {
  const userId: string = req.cookies.id ?? "";
  const username: string = req.cookies.username ?? "";

  return prisma.user
    .findUnique({
      where: { id: userId },
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
        data: {
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
  res: NextApiResponse<UserResponseData>
) {
  if (!isAuthenticated(req)) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    default:
      res.status(404).end();
  }
}

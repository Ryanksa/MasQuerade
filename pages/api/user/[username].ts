import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/utils/prisma";
import { isAuthenticated } from "../../../lib/utils/auth";
import { UserResponseData } from "../../../lib/models/response";

async function get(
  req: NextApiRequest,
  res: NextApiResponse<UserResponseData>
) {
  try {
    const { username } = req.query;
    if (typeof username !== "string") {
      res.status(400).json({
        message: "Username is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong on the server",
    });
  }
}

async function put(
  req: NextApiRequest,
  res: NextApiResponse<UserResponseData>
) {
  try {
    if (!req.body.name) {
      res.status(400).json({
        message: "name is required",
      });
      return;
    }

    const userId: string = req.cookies.id ?? "";
    const name: string = req.body.name;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: name },
    });

    res.status(200).json({
      message: `Updated user ${user.username}`,
      data: {
        name: user.name,
        username: user.username,
        socialStats: user.socialStats,
      },
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
    case "PUT":
      put(req, res);
      break;
    default:
      res.status(404).end();
  }
}

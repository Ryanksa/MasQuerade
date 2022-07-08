import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { isAuthenticated } from "../../../middleware/auth";
import { User } from "../../../models/user";

type ResponseData = {
  message: string;
  data?: User[];
};

function get(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  let search: string = "";
  if (req.body.search) {
    search = req.body.search;
  }
  let page: number = 0;
  if (req.body.page) {
    page = +req.body.page;
  }
  let size: number = 10;
  if (req.body.size) {
    size = +req.body.size;
  }

  return prisma.user
    .findMany({
      where: {
        OR: [
          {
            username: { contains: search },
          },
          {
            name: { contains: search },
          },
        ],
      },
      skip: page * size,
      take: size,
    })
    .then((users) => {
      res.status(200).json({
        message: `Users retrieved`,
        data: users.map((user) => ({
          username: user.username,
          name: user.name,
          socialStats: user.socialStats,
        })),
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
      get(req, res);
      break;
    default:
      res.status(404).end();
  }
}

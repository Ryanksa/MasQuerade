import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/utils/prisma";
import crypto from "crypto";
import { ResponseData } from "../../../lib/models/response";

const hmacKey: crypto.BinaryLike = process.env.HMAC_KEY ?? "";

async function post(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (!req.body.username || !req.body.password || !req.body.name) {
      res.status(400).send({
        message: "Username, password, and name are required",
      });
      return;
    }
    const username: string = req.body.username;
    const password: string = req.body.password;
    const name: string = req.body.name;

    const user = await prisma.user.findFirst({
      where: { username: username },
    });

    if (user) {
      res.status(409).send({
        message: `Username ${username} already exists`,
      });
      return;
    }

    const saltedHash = crypto
      .createHmac("sha256", hmacKey)
      .update(password)
      .digest("hex");

    await prisma.user.create({
      data: {
        username: username,
        password: saltedHash,
        name: name,
      },
    });

    res.status(200).send({ message: `Signed up user ${username}` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something went wrong on the server" });
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case "POST":
      post(req, res);
      break;
    default:
      res.status(404).end();
  }
}

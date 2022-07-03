import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import crypto from "crypto";

const hmacKey: crypto.BinaryLike = process.env.HMAC_KEY ?? "";

function post(req: NextApiRequest, res: NextApiResponse<string>) {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const name: string = req.body.name;

  if (username === "" || password === "") {
    res.status(400).send("Username and password are required");
    return;
  }

  return prisma.user
    .findFirst({
      where: { username: username },
    })
    .then((user) => {
      if (user) {
        res.status(409).send(`Username ${username} already exists`);
        return;
      }

      const saltedHash = crypto
        .createHmac("sha256", hmacKey)
        .update(password)
        .digest("hex");
      return prisma.user.create({
        data: {
          username: username,
          password: saltedHash,
          name: name,
        },
      });
    })
    .then(() => {
      res.status(200).send(`Signed up user ${username}`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Something went wrong on the server");
    });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  switch (req.method) {
    case "POST":
      post(req, res);
      break;
    default:
      res.status(404).end();
  }
}

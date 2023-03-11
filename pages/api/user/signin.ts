import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../../../lib/utils/prisma";
import { JWTData } from "../../../lib/models/user";
import { ResponseData } from "../../../lib/models/response";

const hmacKey: crypto.BinaryLike = process.env.HMAC_KEY ?? "";
const jwtSecret: jwt.Secret = process.env.JWT_SECRET ?? "";
const isHttps: boolean = process.env.IS_HTTPS === "true";

async function post(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).send({ message: "Username and password are required" });
      return;
    }
    const username: string = req.body.username;
    const password: string = req.body.password;

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      res.status(401).send({
        message: "The username or password is incorrect",
      });
      return;
    }

    const saltedHash = crypto
      .createHmac("sha256", hmacKey)
      .update(password)
      .digest("hex");
    if (user.password !== saltedHash) {
      res.status(401).send({
        message: "The username or password is incorrect",
      });
      return;
    }

    const data: JWTData = {
      id: user.id,
      username: user.username,
      name: user.name,
    };
    const token = jwt.sign(data, jwtSecret, { expiresIn: "7d" });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true, // Inaccessible from document.cookie
        secure: isHttps, // Only set when using https
        sameSite: true,
      })
    );
    res.status(200).send({ message: `Signed in ${user.username}` });
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

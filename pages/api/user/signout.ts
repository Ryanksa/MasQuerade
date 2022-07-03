import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

function get(req: NextApiRequest, res: NextApiResponse<string>) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      path: "/",
      maxAge: 0,
    })
  );
  res.status(200).send("Signed out");
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    default:
      res.status(404).end();
  }
}

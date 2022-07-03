import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../../middleware/auth";
import { addListener, removeListener } from "../../../../lib/message-listener";
import { ChatMessage } from "../../../../models/chat";

function get(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthenticated(req)) {
    res.status(401).send("Unauthorized access");
    return;
  }

  const userId: string = req.cookies.id ?? "";

  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  const callback = (msg: ChatMessage) => {
    res.write(JSON.stringify({ ...msg }));
  };
  addListener(userId, callback);

  const close = () => {
    removeListener(userId, callback);
    res.status(200).end();
  };
  req.on("aborted", close);
  req.on("close", close);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    default:
      res.status(404).end();
  }
}

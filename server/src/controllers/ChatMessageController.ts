import { Request, Response } from "express";
import crypto from "crypto";
import pool from "../database/postgresql";
import redisClient from "../database/redis";
import { UserSession } from "../utils/authUtil";

interface ChatMessage {
  id: string,
  author: string,
  room: string,
  content: string,
  posted_on: string
};

interface MessageListener {
  [key: string]: Response
}

const msgListener: MessageListener = {};

export const postChatMessage = (req: Request, res: Response) => {
  const msgId = crypto.randomBytes(16).toString("hex");
  const msgAuthor = (req.session as UserSession).username;
  const msgRoom = req.body.roomId;
  const msgContent = req.body.content;
  const postedOn = new Date();

  return pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if the user is in the chat room first
    let query = "SELECT username FROM RoomIncludes WHERE room = $1";
    return client.query(query, [msgRoom])
      .then((result) => {
        const usersInRoom = result.rows.map(row => row.username);

        // user not in chat room
        if (!usersInRoom.includes(msgAuthor)) {
          res.status(403).json("Cannot post messages in chat rooms that you do not belong in");
          return;
        }

        // post message
        query = "INSERT INTO ChatMessage VALUES ($1, $2, $3, $4, $5)";
        return client
          .query(query, [msgId, msgAuthor, msgRoom, msgContent, postedOn])
          .then(() => {
            const msg = {
              id: msgId,
              author: msgAuthor,
              room: msgRoom,
              content: msgContent,
              posted_on: postedOn
            };

            // notify each user in the chat room
            usersInRoom.forEach((username) => {
              if (username !== msgAuthor) {
                // this user is listening for messages, respond to it
                if (msgListener[username]) {
                  msgListener[username].json([msg]);
                  delete msgListener[username];
                }
                // this user is not listening for messages, save to redis
                else {
                  redisClient.rpush(username, JSON.stringify(msg));
                }
              }
            });
            
            res.json(msg);
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      })
      .finally(() => {
        release();
      });
  });
};

export const listenForChatMessages = (req: Request, res: Response) => {
  const username = (req.session as UserSession).username;
  if (username) {
    // respond back with any unread messages saved on redis
    redisClient.lrange(username, 0, -1, (err, reply) => {
      if (err) {
        console.error(err);
        res.status(500).json("Something went wrong on the server");
        return;
      }

      // there are unread messages, respond back with those
      if (reply.length > 0) {
        const replyObj: ChatMessage[] = [];
        reply.forEach(r => {
          replyObj.push(JSON.parse(r));
        });
        res.json(replyObj);
        redisClient.del(username);
      }
      // no unread messages, listen for new messages
      else {
        msgListener[username] = res;
      }
    });
  }
};

export const getChatMessages = (req: Request, res: Response) => {
  const roomId: string = req.params.roomId;
  let page: number = 0;
  if (req.query.page) {
    page = +req.query.page;
  }
  const reqUser = (req.session as UserSession).username;

  return pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if the user is in the chat room first
    let query = "SELECT username FROM RoomIncludes WHERE room = $1 AND username = $2";
    return client.query(query, [roomId, reqUser])
      .then((result) => {
        // user not in chat room
        if (result.rowCount === 0) {
          res.status(403).json("Cannot read messages in chat rooms that you do not belong in");
          return;
        }

        // query at most 20 messages at the specified page
        query =
          "SELECT id, author, room, content, posted_on " +
          "FROM (" +
            "SELECT ROW_NUMBER() OVER ( ORDER BY posted_on DESC ) AS row_num, * " +
            "FROM ChatMessage WHERE room = $1" +
          ") AS MsgRow " +
          "WHERE row_num >= $2 AND row_num <= $3 " +
          "ORDER BY row_num";
        return client.query(query, [roomId, page * 20 + 1, page * 20 + 20]);
      })
      .then((result) => {
        if (result) res.json(result.rows);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      })
      .finally(() => {
        release();
      });
  });
};

export const editChatMessage = (req: Request, res: Response) => {
  const msgId: string = req.params.id;
  const newContent: string = req.body.content;
  const reqUser = (req.session as UserSession).username;

  return pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if this user posted the message
    let query = "SELECT * from ChatMessage WHERE id = $1 AND author = $2";
    return client.query(query, [msgId, reqUser])
      .then((result) => {
        // this user did not post this message
        if (result.rowCount === 0) {
          res.status(403).json("Cannot edit messages that you did not post");
          return;
        }

        // edit the message
        query = "UPDATE ChatMessage SET content = $1 WHERE id = $2";
        return client.query(query, [newContent, msgId]);
      })
      .then(() => {
        res.json({
          id: msgId,
          content: newContent
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      })
      .finally(() => {
        release();
      });
  });
};

export const deleteChatMessage = (req: Request, res: Response) => {
  const msgId: string = req.params.id;
  const reqUser = (req.session as UserSession).username;

  return pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if this user posted the message
    let query = "SELECT * from ChatMessage WHERE id = $1 AND author = $2";
    return client.query(query, [msgId, reqUser])
      .then((result) => {
        // this user did not post this message
        if (result.rowCount === 0) {
          res.status(403).json("Cannot delete messages that you did not post");
          return;
        }

        // delete the message
        query = "DELETE FROM ChatMessage WHERE id = $1";
        return client.query(query, [msgId]);
      })
      .then(() => {
        res.json({ id: msgId });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      })
      .finally(() => {
        release();
      });
  });
};

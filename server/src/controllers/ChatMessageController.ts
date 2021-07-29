import { Request, Response } from "express";
import crypto from "crypto";
import pool from "../database/db";
import { UserSession } from "../types/customTypes";

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
    let query = "SELECT * FROM RoomIncludes WHERE room = $1 AND username = $2";
    return client.query(query, [msgRoom, msgAuthor])
      .then((result) => {
        // user not in chat room
        if (result.rowCount === 0) {
          release();
          res.status(403).json("Cannot post messages in chat rooms that you do not belong in");
          return;
        }

        // post message
        query = "INSERT INTO ChatMessage VALUES ($1, $2, $3, $4, $5)";
        return client.query(query, [msgId, msgAuthor, msgRoom, msgContent, postedOn]);
      })
      .then(() => {
        release();
        res.json({
          id: msgId,
          author: msgAuthor,
          room: msgRoom,
          content: msgContent,
          posted_on: postedOn
        });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

export const getChatMessages = (req: Request, res: Response) => {
  const roomId: string = req.params.roomId;
  let page: number = 0;
  if (req.query.page) {
    page = +req.query.page;
  }

  return pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // query at most 20 messages at the specified page
    let query =
      "SELECT id, author, room, content, posted_on " +
      "FROM (" +
        "SELECT ROW_NUMBER() OVER ( ORDER BY posted_on DESC ) AS row_num, * " +
        "FROM ChatMessage WHERE room = $1" +
      ") AS MsgRow " +
      "WHERE row_num >= $2 AND row_num <= $3 " +
      "ORDER BY row_num";
    return client.query(query, [roomId, page * 20 + 1, page * 20 + 20])
      .then((result) => {
        release();
        res.json(result.rows);
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
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
          release();
          res.status(403).json("Cannot edit messages that you did not post");
          return;
        }

        // edit the message
        query = "UPDATE ChatMessage SET content = $1 WHERE id = $2";
        return client.query(query, [newContent, msgId]);
      })
      .then(() => {
        release();
        res.json({
          id: msgId,
          content: newContent
        });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
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
          release();
          res.status(403).json("Cannot delete messages that you did not post");
          return;
        }

        // delete the message
        query = "DELETE FROM ChatMessage WHERE id = $1";
        return client.query(query, [msgId]);
      })
      .then(() => {
        release();
        res.json({ id: msgId });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

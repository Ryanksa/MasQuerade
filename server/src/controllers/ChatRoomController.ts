import { Request, Response } from "express";
import crypto from "crypto";
import format from 'pg-format';
import pool from "../database/db";
import { UserSession, ChatRoomActions } from "../types/customTypes";

export const createChatRoom = (req: Request, res: Response) => {
  const roomId = crypto.randomBytes(16).toString("hex");
  const roomName = req.body.roomName;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // create the chat room
    let query = "INSERT INTO chat_room VALUES ($1, $2)";
    return client.query(query, [roomId, roomName])
      .then((result) => {
        if (result.rowCount === 0) {
          res.status(500).json(`Chat room ${roomId} failed to create`);
          return;
        }

        const username = (req.session as UserSession).username;
        query = "INSERT INTO room_includes VALUES ($1, $2, TRUE)";
        return client.query(query, [roomId, username]);
      })
      .then(() => {
        release();
        res.json({
          id: roomId,
          name: roomName,
        });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

export const updateChatRoomUsers = (req: Request, res: Response) => {
  const roomId: string = req.params.id;
  const action: ChatRoomActions = req.body.action;
  const affectedUsers: [string] = req.body.users;
  const reqUser = (req.session as UserSession).username;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if req user is in the chat room
    let query = "SELECT * FROM room_includes WHERE room = $1 AND username = $2";
    return client.query(query, [roomId, reqUser])
      .then((result) => {
        // user not in this chat room
        if (result.rowCount === 0) {
          res.status(403).json("Cannot update users in chat rooms that you do not belong in");
          return;
        }

        // adding new users to the chat room
        if (action === "ADD") {
          const insertEntries = affectedUsers.map(user => ([roomId, user, false]))
          query = format("INSERT INTO room_includes VALUES %L", insertEntries);
          return client.query(query);
        }
        // removing users from the chat room
        else if (action === "REMOVE") {
          // must be a moderator to remove other users
          if (!result.rows[0].moderator) {
            res.status(403).json("Cannot remove users from a chat room that you are not the moderator of");
            return;
          }

          query = format("DELETE FROM room_includes WHERE room = $1 AND username IN %L", affectedUsers.map(user => ([user])));
          return client.query(query, [roomId]);
        } else {
          res.status(400).json("Invalid action");
        }
      })
      .then(() => {
        release();
        res.json("Updated successfully");
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

export const getChatRooms = (req: Request, res: Response) => {
  const page: number = +req.params.page;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // query at most 10 users at the specified page
    let query =
      "SELECT * " +
      "FROM (SELECT ROW_NUMBER() OVER ( ORDER BY name ) AS row_num, * FROM chat_room) AS room_row " +
      "WHERE row_num >= $1 AND row_num <= $2 " +
      "ORDER BY row_num";
    return client
      .query(query, [page * 10 + 1, page * 10 + 10])
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

export const getChatRoom = (req: Request, res: Response) => {
  const roomId: string = req.params.id;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // query for the chat room
    return client
      .query("SELECT * FROM chat_room WHERE id = $1", [roomId])
      .then((result) => {
        release();
        // chat room not found
        if (result.rowCount === 0) {
          res.status(404).json(`Chat room ${roomId} does not exists`);
          return;
        }
        res.json(result.rows[0]);
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

export const updateChatRoom = (req: Request, res: Response) => {
  const roomId: string = req.params.id;
  const newName: string = req.body.roomName;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // update the name of the chat room
    let query = "UPDATE chat_room SET name = $1 WHERE id = $2";
    return client
      .query(query, [newName, roomId])
      .then((result) => {
        release();
        // no chat room was updated
        if (result.rowCount === 0) {
          res.status(404).json(`Chat room ${roomId} does not exists`);
          return;
        }
        res.json({
          id: roomId,
          name: newName,
        });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

export const deleteChatRoom = (req: Request, res: Response) => {
  const roomId: string = req.params.id;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // delete the chat room
    let query = "DELETE FROM room_includes WHERE room = $1";
    return client
      .query(query, [roomId])
      .then(() => {
        query = "DELETE FROM chat_room WHERE id = $1";
        return client.query(query, [roomId]);
      })
      .then((result) => {
        release();
        // no chat room was deleted
        if (result.rowCount === 0) {
          res.status(404).json(`Chat room ${roomId} does not exists`);
          return;
        }
        res.json({ id: roomId });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

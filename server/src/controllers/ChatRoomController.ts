import { Request, Response } from "express";
import crypto from "crypto";
import format from 'pg-format';
import pool from "../database/postgresql";
import { UserSession } from "../utils/authUtil";

enum ChatRoomActions {
  ADD = "ADD",
  REMOVE = "REMOVE"
}

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
    let query = "INSERT INTO ChatRoom VALUES ($1, $2)";
    return client.query(query, [roomId, roomName])
      .then((result) => {
        if (result.rowCount === 0) {
          res.status(500).json(`Chat room ${roomId} failed to create`);
          return;
        }

        const username = (req.session as UserSession).username;
        query = "INSERT INTO RoomIncludes VALUES ($1, $2, TRUE)";
        return client.query(query, [roomId, username]);
      })
      .then(() => {
        res.json({
          id: roomId,
          name: roomName,
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

export const updateChatRoomUsers = (req: Request, res: Response) => {
  const roomId: string = req.params.id;
  const action: ChatRoomActions = req.body.action;
  const affectedUsers: [string] = req.body.users;
  const moderators: [boolean] = req.body.moderators;
  const reqUser = (req.session as UserSession).username;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if req user is in the chat room
    let query = "SELECT * FROM RoomIncludes WHERE room = $1 AND username = $2";
    return client.query(query, [roomId, reqUser])
      .then((result) => {
        // user not in this chat room
        if (result.rowCount === 0) {
          res.status(403).json("Cannot update users in chat rooms that you do not belong in");
          return;
        }

        // adding new users to the chat room
        if (action === "ADD") {
          const insertEntries = affectedUsers.map((user, idx) => {
            if (moderators) {
              return [roomId, user, moderators[idx]];
            } else {
              return [roomId, user, true];
            }
          });
          query = format("INSERT INTO RoomIncludes VALUES %L", insertEntries);
          return client.query(query);
        }
        // removing users from the chat room
        else if (action === "REMOVE") {
          // must be a moderator to remove other users
          if (!result.rows[0].moderator) {
            res.status(403).json("Cannot remove users from a chat room that you are not the moderator of");
            return;
          }

          query = format("DELETE FROM RoomIncludes WHERE room = $1 AND username IN (%L)", affectedUsers);
          return client.query(query, [roomId]);
        } else {
          res.status(400).json("Invalid action");
        }
      })
      .then(() => {
        res.json("Updated successfully");
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

export const getChatRooms = (req: Request, res: Response) => {
  let page: number = 0;
  if (req.query.page) {
    page = +req.query.page;
  }
  
  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // query at most 10 rooms at the specified page
    let query =
      "SELECT id, name " +
      "FROM (" +
        "SELECT ROW_NUMBER() OVER ( ORDER BY name ) AS row_num, * " +
        "FROM ChatRoom" +
      ") AS RoomRow " +
      "WHERE row_num >= $1 AND row_num <= $2 " +
      "ORDER BY row_num";
    return client
      .query(query, [page * 10 + 1, page * 10 + 10])
      .then((result) => {
        res.json(result.rows);
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
      .query("SELECT * FROM ChatRoom WHERE id = $1", [roomId])
      .then((result) => {
        // chat room not found
        if (result.rowCount === 0) {
          res.status(404).json(`Chat room ${roomId} does not exists`);
          return;
        }
        res.json(result.rows[0]);
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
    let query = "UPDATE ChatRoom SET name = $1 WHERE id = $2";
    return client
      .query(query, [newName, roomId])
      .then((result) => {
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
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      })
      .finally(() => {
        release();
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
    let query = "DELETE FROM RoomIncludes WHERE room = $1";
    return client
      .query(query, [roomId])
      .then(() => {
        query = "DELETE FROM ChatRoom WHERE id = $1";
        return client.query(query, [roomId]);
      })
      .then((result) => {
        // no chat room was deleted
        if (result.rowCount === 0) {
          res.status(404).json(`Chat room ${roomId} does not exists`);
          return;
        }
        res.json({ id: roomId });
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

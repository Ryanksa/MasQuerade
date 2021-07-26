import { Request, Response } from "express";
import crypto from "crypto";
import pool from "../database/db";

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
    const query = "INSERT INTO chat_room VALUES ($1, $2)";
    return client
      .query(query, [roomId, roomName])
      .then((result) => {
        release();
        if (result.rowCount === 0) {
          res.status(500).json(`Chat room ${roomId} failed to create`);
          return;
        }
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
    const query =
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
    const query = "UPDATE chat_room SET name = $1 WHERE id = $2";
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
    const query = "DELETE FROM chat_room WHERE id = $1";
    return client
      .query(query, [roomId])
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

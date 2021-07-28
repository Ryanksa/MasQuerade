import { Request, Response } from "express";
import crypto from "crypto";
import pool from "../database/db";
import config from "../config";
import { UserSession } from "../types/customTypes";

export const SignUp = (req: Request, res: Response) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const name: string = req.body.name;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if username already exists
    return client
      .query("SELECT username FROM masquer WHERE username = $1", [username])
      .then((result) => {
        // username already exists
        if (result.rowCount > 0) {
          release();
          res.status(409).json(`The username ${username} is taken`);
          return;
        }

        // salt hash the password and create user
        const saltedHash = crypto
          .createHmac("sha256", config.hmacKey)
          .update(password)
          .digest("hex");

        return client.query("INSERT INTO masquer VALUES ($1, $2, $3, 0)", [
          username,
          saltedHash,
          name,
        ]);
      })
      .then(() => {
        release();

        // set cookie for frontend to access logged in user
        res.cookie("username", username, {
          path: "/",
          httpOnly: false,
          secure: config.prod,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
        });
        res.cookie("name", name, {
          path: "/",
          httpOnly: false,
          secure: config.prod,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
        });

        // update session to log user in
        (req.session as UserSession).username = username;
        res.json({ username, name });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

export const SignIn = (req: Request, res: Response) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  return pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client: ", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // check if the username exists
    return client
      .query("SELECT * FROM masquer WHERE username = $1", [username])
      .then((result) => {
        release();

        // username does not exist
        if (result.rowCount === 0) {
          res.status(401).json("The username or password is incorrect");
          return;
        }

        // check if the password is correct
        const user = result.rows[0];
        const saltedHash = crypto
          .createHmac("sha256", config.hmacKey)
          .update(password)
          .digest("hex");

        if (user.password !== saltedHash) {
          res.status(401).json("The username or password is incorrect");
          return;
        }

        // set cookie for frontend to access logged in user
        res.cookie("username", username, {
          path: "/",
          httpOnly: false,
          secure: config.prod,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
        });
        res.cookie("name", user.name, {
          path: "/",
          httpOnly: false,
          secure: config.prod,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
        });

        // update session to log user in
        (req.session as UserSession).username = username;
        res.json({ username: user.username, name: user.name });
      })
      .catch((err) => {
        release();
        console.error(err);
        res.status(500).json("Something went wrong on the server");
      });
  });
};

export const SignOut = (req: Request, res: Response) => {
  res.clearCookie("username");
  res.clearCookie("name");
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session:", err);
    }
  });
  res.json("Signed out");
};

export const getUsers = (req: Request, res: Response) => {
  const page: number = +req.params.page;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client: ", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    // query at most 10 users at the specified page
    let query =
      "SELECT username, name, social_stats " +
      "FROM (SELECT ROW_NUMBER() OVER ( ORDER BY username ) AS row_num, * FROM masquer) AS masquer_row " +
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

export const getUser = (req: Request, res: Response) => {
  const username: string = req.params.username;

  pool.connect((err, client, release) => {
    // error acquiring client to query db
    if (err) {
      console.error("Error acquiring client: ", err.stack);
      res.status(500).json("Error connecting to database");
      return;
    }

    let query =
      "SELECT username, name, social_stats FROM masquer WHERE username = $1";
    return client
      .query(query, [username])
      .then((result) => {
        release();
        // user not found
        if (result.rowCount === 0) {
          res.status(404).json(`User ${username} does not exists`);
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

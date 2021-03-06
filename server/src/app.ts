require('dotenv').config();

import express from "express";
import session from "express-session";
import config from "./config";
import redisClient from "./database/redis";
import UserRouter from "./routes/UserRoutes";
import ChatRoomRouter from './routes/ChatRoomRoutes';
import ChatMessageRouter from './routes/ChatMessageRoutes';

// setup express application
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect redis to express session
const RedisStore = require('connect-redis')(session);

// setup express session
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.prod,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7  // 1 week in milliseconds
    }
  })
);

// path routes
app.use("/api/user/", UserRouter);
app.use("/api/chat/room", ChatRoomRouter);
app.use("/api/chat/message", ChatMessageRouter);

// start server
app
  .listen(config.port, () => {
    console.log("Server started at localhost:" + config.port);
  })
  .on("error", (err: Error) => {
    console.log(err);
  });

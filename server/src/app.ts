import express from "express";
import session from "express-session";
import redis from 'redis';
import config from "./config";
import UserRouter from "./routes/UserRoutes";

// setup express application
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup redis
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

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
      maxAge: 60 * 60 * 24 * 7
    }
  })
);

// path routes
app.use("/api/users/", UserRouter);

// start server
app
  .listen(config.port, () => {
    console.log("Server started at localhost:" + config.port);
  })
  .on("error", (err: Error) => {
    console.log(err);
  });

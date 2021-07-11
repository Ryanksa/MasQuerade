import express from 'express';
import pool from './database/db';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = parseInt(process.env.PORT || '5000');
app.listen(PORT, () => {
  console.log("Server started at localhost:" + PORT);
}).on("error", (err: Error) => {
  console.log(err);
});
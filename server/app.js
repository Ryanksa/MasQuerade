const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server started at localhost:" + PORT);
});
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const port = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send.json({
    message: "Hello World",
  });
});

app.listen(3000, () => {
  console.log(`Server is listening is ${port}...`);
});

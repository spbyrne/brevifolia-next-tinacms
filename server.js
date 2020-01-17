const express = require("express");
const next = require("next");
const cors = require("cors");
const gitApi = require("@tinacms/api-git");
const teams = require("@tinacms/teams");
const cookieParser = require("cookie-parser");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  dir: "./src"
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(cookieParser());
  server.use(teams.router());
  server.use("/___tina", gitApi.router());

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

const express = require("express");
const next = require("next");
const cors = require("cors");
const gitApi = require("@tinacms/api-git");
const teams = require("@tinacms/teams");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const qs = require("qs");
// const router = require("./src/github/router");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  dir: "./src"
});
const handle = app.getRequestHandler();

const NO_COOKIES_ERROR = `@tinacms/teams \`authenticate\` middleware could not find cookies on the request.

Try adding the \`cookie-parser\` middleware to your express app.

https://github.com/expressjs/cookie-parser
`;

const GITHUB_AUTH_COOKIE_KEY = "tina-github-auth";

function validateToken(req, res, next) {
  if (!req.cookies) {
    throw new Error(NO_COOKIES_ERROR);
  }
  const token = req.cookies[GITHUB_AUTH_COOKIE_KEY];

  if (!token) {
    res.redirect(
      `https://github.com/apps/${process.env.TINA_GITHUB_APP_NAME}/installations/new`
    );
    return;
  }

  next();
}

function router() {
  const router = express.Router();

  router.get("/github/authorized", async (req, res) => {
    console.log("github app installation complete ");

    axios
      .post(
        `https://github.com/login/oauth/access_token`,
        qs.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: req.query.code
        })
      )
      .then(tokenResp => {
        const { access_token } = qs.parse(tokenResp.data);
        res.cookie(GITHUB_AUTH_COOKIE_KEY, access_token);
        res.redirect(`http://localhost:3000`);
      });
  });

  router.use(validateToken);

  return router;
}

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(router());
  server.use("/___tina", gitApi.router());
  server.use(cors());
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

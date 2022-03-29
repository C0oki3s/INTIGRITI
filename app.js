const express = require("express");
const Parser = require("url-parse");
const axios = require("axios").default;
const app = express();

const BLACKLIST = ["127.0.0.1", "localhost"];
function checkBlackList(req, res, next) {
  const { url } = req.query;
  let Sanitize;
  let re = /[^@]/;
  let badre = /[~^]/;
  if (badre.test(url)) {
    return res.send("BAD CHAR");
  } else {
    if (re.test(url)) {
      Sanitize = url?.split("@")[0];
    }
  }
  const Parsered = Parser(Sanitize, true).hostname;
  var Catch = [];
  BLACKLIST.forEach((BLACKLIST) => {
    if (Parsered == BLACKLIST) {
      Catch.push(Sanitize);
    }
  });
  if (Catch.length > 0) {
    return res.status(500).json({
      status: 500,
      message: "Error Fetching URL",
    });
  }
  res.Sanitize = Sanitize;
  next();
}

app.get("/", checkBlackList, (req, res) => {
  if (res.Sanitize) {
    try {
      axios.get(res.Sanitize).then((response) => {
        res.send(response.data);
      });
    } catch {
      res.status(500).json({
        status: 500,
        message: "Error Fetching URL",
      });
    }
  }
});

app.listen(5000);

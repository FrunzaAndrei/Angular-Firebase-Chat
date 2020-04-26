const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.static("./dist/angularChat"));

app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "dist/angularChat/" });
});

app.listen(port);

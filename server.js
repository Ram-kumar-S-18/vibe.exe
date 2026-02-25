// server.js
const express = require("express");
const db = require("./db");

const allocateRoute = require("./routes/allocate.route");
const releaseRoute = require("./routes/release.route");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/allocate", allocateRoute);
app.use("/release", releaseRoute);

app.listen(PORT, () => {
  console.log(`ResAl running on http://localhost:${PORT}`);
});

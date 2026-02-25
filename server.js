process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

const express = require("express");
require("./db");

const allocateRoute = require("./routes/allocate.route");
const releaseRoute = require("./routes/release.route");
const addRideRoute = require("./routes/addRide.route");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/allocate", allocateRoute);
app.use("/release", releaseRoute);
app.use("/add-ride", addRideRoute);

app.listen(PORT, () => {
  console.log(`Ride Allocation Service running at http://localhost:${PORT}`);
});

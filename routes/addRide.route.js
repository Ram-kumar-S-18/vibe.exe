const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/", (req, res) => {
  const { name, pickup_zone, drop_zone, priority } = req.body;

  if (!name || !pickup_zone || !drop_zone) {
    return res.json({ message: "Invalid ride data" });
  }

  db.run(
    `INSERT INTO tasks
     (name, demand, priority, pickup_zone, drop_zone, status, allocated)
     VALUES (?, 1, ?, ?, ?, 'pending', 0)`,
    [name, priority || 1, pickup_zone, drop_zone],
    () => res.json({ message: "Ride added" }),
  );
});

module.exports = router;

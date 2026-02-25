const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/:id", (req, res) => {
  const id = Number(req.params.id);

  db.get(
    "SELECT allocated FROM tasks WHERE id = ? AND status = 'assigned'",
    [id],
    (_, task) => {
      if (!task) return res.json({ message: "Invalid rider" });

      db.serialize(() => {
        db.run("BEGIN");
        db.run("UPDATE resources SET available = available + 1 WHERE id = 1");
        db.run("UPDATE tasks SET status = 'completed' WHERE id = ?", [id]);
        db.run("COMMIT");

        res.json({ message: "Driver released" });
      });
    },
  );
});

module.exports = router;

// routes/release.route.js
const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/:id", (req, res) => {
  const taskId = Number(req.params.id);

  db.get(
    "SELECT allocated FROM tasks WHERE id = ? AND status != 'completed'",
    [taskId],
    (err, task) => {
      if (!task) {
        return res.status(400).json({ error: "Invalid task" });
      }

      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        db.run("UPDATE resources SET available = available + ? WHERE id = 1", [
          task.allocated,
        ]);

        db.run("UPDATE tasks SET status = 'completed' WHERE id = ?", [taskId]);

        db.run("COMMIT");
        res.json({ message: "Resources released" });
      });
    },
  );
});

module.exports = router;

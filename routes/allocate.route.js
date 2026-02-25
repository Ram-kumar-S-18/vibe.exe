const express = require("express");
const db = require("../db");
const allocateResources = require("../allocator/allocate");

const router = express.Router();

router.post("/", (req, res) => {
  db.get("SELECT * FROM resources WHERE id = 1", (err, resource) => {
    if (!resource) {
      return res.json({ remaining: 0, allocations: [] });
    }

    db.all(
      "SELECT * FROM tasks WHERE status IN ('pending', 'partial')",
      (err, tasks) => {
        if (!tasks || tasks.length === 0) {
          return res.json({
            remaining: resource.available,
            allocations: [],
            message: "No pending tasks to allocate",
          });
        }

        const result = allocateResources({ total: resource.available }, tasks);

        db.serialize(() => {
          db.run("BEGIN TRANSACTION");

          result.allocations.forEach((t) => {
            db.run("UPDATE tasks SET allocated = ?, status = ? WHERE id = ?", [
              t.allocated,
              t.status,
              t.id,
            ]);
          });

          db.run("UPDATE resources SET available = ? WHERE id = 1", [
            result.remaining,
          ]);

          db.run("COMMIT");
          res.json(result);
        });
      },
    );
  });
});

module.exports = router;

const express = require("express");
const db = require("../db");
const allocateResources = require("../allocator/allocate");

const router = express.Router();

router.post("/", (_, res) => {
  db.get("SELECT * FROM resources WHERE id = 1", (_, resource) => {
    db.all("SELECT * FROM tasks WHERE status = 'pending'", (_, tasks) => {
      const result = allocateResources({ total: resource.available }, tasks);

      const assignedCount = result.allocations.filter(
        (r) => r.status === "assigned",
      ).length;

      const newAvailable = Math.max(resource.available - assignedCount, 0);

      db.serialize(() => {
        db.run("BEGIN");

        result.allocations.forEach((r) => {
          db.run("UPDATE tasks SET allocated = ?, status = ? WHERE id = ?", [
            r.allocated,
            r.status,
            r.id,
          ]);
        });

        db.run("UPDATE resources SET available = ? WHERE id = 1", [
          newAvailable,
        ]);

        db.run("COMMIT");
        res.json({ remaining: newAvailable, allocations: result.allocations });
      });
    });
  });
});

module.exports = router;

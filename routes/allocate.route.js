const express = require("express");
const db = require("../db");
const allocateResources = require("../allocator/allocate");

const router = express.Router();

router.post("/", (_, res) => {
  // 1. Read resource configuration
  db.get("SELECT * FROM resources WHERE id = 1", (err, resource) => {
    if (!resource) {
      return res.json({ remaining: 0, allocations: [] });
    }

    // 2. Fetch only pending rides
    db.all("SELECT * FROM tasks WHERE status = 'pending'", (err, tasks) => {
      if (!tasks || tasks.length === 0) {
        return res.json({
          remaining: resource.available,
          allocations: [],
        });
      }

      // 3. Run allocator using CURRENT available drivers
      const result = allocateResources({ total: resource.available }, tasks);

      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // 4. Persist task updates
        result.allocations.forEach((r) => {
          db.run("UPDATE tasks SET allocated = ?, status = ? WHERE id = ?", [
            r.allocated,
            r.status,
            r.id,
          ]);
        });

        // 5. Recompute available drivers from DB (authoritative)
        db.get(
          "SELECT COUNT(*) AS assigned FROM tasks WHERE status = 'assigned'",
          (_, row) => {
            const assignedTotal = row.assigned;

            const newAvailable = Math.max(resource.total - assignedTotal, 0);

            db.run("UPDATE resources SET available = ? WHERE id = 1", [
              newAvailable,
            ]);

            db.run("COMMIT");

            // 6. Return consistent response
            res.json({
              remaining: newAvailable,
              allocations: result.allocations,
            });
          },
        );
      });
    });
  });
});

module.exports = router;

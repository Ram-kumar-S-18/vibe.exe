const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./resal.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY,
      total INTEGER NOT NULL,
      available INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      demand INTEGER NOT NULL,
      priority INTEGER NOT NULL,
      pickup_zone TEXT,
      drop_zone TEXT,
      status TEXT NOT NULL,
      allocated INTEGER NOT NULL
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM resources", (_, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO resources (id, total, available) VALUES (1, 5, 5)");
    }
  });

  db.get("SELECT COUNT(*) AS count FROM tasks", (_, row) => {
    if (row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO tasks
        (name, demand, priority, pickup_zone, drop_zone, status, allocated)
        VALUES (?, 1, ?, ?, ?, 'pending', 0)
      `);

      stmt.run("Rider A", 3, "Downtown", "Airport");
      stmt.run("Rider B", 2, "Mall", "University");
      stmt.run("Rider C", 1, "Station", "Tech Park");

      stmt.finalize();
    }
  });
});

module.exports = db;

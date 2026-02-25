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
      status TEXT NOT NULL,
      allocated INTEGER NOT NULL
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM resources", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO resources (id, total, available) VALUES (1, 10, 10)");
    }
  });

  db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO tasks (name, demand, priority, status, allocated) VALUES (?, ?, ?, 'pending', 0)",
      );

      stmt.run("Payroll System", 4, 3);
      stmt.run("Mobile App", 3, 2);
      stmt.run("Analytics Platform", 5, 1);

      stmt.finalize();
    }
  });
});

module.exports = db;

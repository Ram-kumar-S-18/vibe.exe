// db.js
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
      demand INTEGER NOT NULL,
      priority INTEGER NOT NULL,
      status TEXT NOT NULL,
      allocated INTEGER NOT NULL
    )
  `);

  // Ensure exactly one resource row exists
  db.get("SELECT COUNT(*) as count FROM resources", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO resources (id, total, available) VALUES (1, 10, 10)");
    }
  });
});

module.exports = db;
// Seed tasks if empty (company prototype)
db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
  if (row.count === 0) {
    const stmt = db.prepare(
      "INSERT INTO tasks (demand, priority, status, allocated) VALUES (?, ?, 'pending', 0)"
    );

    // Company projects
    stmt.run(4, 3); // Payroll System
    stmt.run(3, 2); // Mobile App
    stmt.run(5, 1); // Analytics Platform

    stmt.finalize();
  }
});
# ResAl – Resource Allocation Optimizer

ResAl is a deterministic, database-backed resource allocation system designed
for predictable behavior and demo-safe execution.

## Features
- Priority-based allocation
- SQLite-backed persistence
- Explicit resource release
- Deterministic and fail-safe logic

## Tech Stack
- Backend: Node.js, Express
- Database: SQLite
- Frontend: HTML, CSS, Vanilla JS

## How It Works
1. Resources and tasks are stored in SQLite
2. Allocation assigns available resources based on priority
3. Tasks explicitly release resources when completed
4. System never over-allocates or crashes

## Run Instructions
```bash
npm install
node server.js
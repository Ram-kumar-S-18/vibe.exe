// allocator/allocate.js
function allocateResources(resources, tasks) {
  let remaining = Number(resources.total) || 0;
  if (remaining < 0) remaining = 0;

  const sortedTasks = [...tasks].sort(
    (a, b) => (b.priority || 0) - (a.priority || 0),
  );

  const allocations = [];

  for (const task of sortedTasks) {
    const demand = Number(task.demand) || 0;

    if (demand <= 0) {
      allocations.push({ ...task, allocated: 0, status: "invalid" });
      continue;
    }

    if (remaining === 0) {
      allocations.push({ ...task, allocated: 0, status: "unallocated" });
      continue;
    }

    const allocated = Math.min(demand, remaining);
    remaining -= allocated;

    allocations.push({
      ...task,
      allocated,
      status: allocated === demand ? "allocated" : "partial",
    });
  }

  return { remaining, allocations };
}

module.exports = allocateResources;

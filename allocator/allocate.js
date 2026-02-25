function allocateResources(resources, tasks) {
  let remaining = Number(resources.total) || 0;

  const sorted = [...tasks].sort(
    (a, b) => (b.priority || 0) - (a.priority || 0),
  );

  const allocations = [];

  for (const task of sorted) {
    if (remaining === 0) {
      allocations.push({ ...task, allocated: 0, status: "waiting" });
      continue;
    }

    remaining -= 1;
    allocations.push({ ...task, allocated: 1, status: "assigned" });
  }

  return { remaining, allocations };
}

module.exports = allocateResources;

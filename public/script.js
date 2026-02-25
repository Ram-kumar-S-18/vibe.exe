const output = document.getElementById("out");
const button = document.getElementById("allocateBtn");

button.addEventListener("click", () => {
  if (button.disabled) return;

  button.disabled = true;
  output.textContent = "Running allocation...";

  fetch("/allocate", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.allocations) {
        output.textContent = "Unexpected response from server.";
        return;
      }

      let text = `Remaining Resources: ${data.remaining}\n\n`;

      data.allocations.forEach((a) => {
        text += `Project: ${a.name}\n`;
        text += `Requested: ${a.demand}\n`;
        text += `Allocated: ${a.allocated}\n`;
        text += `Status: ${a.status}\n\n`;
      });

      output.textContent = text || "No allocations available.";
    })
    .catch(() => {
      output.textContent = "Allocation failed safely.";
    })
    .finally(() => {
      button.disabled = false;
    });
});

const btn = document.getElementById("allocateBtn");
const out = document.getElementById("out");

btn.onclick = () => {
  btn.disabled = true;
  out.textContent = "Allocating drivers...\n";

  fetch("/allocate", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      let text = `Available Drivers After Allocation: ${data.remaining}\n\n`;

      data.allocations.forEach((r) => {
        text += `Rider: ${r.name}\n`;
        text += `Pickup: ${r.pickup_zone}\n`;
        text += `Drop: ${r.drop_zone}\n`;
        text += `Driver Assigned: ${r.status === "assigned" ? "Yes" : "No"}\n\n`;
      });

      out.textContent = text;
    })
    .finally(() => (btn.disabled = false));
};

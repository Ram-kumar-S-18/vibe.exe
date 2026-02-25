const btn = document.getElementById("allocateBtn");
const cards = document.getElementById("cards");
const notification = document.getElementById("notification");

btn.onclick = () => {
  btn.disabled = true;
  cards.innerHTML = "";

  notification.className = "notification info";
  notification.textContent = "Allocating drivers...";
  notification.classList.remove("hidden");

  fetch("/allocate", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      notification.className = "notification success";
      notification.textContent = `Allocation complete. Available drivers left: ${data.remaining}`;

      if (!data.allocations.length) {
        cards.innerHTML = "<p>All riders are already assigned.</p>";
        return;
      }

      data.allocations.forEach((r) => {
        const card = document.createElement("div");
        card.className = `card ${r.status}`;

        card.innerHTML = `
          <h3>👤 ${r.name}</h3>
          <p>📍 Pickup: ${r.pickup_zone}</p>
          <p>🏁 Drop: ${r.drop_zone}</p>
          <p>🚗 Driver: ${r.status === "assigned" ? "Assigned" : "Waiting"}</p>
        `;

        cards.appendChild(card);
      });
    })
    .finally(() => (btn.disabled = false));
};

document.getElementById("addRideBtn").onclick = () => {
  fetch("/add-ride", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: riderName.value,
      pickup_zone: pickup.value,
      drop_zone: drop.value,
      priority: priority.value,
    }),
  }).then(() => alert("Ride added. Run allocation again."));
};

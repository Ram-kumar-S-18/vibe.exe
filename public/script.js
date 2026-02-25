const btn = document.getElementById("allocateBtn");
const cards = document.getElementById("cards");
const notification = document.getElementById("notification");

btn.onclick = () => {
  if (btn.disabled) return;

  btn.disabled = true;
  cards.innerHTML = "";
  notification.className = "notification info";
  notification.textContent = "Allocating drivers to riders...";
  notification.classList.remove("hidden");

  fetch("/allocate", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      notification.className = "notification success";
      notification.textContent = `✅ Allocation complete. Available drivers left: ${data.remaining}`;

      data.allocations.forEach((r) => {
        const card = document.createElement("div");
        card.className = `card ${r.status === "assigned" ? "assigned" : "waiting"}`;

        card.innerHTML = `
          <h3>👤 ${r.name}</h3>
          <p>📍 Pickup: ${r.pickup_zone}</p>
          <p>🏁 Drop: ${r.drop_zone}</p>
          <p>🚗 Driver: ${r.status === "assigned" ? "Assigned" : "Waiting"}</p>
        `;

        cards.appendChild(card);
      });
    })
    .catch(() => {
      notification.className = "notification info";
      notification.textContent = "⚠️ Allocation failed safely.";
    })
    .finally(() => {
      btn.disabled = false;
    });
};

const output = document.getElementById("out");
const button = document.getElementById("allocateBtn");

button.addEventListener("click", () => {
  output.textContent = "Running allocation...";
  button.disabled = true;

  fetch("/allocate", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      output.textContent = JSON.stringify(data, null, 2);
    })
    .catch(() => {
      output.textContent = "Failed to run allocation.";
    })
    .finally(() => {
      button.disabled = false;
    });
});

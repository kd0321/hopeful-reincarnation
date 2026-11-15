document.querySelectorAll("[data-modal]").forEach(button => {
  button.addEventListener("click", async () => {
    const file = button.dataset.modal === "subscribe"
      ? "subscriber-button-popup.html"
      : "follow-us-button-popup.html";

    const response = await fetch(`webpages/${file}`);
    const html = await response.text();

    document.getElementById("popup-container").innerHTML = html;
  });
});
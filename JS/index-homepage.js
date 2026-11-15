
document.querySelectorAll("[data-modal]").forEach(button => {
  button.addEventListener("click", async () => {
    const file = button.dataset.modal === "subscribe"
      ? "subscriber-button-popup.html"
      : "follow-us-button-popup.html";

    const response = await fetch(`./Popups-Webpages/${file}`);
    if (!response.ok) return;

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const container = document.getElementById("popup-container");

    container.innerHTML = doc.body.innerHTML;

    const style = doc.querySelector("style");
    if (style) container.prepend(style.cloneNode(true));

    // Position directly underneath the clicked button
    const rect = button.getBoundingClientRect();

    container.style.left = `${rect.left + window.scrollX}px`;
    container.style.top = `${rect.bottom + window.scrollY + 12}px`;
    container.style.display = "block";

    // Close popup
    container.querySelector(".close")?.addEventListener("click", () => {
      container.style.display = "none";
      container.innerHTML = "";
    });
  });
});

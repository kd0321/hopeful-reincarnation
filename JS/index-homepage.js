
document.querySelectorAll("[data-modal]").forEach(button => {
  button.addEventListener("click", async () => {
    const file = button.dataset.modal === "subscribe"
      ? "subscriber-button-popup.html"
      : "follow-us-button-popup.html";

    const response = await fetch(`./Popups-Webpages/${file}`);

    if (!response.ok) {
      console.error("Popup not found:", response.status);
      return;
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const container = document.getElementById("popup-container");
    container.innerHTML = doc.body.innerHTML;

    // Apply the popup's embedded CSS
    const style = doc.querySelector("style");
    if (style) {
      container.querySelector("style")?.remove();
      container.prepend(style.cloneNode(true));
    }

    // Close popup
    container.querySelector(".close")?.addEventListener("click", () => {
      container.innerHTML = "";
    });
  });
});

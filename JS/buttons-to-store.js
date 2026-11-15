
document.addEventListener("DOMContentLoaded", () => {

  const storePage = "./Popups-Webpages/store-checkout.html";

  // Store, Shop Tees, Shop Wallpapers, and Chapter Buy
  document.querySelectorAll("[data-shop]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const category = button.dataset.shop;

      // Identify chapter number when clicking Buy
      let chapter = "";

      if (category === "chapters") {
        const card = button.closest(".chapter-card");

        if (card) {
          chapter = card.querySelector("strong")
            ?.textContent.match(/\d+/)?.[0] || "";
        }
      }

      const params = new URLSearchParams();
      params.set("category", category);

      if (chapter) params.set("chapter", chapter);

      window.location.href = `${storePage}?${params}`;
    });
  });

  // Subscribe popup: Continue to checkout
  document.addEventListener("click", event => {
    const checkoutButton = event.target.closest(
      "#subscribePopup .checkout, .hr-checkout-button"
    );

    if (!checkoutButton) return;

    event.preventDefault();

    window.location.href =
      `${storePage}?category=membership`;
  });

});

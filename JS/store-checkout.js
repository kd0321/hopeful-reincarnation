
document.addEventListener("DOMContentLoaded", () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  // REPLACE THESE WITH YOUR REAL PAYHIP LINKS
  const payhip = {
    membership: "",
    tees: "",
    wallpapers: "",
    chapters: ["", "", ""]
  };

  const checkout = $(".checkout-panel");
  const title = $(".selection-title");
  const price = $(".selection-price");
  const payButton = $(".payhip-button");
  const terms = $("#termsCheckbox");

  let selection = {
    type: "membership",
    name: "Monthly Membership",
    price: "$9.99 / month",
    url: payhip.membership
  };

  // UPDATE CHECKOUT PANEL
  function updateCheckout(type, name, priceText, url) {
    selection = { type, name, price: priceText, url };
    title.textContent = name;
    price.textContent = priceText;

    checkout.querySelector(".included-heading").hidden =
      type !== "membership";

    checkout.querySelector(".checkout-benefits").hidden =
      type !== "membership";

    checkout.querySelector(".renewal").hidden =
      type !== "membership";

    terms.checked = false;
    updateTerms();

    checkout.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  // TERMS AND CHECKOUT
  function updateTerms() {
    const allowed =
      selection.type !== "membership" || terms.checked;

    payButton.style.opacity = allowed ? "1" : ".5";
    payButton.style.cursor = allowed ? "pointer" : "not-allowed";

    payButton.textContent =
      selection.type === "membership"
        ? "Subscribe with Payhip"
        : "Checkout with Payhip";
  }

  terms.addEventListener("change", updateTerms);

  payButton.addEventListener("click", e => {
    e.preventDefault();

    if (selection.type === "membership" && !terms.checked) {
      alert("Please agree to the Terms and recurring billing.");
      return;
    }

    if (!selection.url) {
      alert("Payhip checkout link has not been added yet.");
      return;
    }

    window.location.href = selection.url;
  });

  // MEMBERSHIP SELECTION
  $(".membership-panel").addEventListener("click", () => {
    updateCheckout(
      "membership",
      "Monthly Membership",
      "$9.99 / month",
      payhip.membership
    );
  });

  // TEE AND WALLPAPER SLIDERS
  const productData = {
    tees: [
      { position: "4% 30%", name: "Fantasy Tee 1" },
      { position: "15% 30%", name: "Fantasy Tee 2" },
      { position: "20% 35%", name: "Fantasy Tee 3" },
      { position: "25% 35%", name: "Fantasy Tee 4" }
    ],
    wallpapers: [
      { position: "51% 30%", name: "Wallpaper 1" },
      { position: "57% 30%", name: "Wallpaper 2" },
      { position: "62% 30%", name: "Wallpaper 3" },
      { position: "67% 30%", name: "Wallpaper 4" }
    ]
  };

  ["tees", "wallpapers"].forEach(type => {
    const panel = $(`.${type === "tees"
      ? "tees-panel" : "wallpaper-panel"}`);

    const image = panel.querySelector(".artwork");
    const thumbs = [...panel.querySelectorAll(".thumb")];
    const items = productData[type];
    let index = 0;

    function showItem(i) {
      index = (i + items.length) % items.length;
      image.style.backgroundPosition = items[index].position;

      thumbs.forEach((thumb, n) => {
        thumb.classList.toggle("selected", n === index);
      });
    }

    panel.querySelector(".prev").addEventListener("click", () => {
      showItem(index - 1);
    });

    panel.querySelector(".next").addEventListener("click", () => {
      showItem(index + 1);
    });

    thumbs.forEach((thumb, i) => {
      thumb.style.cursor = "pointer";
      thumb.addEventListener("click", () => showItem(i));
    });

    panel.querySelector(".green-button").addEventListener("click", e => {
      e.preventDefault();

      updateCheckout(
        type,
        items[index].name,
        "View price at checkout",
        payhip[type]
      );
    });
  });

  // CHAPTER SELECTION AND PREVIEW
  const chapterPanel = $(".chapters-panel");
  const chapterItems = $$(".chapter-item");
  let chapterIndex = 0;

  function showChapter(index) {
    chapterIndex = (index + chapterItems.length)
      % chapterItems.length;

    chapterItems.forEach((item, i) => {
      item.style.display = i === chapterIndex
        ? "" : "none";
    });

    const dots = $$(".page-dots span");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === chapterIndex);
    });
  }

  // Keep three chapter covers visible initially.
  // Arrows rotate their order.
  const chapterGallery = $(".chapters-gallery");
  const chapterArrows = chapterGallery.querySelectorAll(".arrow");

  chapterArrows[0].addEventListener("click", () => {
    const items = [...chapterGallery.querySelectorAll(".chapter-item")];
    chapterGallery.insertBefore(
      items[items.length - 1], items[0]
    );
  });

  chapterArrows[1].addEventListener("click", () => {
    const items = [...chapterGallery.querySelectorAll(".chapter-item")];
    chapterGallery.insertBefore(
      items[0], chapterArrows[1]
    );
  });

  chapterItems.forEach((item, i) => {
    const buttons = item.querySelectorAll("button");

    // PREVIEW
    buttons[0].addEventListener("click", () => {
      const preview = window.open(
        `../index.html?chapter=${i + 1}`,
        "_blank"
      );

      if (!preview) {
        alert("Please allow popups to preview chapters.");
      }
    });

    // SELECT
    buttons[1].addEventListener("click", () => {
      chapterItems.forEach(ch => {
        ch.style.outline = "none";
      });

      item.style.outline = "3px solid #00552b";

      updateCheckout(
        "chapter",
        `Chapter ${i + 1}`,
        "$5.99",
        payhip.chapters[i]
      );
    });
  });

  // CHAPTER DOTS
  $$(".page-dots span").forEach((dot, i) => {
    dot.style.cursor = "pointer";

    dot.addEventListener("click", () => {
      const items = [...chapterGallery.querySelectorAll(".chapter-item")];

      if (items.length) {
        chapterGallery.insertBefore(
          items[i % items.length],
          chapterArrows[1]
        );
      }

      $$(".page-dots span").forEach((d, n) => {
        d.classList.toggle("active", n === i);
      });
    });
  });

  // INITIAL CHECKOUT STATE
  updateTerms();
});

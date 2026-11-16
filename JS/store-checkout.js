document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) =>
    [...root.querySelectorAll(s)];

  // ADD YOUR REAL PAYHIP URLS HERE
  const payhip = {
    membership: "",
    tees: {},
    wallpapers: {},
    chapters: {}
  };

  // ADD TEE AND WALLPAPER PRICES WHEN READY
  const prices = {
    membership: 9.99,
    chapters: 5.99,
    tees: null,
    wallpapers: null
  };

  const cart = new Map();

  const panels = {
    tees: $(".tees-panel"),
    wallpapers: $(".wallpaper-panel"),
    chapters: $(".chapters-panel"),
    membership: $(".membership-panel")
  };

  const cartItems = $("#cartItems");
  const totalElement = $("#cartTotal");
  const checkoutButton = $("#checkoutButton");
  const message = $("#checkoutMessage");
  const termsCheckbox = $("#termsCheckbox");

  const money = n =>
    n == null ? "Price at checkout" : `$${n.toFixed(2)}`;

  // PRODUCT CATALOG
  const products = {
    tees: [1, 2, 3, 4].map(n => ({
      id: `tee${n}`,
      name: `Fantasy Tee ${n}`,
      image: `../Images/tees/tee${n}.png`,
      price: prices.tees,
      url: payhip.tees[n] || "",
      type: "tees"
    })),

    wallpapers: [1, 2, 3, 4].map(n => ({
      id: `wallpaper${n}`,
      name: `Wallpaper ${n}`,
      image: `../Images/wallpapers/wallpaper${n}.png`,
      price: prices.wallpapers,
      url: payhip.wallpapers[n] || "",
      type: "wallpapers"
    }))
  };

  // CHAPTERS 1 THROUGH 200
  const chapters = Array.from({ length: 200 }, (_, i) => {
    const n = i + 1;

    return {
      id: `chapter${n}`,
      name: `Chapter ${n}`,
      image: `../Images/chapters/chapter${n}.png`,
      price: prices.chapters,
      url: payhip.chapters[n] || "",
      type: "chapters",
      released: n <= 3
    };
  });

  const membership = {
    id: "membership",
    name: "Monthly Membership",
    price: 9.99,
    url: payhip.membership,
    type: "membership"
  };

  // CART DISPLAY
  function renderCart() {
    cartItems.replaceChildren();

    if (!cart.size) {
      const p = document.createElement("p");
      p.textContent = "No items selected yet.";
      cartItems.append(p);
    }

    for (const item of cart.values()) {
      const row = document.createElement("div");
      row.className = "cart-row";

      const label = document.createElement("span");
      label.textContent = `${item.name} — ${money(item.price)}`;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${item.name}`);

      remove.addEventListener("click", () => toggleItem(item));

      row.append(label, remove);
      cartItems.append(row);
    }

    const allPriced = [...cart.values()].every(
      item => item.price != null
    );

    totalElement.textContent = allPriced
      ? money([...cart.values()].reduce(
          (sum, item) => sum + item.price, 0
        ))
      : "Price at checkout";

    // GREEN HIGHLIGHT FOR SELECTED PANELS
    for (const [type, panel] of Object.entries(panels)) {
      panel.classList.toggle(
        "is-selected",
        [...cart.values()].some(item => item.type === type)
      );
    }

    $$(".chapter-item").forEach(card => {
      const selected = cart.has(card.dataset.productId);
      card.classList.toggle("is-selected", selected);

      const button = $(".small-green", card);
      if (button && !button.disabled) {
        button.textContent = selected ? "Remove" : "Select";
      }
    });

    const hasMembership = cart.has("membership");

    $$(
      ".included-heading, .checkout-benefits, .renewal"
    ).forEach(el => {
      el.hidden = !hasMembership;
    });

    checkoutButton.textContent =
      hasMembership && cart.size === 1
        ? "Subscribe with Payhip"
        : "Checkout with Payhip";

    message.textContent = "";
    updateCheckout();
  }

  function toggleItem(item) {
    if (cart.has(item.id)) {
      cart.delete(item.id);
    } else {
      cart.set(item.id, item);
    }

    termsCheckbox.checked = false;
    renderCart();
  }

  function updateCheckout() {
    checkoutButton.disabled =
      !cart.size || !termsCheckbox.checked;
  }

  termsCheckbox.addEventListener("change", updateCheckout);

  $("#clearCart").addEventListener("click", () => {
    cart.clear();
    termsCheckbox.checked = false;
    renderCart();
  });

  // MEMBERSHIP SELECTION
  panels.membership.addEventListener("click", event => {
    if (event.target.closest("a,button,input")) return;
    toggleItem(membership);
  });

  panels.membership.style.cursor = "pointer";

  // AUTOMATIC TEE AND WALLPAPER SLIDESHOWS
  for (const type of ["tees", "wallpapers"]) {
    const panel = panels[type];
    const items = products[type];
    const hero = $(".artwork img", panel);
    const thumbs = $$(".thumb", panel);

    let current = 0;
    let paused = false;

    function show(index) {
      current = (index + items.length) % items.length;

      hero.src = items[current].image;
      hero.alt = items[current].name;

      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle("selected", i === current);
      });
    }

    $(".prev", panel).addEventListener("click", () => {
      paused = true;
      show(current - 1);
    });

    $(".next", panel).addEventListener("click", () => {
      paused = true;
      show(current + 1);
    });

    thumbs.forEach((thumb, i) => {
      thumb.tabIndex = 0;
      thumb.setAttribute("role", "button");
      thumb.setAttribute("aria-label", `View ${items[i].name}`);

      function choose() {
        paused = true;
        show(i);
      }

      thumb.addEventListener("click", choose);

      thumb.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose();
        }
      });
    });

    // CHANGE SLIDE EVERY 4 SECONDS
    setInterval(() => {
      if (
        !paused &&
        !document.hidden &&
        !$("#galleryModal").open
      ) {
        show(current + 1);
      }
    }, 4000);

    $(".green-button", panel).addEventListener("click", e => {
      e.preventDefault();
      openGallery(type);
    });

    show(0);
  }

  // PRODUCT GALLERY POPUPS
  const galleryModal = $("#galleryModal");

  function openGallery(type) {
    $("#galleryTitle").textContent =
      type === "tees"
        ? "Shop Fantasy Tees"
        : "Shop Wallpapers";

    const grid = $("#galleryGrid");
    grid.replaceChildren();

    for (const item of products[type]) {
      const card = document.createElement("div");
      card.className = "gallery-card";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;

      const name = document.createElement("p");
      name.textContent = item.name;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = cart.has(item.id)
        ? "Remove from cart"
        : "Add to cart";

      button.addEventListener("click", () => {
        toggleItem(item);

        button.textContent = cart.has(item.id)
          ? "Remove from cart"
          : "Add to cart";
      });

      card.append(img, name, button);
      grid.append(card);
    }

    galleryModal.showModal();
  }

  // CLOSE POPUPS
  $$("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
      $(`#${button.dataset.close}`).close();
    });
  });

  // CHAPTER CAROUSEL
  const chapterGallery = $(".chapters-gallery");
  const chapterArrows = $$(".arrow", chapterGallery);
  const chapterCards = $$(".chapter-item", chapterGallery);

  let chapterStart = 0;

  const previewButtons = chapterCards.map(
    card => $(".cream-button", card)
  );

  const selectButtons = chapterCards.map(
    card => $(".small-green", card)
  );

  function renderChapters() {
    chapterCards.forEach((card, slot) => {
      const item = chapters[
        (chapterStart + slot) % chapters.length
      ];

      card.dataset.productId = item.id;

      const img = $(".chapter-cover img", card);
      img.src = item.image;
      img.alt = item.name;

      img.onerror = () => {
        img.onerror = null;
        img.style.visibility = "hidden";
      };

      img.style.visibility = "visible";

      previewButtons[slot].disabled = !item.released;
      selectButtons[slot].disabled = !item.released;

      selectButtons[slot].textContent = cart.has(item.id)
        ? "Remove"
        : "Select";

      card.classList.toggle(
        "is-selected",
        cart.has(item.id)
      );

      previewButtons[slot].onclick = () => {
        window.open(
          `../index.html?chapter=${chapterStart + slot + 1}`,
          "_blank",
          "noopener"
        );
      };

      selectButtons[slot].onclick = () => {
        toggleItem(item);
        renderChapters();
      };
    });

    $$(".page-dots span").forEach((dot, i) => {
      dot.classList.toggle(
        "active",
        i === Math.floor(chapterStart / 3) % 5
      );
    });
  }

  chapterArrows[0].addEventListener("click", () => {
    chapterStart =
      (chapterStart - 3 + chapters.length) % chapters.length;

    renderChapters();
  });

  chapterArrows[1].addEventListener("click", () => {
    chapterStart = (chapterStart + 3) % chapters.length;
    renderChapters();
  });

  $$(".page-dots span").forEach((dot, i) => {
    dot.addEventListener("click", () => {
      chapterStart = i * 3;
      renderChapters();
    });
  });

  // TERMS AND CONDITIONS
  const termsModal = $("#termsModal");
  const termsScroll = $("#termsScroll");
  const acknowledge = $("#acknowledgeTerms");

  let acknowledged = false;

  $("#openTerms").addEventListener("click", () => {
    termsModal.showModal();
  });

  function checkScroll() {
    const reachedBottom =
      termsScroll.scrollTop + termsScroll.clientHeight >=
      termsScroll.scrollHeight - 5;

    if (reachedBottom) {
      acknowledge.disabled = false;
      acknowledge.textContent = "I have read the Terms";
    }
  }

  termsScroll.addEventListener("scroll", checkScroll);

  acknowledge.addEventListener("click", () => {
    if (acknowledge.disabled) return;

    acknowledged = true;
    termsCheckbox.disabled = false;
    termsModal.close();
    termsCheckbox.focus();
  });

  // PAYHIP CHECKOUT
  checkoutButton.addEventListener("click", () => {
    if (
      !cart.size ||
      !termsCheckbox.checked ||
      !acknowledged
    ) return;

    const items = [...cart.values()];

    // MIXED CART REQUIRES A REAL PAYHIP INTEGRATION
    if (items.length > 1) {
      message.textContent =
        "Multiple-product Payhip checkout is not configured yet.";
      return;
    }

    if (!items[0].url) {
      message.textContent =
        `Add the Payhip checkout URL for ${items[0].name} first.`;
      return;
    }

    window.location.assign(items[0].url);
  });

  // READ HOMEPAGE PRODUCT SELECTION
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  if (category === "membership") {
    cart.set(membership.id, membership);
  }

  if (category === "chapters") {
    const number = Number(params.get("chapter"));
    const item = chapters[number - 1];

    if (item?.released) {
      cart.set(item.id, item);
      chapterStart = Math.floor((number - 1) / 3) * 3;
    }
  }

  renderCart();
  renderChapters();
});

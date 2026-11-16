(() => {
  const DELAY = 2000;
  const SIGNUP_URL = ""; // Your email service's form action URL.
  const IMAGE = "Images/wallpapers/wallpapers.png";

  function init() {
    if (document.getElementById("free-wallpaper-popup")) return;

    const style = document.createElement("style");

    style.textContent = `
      #free-wallpaper-popup {
        position: fixed; inset: 0; margin: auto;
        width: min(620px, calc(100vw - 28px));
        max-width: none; max-height: calc(100dvh - 28px);
        overflow-y: auto; box-sizing: border-box;
        padding: 38px 30px 20px;
        border: 6px double #e8c873; border-radius: 24px;
        background: radial-gradient(ellipse at top, #075333, #002719 85%);
        color: #fff1cd; text-align: center;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 14px 55px #0009, inset 0 0 0 3px #998044;
      }

      #free-wallpaper-popup::backdrop {
        background: #0009;
      }

      #free-wallpaper-popup .fw-close {
        position: absolute; top: 7px; right: 13px;
        width: 38px; height: 38px; padding: 0;
        border: 0; background: transparent; color: #ffe4a0;
        font: 36px/1 Georgia, serif; cursor: pointer;
      }

      #free-wallpaper-popup .fw-image {
        display: block; width: 70%; height: 150px;
        margin: 0 auto 18px; object-fit: cover;
        border: 3px double #e8c873; border-radius: 18px;
      }

      #free-wallpaper-popup h2 {
        margin: 0; color: #fff1cd; font-weight: normal;
        font-size: clamp(27px, 5.5vw, 44px); line-height: 1.12;
      }

      #free-wallpaper-popup .fw-rule {
        display: flex; align-items: center; gap: 12px;
        width: 78%; margin: 14px auto; color: #e8c873;
      }

      #free-wallpaper-popup .fw-rule::before,
      #free-wallpaper-popup .fw-rule::after {
        content: ""; flex: 1; height: 1px; background: #e8c873;
      }

      #free-wallpaper-popup .fw-description {
        margin: 0 0 22px;
        font-size: clamp(18px, 3.8vw, 25px);
        font-style: italic; line-height: 1.3;
      }

      #free-wallpaper-popup input,
      #free-wallpaper-popup .fw-send {
        display: block; box-sizing: border-box; width: 100%;
        min-height: 54px; border-radius: 13px; font: inherit;
      }

      #free-wallpaper-popup input {
        padding: 12px 16px; border: 2px solid #ead29e;
        background: #fff1d5; color: #342b1a; font-size: 20px;
      }

      #free-wallpaper-popup .fw-send {
        margin-top: 16px; padding: 12px 8px;
        border: 3px double #f0d18a; background: #07542c;
        color: #fff1cd; font-size: clamp(20px, 4.4vw, 30px);
        cursor: pointer; box-shadow: inset 0 0 15px #c4a44744;
      }

      #free-wallpaper-popup :focus-visible {
        outline: 3px solid #fff1cd; outline-offset: 4px;
      }

      #free-wallpaper-popup .fw-note {
        display: block; margin-top: 12px; font-size: 16px;
        font-style: italic;
      }

      #free-wallpaper-popup .fw-status {
        margin: 12px 0 0; font-size: 17px;
      }

      #free-wallpaper-popup .fw-status:empty {
        display: none;
      }

      @media (max-width: 480px) {
        #free-wallpaper-popup {
          padding: 40px 18px 18px;
        }

        #free-wallpaper-popup .fw-image {
          width: 80%; height: 120px;
        }
      }
    `;

    document.head.append(style);

    const popup = document.createElement("dialog");
    popup.id = "free-wallpaper-popup";
    popup.setAttribute("aria-labelledby", "fw-title");
    popup.setAttribute("aria-describedby", "fw-description");

    popup.innerHTML = `
      <button class="fw-close" type="button"
        aria-label="Close popup">×</button>

      <img class="fw-image" alt="Enchanted fantasy forest">

      <h2 id="fw-title">Get a FREE Wallpaper</h2>

      <div class="fw-rule" aria-hidden="true">❖</div>

      <p id="fw-description" class="fw-description">
        Enter your email to receive a fantasy wallpaper
        for your phone or desktop.
      </p>

      <form method="post">
        <input type="email" name="email"
          placeholder="Your email address"
          aria-label="Your email address"
          autocomplete="email" required>

        <button class="fw-send" type="submit">
          Send My Free Wallpaper
        </button>
      </form>

      <small class="fw-note">
        Free download. Unsubscribe anytime.
      </small>

      <p class="fw-status" role="status"></p>
    `;

    popup.querySelector("img").src = IMAGE;

    const form = popup.querySelector("form");

    if (SIGNUP_URL) form.action = SIGNUP_URL;

    form.addEventListener("submit", event => {
      if (SIGNUP_URL) return;

      event.preventDefault();

      popup.querySelector(".fw-status").textContent =
        "Wallpaper signup is coming soon. Please check back!";
    });

    document.body.append(popup);

    popup.querySelector(".fw-close").addEventListener("click", () => {
      popup.close();
    });

    popup.addEventListener("click", event => {
      const rect = popup.getBoundingClientRect();

      if (event.target === popup && (
        event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom
      )) popup.close();
    });

    const timer = setTimeout(() => {
      if (!document.querySelector("dialog[open]")) popup.showModal();
    }, DELAY);

    document.querySelectorAll("[data-modal]").forEach(button => {
      button.addEventListener("click", () => clearTimeout(timer));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
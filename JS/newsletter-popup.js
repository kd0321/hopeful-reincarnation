(() => {
  // 8 seconds after entering: about 6 seconds after the first popup.
  const DELAY = 8000;

  // Newsletter provider's form URL goes here when ready.
  const SIGNUP_URL = "";

  function initNewsletter() {
    if (document.getElementById("hr-newsletter")) return;

    const style = document.createElement("style");
    style.textContent = `
      #hr-newsletter[hidden] {
        display: none !important;
      }

      #hr-newsletter {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 99998;
        box-sizing: border-box;
        width: min(310px, calc(100vw - 24px));
        max-height: calc(100dvh - 36px);
        overflow-y: auto;
        padding: 32px 22px 20px;
        border: 6px double #e3c779;
        border-radius: 18px;
        background: radial-gradient(ellipse at top, #075331, #002918);
        color: #fff0ce;
        text-align: center;
        font-family: Georgia, "Times New Roman", serif;
        box-shadow: 0 8px 25px #0007,
                    inset 0 0 0 2px #8b6927;
        animation: hr-newsletter-in .3s ease-out;
      }

      #hr-newsletter .hr-newsletter-close {
        position: absolute;
        top: 6px;
        right: 9px;
        width: 32px;
        height: 32px;
        padding: 0;
        border: 0;
        background: transparent;
        color: #fff0ce;
        font: 30px/1 Georgia, serif;
        cursor: pointer;
      }

      #hr-newsletter h2 {
        margin: 0 0 12px;
        color: #fff0ce;
        font-size: 36px;
        line-height: 1.05;
      }

      #hr-newsletter .hr-newsletter-divider {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 15px 0;
        color: #e3c779;
      }

      #hr-newsletter .hr-newsletter-divider::before,
      #hr-newsletter .hr-newsletter-divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: linear-gradient(
          90deg, transparent, #e3c779, transparent
        );
      }

      #hr-newsletter .hr-newsletter-copy {
        margin: 0 0 18px;
        font-size: 21px;
        line-height: 1.25;
        font-style: italic;
      }

      #hr-newsletter input,
      #hr-newsletter .hr-newsletter-submit {
        box-sizing: border-box;
        width: 100%;
        min-height: 46px;
        border-radius: 10px;
        font: 19px Georgia, serif;
      }

      #hr-newsletter input {
        padding: 11px 12px;
        border: 1px solid #d7b86c;
        background: #fff0d6;
        color: #302715;
      }

      #hr-newsletter input::placeholder {
        color: #62543b;
        opacity: 1;
      }

      #hr-newsletter .hr-newsletter-submit {
        margin-top: 12px;
        padding: 10px 6px;
        border: 2px solid #dfc47c;
        background: linear-gradient(#145e37, #00371f);
        color: #fff0ce;
        cursor: pointer;
      }

      #hr-newsletter .hr-newsletter-submit:hover {
        background: #17673e;
      }

      #hr-newsletter :focus-visible {
        outline: 3px solid #ffe2a0;
        outline-offset: 3px;
      }

      #hr-newsletter .hr-newsletter-note {
        margin: 12px 0 0;
        font-size: 15px;
        font-style: italic;
      }

      #hr-newsletter .hr-newsletter-status {
        margin: 10px 0 0;
        font-size: 15px;
      }

      #hr-newsletter .hr-newsletter-status:empty {
        display: none;
      }

      @keyframes hr-newsletter-in {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 480px) {
        #hr-newsletter {
          right: 12px;
          bottom: 12px;
          width: min(280px, calc(100vw - 24px));
          padding: 28px 18px 16px;
        }

        #hr-newsletter h2 {
          font-size: 31px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #hr-newsletter {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);

    const popup = document.createElement("aside");
    popup.id = "hr-newsletter";
    popup.hidden = true;
    popup.setAttribute("aria-labelledby", "hr-newsletter-title");

    popup.innerHTML = `
      <button
        type="button"
        class="hr-newsletter-close"
        aria-label="Close newsletter popup"
      >×</button>

      <h2 id="hr-newsletter-title">
        Join the<br>Newsletter
      </h2>

      <div class="hr-newsletter-divider" aria-hidden="true">❖</div>

      <p class="hr-newsletter-copy">
        New chapters, merch<br>drops &amp; updates.
      </p>

      <form method="post">
        <input
          type="email"
          name="email"
          placeholder="✉ Email address"
          aria-label="Email address"
          autocomplete="email"
          required
        >

        <button type="submit" class="hr-newsletter-submit">
          Join Newsletter
        </button>

        <p class="hr-newsletter-status" role="status"></p>
      </form>

      <p class="hr-newsletter-note">Unsubscribe anytime.</p>
    `;

    document.body.appendChild(popup);

    const form = popup.querySelector("form");
    let previousFocus = null;

    function closePopup() {
      const focusInside = popup.contains(document.activeElement);
      popup.hidden = true;

      if (focusInside && previousFocus?.isConnected) {
        previousFocus.focus();
      }
    }

    popup.querySelector(".hr-newsletter-close")
      .addEventListener("click", closePopup);

    popup.addEventListener("keydown", event => {
      if (event.key === "Escape") closePopup();
    });

    if (SIGNUP_URL) {
      form.action = SIGNUP_URL;
    } else {
      form.addEventListener("submit", event => {
        event.preventDefault();
        popup.querySelector(".hr-newsletter-status").textContent =
          "Signup is temporarily unavailable. Please try again later.";
      });
    }

    window.setTimeout(() => {
      previousFocus = document.activeElement;
      popup.hidden = false;
    }, DELAY);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNewsletter, {
      once: true
    });
  } else {
    initNewsletter();
  }
})();
(() => {
  const slides = [
    {
      selector: ".banner.tees",
      image: ".tee-art img",
      label: "Fantasy tee design",
      files: [
        "Images/tees/tees.png",
        "Images/tees/tees-2.png",
        "Images/tees/tees-3.png"
      ]
    },
    {
      selector: ".banner.wallpapers",
      image: ".wall-art",
      label: "Fantasy wallpaper",
      files: [
        "Images/wallpapers/wallpapers.png",
        "Images/wallpapers/wallpapers-2.png",
        "Images/wallpapers/wallpapers-3.png"
      ]
    }
  ];

  function init() {
    const style = document.createElement("style");

    style.textContent = `
      .merch .tee-art {
        overflow: hidden;
      }

      .merch .slider-track {
        z-index: 4;
        overflow: visible;
      }

      .merch .hr-image-slider {
        position: absolute;
        left: 0;
        top: -11px;
        width: 100%;
        height: 24px;
        margin: 0;
        appearance: none;
        -webkit-appearance: none;
        background: transparent;
        cursor: pointer;
      }

      .hr-image-slider::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 38px;
        height: 14px;
        border-radius: 12px;
        border: 1px solid #b99946;
        background: linear-gradient(#00824b, #004426);
      }

      .hr-image-slider::-moz-range-thumb {
        width: 38px;
        height: 14px;
        border-radius: 12px;
        border: 1px solid #b99946;
        background: linear-gradient(#00824b, #004426);
      }

      .hr-image-slider::-moz-range-track {
        background: transparent;
      }

      .hr-image-slider:focus-visible {
        outline: 2px solid #d8b55d;
      }
    `;

    document.head.appendChild(style);

    const reducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    slides.forEach(({ selector, image, label, files }) => {
      const banner = document.querySelector(selector);
      let currentImage = banner?.querySelector(image);
      const track = banner?.querySelector(".slider-track");

      if (!currentImage || !track || files.length === 0) return;

      let index = 0;
      let busy = false;
      let timer;

      const range = document.createElement("input");
      range.type = "range";
      range.className = "hr-image-slider";
      range.min = "0";
      range.max = String(files.length - 1);
      range.step = "1";
      range.value = "0";
      range.setAttribute("aria-label", `${label} slider`);
      range.setAttribute("aria-valuetext", `1 of ${files.length}`);

      track.replaceChildren(range);

      async function show(nextIndex, direction = 1) {
        if (busy || nextIndex === index) {
          range.value = String(index);
          return;
        }

        busy = true;

        const nextImage = currentImage.cloneNode(false);
        nextImage.removeAttribute("id");
        nextImage.removeAttribute("srcset");
        nextImage.removeAttribute("sizes");
        nextImage.loading = "eager";
        nextImage.src = files[nextIndex];
        nextImage.alt = `${label} ${nextIndex + 1}`;

        try {
          await nextImage.decode();

          Object.assign(nextImage.style, {
            position: "absolute",
            inset: "0",
            margin: "0",
            width: "100%",
            height: "100%"
          });

          currentImage.after(nextImage);

          const options = {
            duration: reducedMotion.matches ? 0 : 400,
            easing: "ease",
            fill: "both"
          };

          const outgoing = currentImage.animate([
            { transform: "translateX(0)" },
            { transform: `translateX(${-direction * 100}%)` }
          ], options);

          const incoming = nextImage.animate([
            { transform: `translateX(${direction * 100}%)` },
            { transform: "translateX(0)" }
          ], options);

          await Promise.all([
            outgoing.finished,
            incoming.finished
          ]);

          currentImage.remove();
          incoming.cancel();

          currentImage = nextImage;
          index = nextIndex;
        } catch {
          nextImage.remove();
          console.warn(
            "Could not load slider image:",
            files[nextIndex]
          );
        } finally {
          range.value = String(index);
          range.setAttribute(
            "aria-valuetext",
            `${index + 1} of ${files.length}`
          );
          busy = false;
        }
      }

      function restartTimer() {
        clearInterval(timer);

        if (files.length < 2) return;

        timer = setInterval(() => {
          if (
            document.hidden ||
            reducedMotion.matches ||
            banner.matches(":hover") ||
            banner.contains(document.activeElement)
          ) return;

          show((index + 1) % files.length);
        }, 4000);
      }

      banner.querySelector(".prev")?.addEventListener("click", () => {
        show((index - 1 + files.length) % files.length, -1);
        restartTimer();
      });

      banner.querySelector(".next")?.addEventListener("click", () => {
        show((index + 1) % files.length);
        restartTimer();
      });

      range.addEventListener("change", () => {
        const nextIndex = Number(range.value);
        show(nextIndex, nextIndex < index ? -1 : 1);
        restartTimer();
      });

      restartTimer();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
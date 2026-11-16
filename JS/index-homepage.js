
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

(() => {
  const select = document.getElementById("chapters");
  if (!select || document.getElementById("hr-chapter-picker")) return;

  // Chapters already listed in your HTML are selectable.
  const available = new Map(
    Array.from(select.options, (option, index) => [
      Number(option.textContent.match(/\d+/)?.[0]), index
    ])
  );

  let selected =
    Number(select.selectedOptions[0]?.textContent.match(/\d+/)?.[0]) || 1;

  const book = `
    <svg viewBox="0 0 28 24" aria-hidden="true">
      <path d="M14 5C10 2 5 2 2 3v16c4-1 8-1 12 2
        4-3 8-3 12-2V3c-3-1-8-1-12 2Zm0 0v16"/>
    </svg>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #hr-chapter-picker {
      position:relative;width:330px;max-width:65%;z-index:5;
      color:#253719;font-family:Georgia,serif;
    }
    #hr-chapter-picker * {box-sizing:border-box}
    #hr-chapter-picker button,
    #hr-chapter-picker input,
    #hr-chapter-picker select {
      font:inherit;letter-spacing:normal;text-transform:none;margin:0;
    }
    #hr-chapter-picker button {cursor:pointer}
    #hr-chapter-picker .hr-trigger {
      width:100%;display:flex;align-items:center;
      justify-content:space-between;gap:16px;padding:7px 18px;
      border:2px solid #7c814c;border-radius:13px;color:#253719;
      background:linear-gradient(#fff9e9,#f1e6ca);
      box-shadow:inset 0 0 0 2px #e8ce8d,0 2px 5px #50350b30;
      font-size:25px;line-height:1.2;
    }
    #hr-chapter-picker .hr-panel {
      position:absolute;top:calc(100% + 14px);left:0;
      width:420px;max-width:calc(100vw - 24px);padding:14px;
      border:3px double #ab813a;border-radius:20px;
      background:linear-gradient(120deg,#fff6dc,#f7e7c8 55%,#fff8e9);
      box-shadow:inset 0 0 0 4px #fff6df,
        inset 0 0 0 6px #d9b56f,0 8px 16px #40290850;
    }
    #hr-chapter-picker .hr-panel[hidden] {display:none}
    #hr-chapter-picker .hr-panel:before {
      content:"";position:absolute;top:-11px;left:38%;
      width:18px;height:18px;transform:rotate(45deg);
      border-left:1px solid #ab813a;border-top:1px solid #ab813a;
      background:#fff2d6;
    }
    #hr-chapter-picker .hr-filters {
      position:relative;display:flex;gap:12px;margin-bottom:13px;
    }
    #hr-chapter-picker .hr-range,
    #hr-chapter-picker .hr-search {
      height:38px;padding:5px 9px;border:1px solid #b69a65;
      border-radius:10px;color:#303422;background:#fffbef;
      box-shadow:inset 0 1px 4px #79551b25;
    }
    #hr-chapter-picker .hr-range {
      width:100px;flex-shrink:0;font-size:18px;
    }
    #hr-chapter-picker .hr-search {
      width:100%;min-width:0;font-size:18px;
    }
    #hr-chapter-picker .hr-search::placeholder {
      font-style:italic;color:#746b58;
    }
    #hr-chapter-picker .hr-list {
      max-height:270px;overflow-y:auto;padding-right:9px;
      scrollbar-width:thin;scrollbar-color:#b58a34 #eee1bd;
    }
    #hr-chapter-picker .hr-list::-webkit-scrollbar {width:9px}
    #hr-chapter-picker .hr-list::-webkit-scrollbar-track {
      background:#eee1bd;border-radius:10px;
    }
    #hr-chapter-picker .hr-list::-webkit-scrollbar-thumb {
      background:#b58a34;border-radius:10px;
    }
    #hr-chapter-picker .hr-row {
      display:flex;align-items:center;gap:14px;width:100%;
      min-height:43px;margin-bottom:5px;padding:7px 14px;
      border:1px solid #cbb994;border-radius:13px;
      background:linear-gradient(#fff6e4,#f5e5c7);
      color:#252819;font-size:23px;line-height:1.15;text-align:left;
    }
    #hr-chapter-picker .hr-row svg {
      width:28px;height:24px;flex-shrink:0;fill:none;
      stroke:#907029;stroke-width:1.5;stroke-linejoin:round;
    }
    #hr-chapter-picker .hr-row[aria-current="true"] {
      color:#fff9dc;border-color:#41763f;
      background:linear-gradient(#08763d,#004a27);
      box-shadow:inset 0 1px 4px #ffffff40;
    }
    #hr-chapter-picker .hr-row[aria-current="true"] svg {
      stroke:#dfc877;
    }
    #hr-chapter-picker .hr-row:disabled {
      cursor:default;color:#77776e;opacity:1;
      background:linear-gradient(#f0ede4,#e4e1d8);
      border-color:#c9c6bb;
    }
    #hr-chapter-picker .hr-row:disabled svg {stroke:#929186}
    #hr-chapter-picker .hr-soon {
      margin-left:auto;white-space:nowrap;
      font-size:18px;font-style:italic;
    }
    #hr-chapter-picker .hr-footer {
      text-align:center;margin-top:9px;
      font-size:19px;font-style:italic;
    }
    #hr-chapter-picker .hr-footer span {
      color:#b38c42;margin:0 12px;
    }
    #hr-chapter-picker .hr-empty {
      padding:20px 8px;text-align:center;
    }
    #hr-chapter-picker :focus-visible {
      outline:3px solid #a77c27;outline-offset:2px;
    }
    @media(max-width:480px) {
      #hr-chapter-picker .hr-trigger {
        font-size:20px;padding:8px 12px;
      }
      #hr-chapter-picker .hr-row {
        font-size:20px;gap:10px;padding:7px 9px;
      }
      #hr-chapter-picker .hr-soon {font-size:15px}
      #hr-chapter-picker .hr-filters {gap:8px}
      #hr-chapter-picker .hr-search {font-size:16px}
    }
  `;
  document.head.append(style);

  const picker = document.createElement("div");
  picker.id = "hr-chapter-picker";
  picker.innerHTML = `
    <button type="button" class="hr-trigger"
      aria-expanded="false" aria-controls="hr-chapter-panel">
      <span class="hr-current">Chapter ${selected}</span>
      <span aria-hidden="true">▾</span>
    </button>
    <div id="hr-chapter-panel" class="hr-panel"
      role="region" aria-label="Choose chapter" hidden>
      <div class="hr-filters">
        <select class="hr-range" aria-label="Chapter range">
          ${Array.from({length:8}, (_, i) => `
            <option value="${i * 25 + 1}">
              ${i * 25 + 1}–${(i + 1) * 25}
            </option>
          `).join("")}
        </select>
        <input class="hr-search" type="search"
          placeholder="Search chapter…"
          aria-label="Search all 200 chapters">
      </div>
      <div class="hr-list" aria-label="Chapters"></div>
      <div class="hr-footer">
        <span aria-hidden="true">❖</span>
        Chapters 1–200
        <span aria-hidden="true">❖</span>
      </div>
    </div>
  `;

  select.before(picker);
  select.style.display = "none";

  const trigger = picker.querySelector(".hr-trigger");
  const panel = picker.querySelector(".hr-panel");
  const range = picker.querySelector(".hr-range");
  const search = picker.querySelector(".hr-search");
  const list = picker.querySelector(".hr-list");

  function render() {
    const searching = Boolean(search.value.trim());
    const query = search.value.trim().toLowerCase()
      .replace(/^chapter\s*/, "");
    const start = Number(range.value);
    range.disabled = searching;

    const chapters = Array.from({length:200}, (_, i) => i + 1)
      .filter(number => {
        if (!searching) return number >= start && number < start + 25;
        return /^\d+$/.test(query)
          ? number === Number(query)
          : `chapter ${number}`.includes(query);
      });

    list.innerHTML = chapters.map(number => `
      <button type="button" class="hr-row" data-chapter="${number}"
        ${number === selected ? 'aria-current="true"' : ""}
        ${available.has(number) ? "" : "disabled"}>
        ${book}
        <span>Chapter ${number}</span>
        ${available.has(number)
          ? ""
          : '<span class="hr-soon">Coming soon</span>'}
      </button>
    `).join("") ||
      '<div class="hr-empty" role="status">No chapters found.</div>';

    list.scrollTop = 0;
  }

  function fitPanel() {
    panel.style.left = "0px";
    const rect = panel.getBoundingClientRect();
    if (rect.right > window.innerWidth - 12) {
      panel.style.left = `${window.innerWidth - 12 - rect.right}px`;
    }
  }

  function close(restoreFocus = false) {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) trigger.focus();
  }

  trigger.addEventListener("click", () => {
    if (!panel.hidden) return close();
    search.value = "";
    range.value = String(Math.floor((selected - 1) / 25) * 25 + 1);
    render();
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    fitPanel();
    search.focus();
  });

  search.addEventListener("input", render);
  range.addEventListener("change", render);

  list.addEventListener("click", event => {
    const row = event.target.closest("button[data-chapter]");
    if (!row || row.disabled) return;
    selected = Number(row.dataset.chapter);
    select.selectedIndex = available.get(selected);
    picker.querySelector(".hr-current").textContent = `Chapter ${selected}`;
    const heading = document.getElementById("chapter-title");
    if (heading) heading.textContent = `Chapter ${selected}`;
    select.dispatchEvent(new Event("change", {bubbles:true}));
    close(true);
  });

  document.addEventListener("click", event => {
    if (!picker.contains(event.target)) close();
  });

  picker.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) {
      event.preventDefault();
      close(true);
    }
  });

  picker.addEventListener("focusout", event => {
    if (!picker.contains(event.relatedTarget)) close();
  });

  window.addEventListener("resize", () => {
    if (!panel.hidden) fitPanel();
  });
})();
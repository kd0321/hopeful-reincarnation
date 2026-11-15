"use strict";

// Replace empty strings with your actual HTTPS links.
const CONFIG = {
  terms: "",
  subscription: "",
  tees: "",
  wallpapers: "",
  socials: {
    Instagram:"", TikTok:"", YouTube:"", X:"", Reddit:"", Discord:"",
    Threads:"", Pinterest:"", "Snapchat Spotlight":"", Tumblr:"", Kickstarter:""
  },
  chapters: [
    { number:1, price:"$5.99", pages:24, checkout:"", preview:[] },
    { number:2, price:"$5.99", pages:24, checkout:"", preview:[] },
    { number:3, price:"$5.99", pages:24, checkout:"", preview:[] }
  ]
};
// Example preview: ["images/chapter-1/page-01.jpg", "images/chapter-1/page-02.jpg"]
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const safe = value => {
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; }
  catch { return null; }
};
const checkout = value => { const url = safe(value); if (url) location.assign(url); };
const show = id => { const dialog = document.getElementById(id); if (!dialog.open) dialog.showModal(); };

$$("[data-modal]").forEach(button => button.onclick = () => show(button.dataset.modal));
$$("dialog").forEach(dialog => {
  dialog.querySelector(".close").onclick = () => dialog.close();
  dialog.onclick = event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (
      event.clientX < r.left || event.clientX > r.right ||
      event.clientY < r.top || event.clientY > r.bottom
    )) dialog.close();
  };
});

const crops = {
  tee:["50 267 630 310", "78 274 375 300", "408 289 276 288"],
  wall:["413 628 567 299", "655 730 258 162", "590 774 68 136"]
};
function slide(name, index) {
  const current = (index + crops[name].length) % crops[name].length;
  $(`#${name}-art`).setAttribute("viewBox", crops[name][current]);
  $(`#${name}-range`).value = current;
}
$$("[data-slide]").forEach(button => button.onclick = () => {
  const [name, direction] = button.dataset.slide.split(":");
  slide(name, Number($(`#${name}-range`).value) + Number(direction));
});
["tee", "wall"].forEach(name => {
  $(`#${name}-range`).oninput = event => slide(name, Number(event.target.value));
});

Object.entries(CONFIG.socials).forEach(([name, value]) => {
  const link = document.createElement("a");
  link.textContent = name;
  const url = safe(value);
  if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; }
  else { link.setAttribute("aria-disabled", "true"); link.title = "Coming soon"; }
  $("#socials").append(link);
});
if (safe(CONFIG.terms)) {
  $("#terms-link").href = safe(CONFIG.terms);
  $("#terms-link").target = "_blank";
  $("#terms-link").rel = "noopener noreferrer";
}
if (safe(CONFIG.subscription)) $("#subscribe-buy").textContent = "Subscribe with Payhip";
$("#agree").onchange = () => {
  $("#subscribe-buy").disabled = !(
    $("#agree").checked && safe(CONFIG.terms) && safe(CONFIG.subscription)
  );
};
$("#subscribe-buy").onclick = () => {
  if ($("#agree").checked && safe(CONFIG.terms)) checkout(CONFIG.subscription);
};

function shop(category) {
  $$(".tabs [data-shop]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.shop === category));
  });
  const items = category === "chapters"
    ? CONFIG.chapters.map(c => ({ title:`Chapter ${c.number}`, price:c.price, url:c.checkout }))
    : [{ title:category === "tees" ? "Fantasy Tees" : "Fantasy Wallpapers", price:"", url:CONFIG[category] }];
  $("#products").replaceChildren();
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "product";
    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const price = document.createElement("span");
    price.textContent = item.price;
    info.append(title, price);
    const button = document.createElement("button");
    button.className = "buy";
    button.textContent = safe(item.url) ? "Buy on Payhip" : "Coming soon";
    button.disabled = !safe(item.url);
    button.onclick = () => checkout(item.url);
    card.append(info, button);
    $("#products").append(card);
  });
  show("shop");
}
$$("[data-shop]").forEach(button => button.onclick = () => shop(button.dataset.shop));
$("#membership").onclick = () => { $("#shop").close(); show("subscribe"); };

let selected = CONFIG.chapters[0], page = 0;
const cover = $("#preview").innerHTML;
for (let number = 1; number <= 200; number++) {
  const option = document.createElement("option");
  const exists = CONFIG.chapters.some(chapter => chapter.number === number);
  option.value = number;
  option.textContent = `Chapter ${number}${exists ? "" : " — Coming soon"}`;
  option.disabled = !exists;
  $("#chapters").append(option);
}
function renderReader() {
  $("#chapter-title").textContent = `Chapter ${selected.number}`;
  $("#counter").textContent = `Page ${page + 1} / ${selected.pages}`;
  $("#back").disabled = page === 0;
  if (selected.preview.length) {
    const image = document.createElement("img");
    image.src = selected.preview[page];
    image.alt = `Chapter ${selected.number}, preview page ${page + 1}`;
    $("#preview").replaceChildren(image);
    $("#preview-label").textContent = "Preview";
  } else {
    $("#preview").innerHTML = cover;
    $("#preview-label").textContent = selected.number === 1 ? "Preview" : "Coming soon";
  }
}
$("#chapters").onchange = event => {
  selected = CONFIG.chapters.find(chapter => chapter.number === Number(event.target.value));
  page = 0;
  renderReader();
};
$("#back").onclick = () => { if (page > 0) { page--; renderReader(); } };
$("#forward").onclick = () => {
  if (page + 1 < selected.preview.length) { page++; renderReader(); }
  else if (safe(selected.checkout)) checkout(selected.checkout);
  else shop("chapters");
};

CONFIG.chapters.forEach(chapter => {
  const card = document.createElement("article");
  card.className = "chapter-card";
  const title = document.createElement("strong");
  title.textContent = `Chapter ${chapter.number}`;
  const price = document.createElement("span");
  price.textContent = chapter.price;
  const buy = document.createElement("button");
  buy.className = "buy";
  buy.textContent = "Buy";
  buy.setAttribute("aria-label", `Buy Chapter ${chapter.number}`);
  buy.onclick = () => safe(chapter.checkout) ? checkout(chapter.checkout) : shop("chapters");
  card.append(title, price, buy);
  $("#chapter-track").append(card);
});
$$("[data-scroll]").forEach(button => button.onclick = () => {
  const track = $("#chapter-track"), direction = Number(button.dataset.scroll);
  const maximum = track.scrollWidth - track.clientWidth;
  const distance = track.firstElementChild.getBoundingClientRect().width +
    parseFloat(getComputedStyle(track).gap);
  let left = track.scrollLeft + direction * distance;
  if (direction > 0 && track.scrollLeft >= maximum - 2) left = 0;
  if (direction < 0 && track.scrollLeft <= 2) left = maximum;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.scrollTo({ left:Math.max(0, Math.min(maximum, left)), behavior:reduced ? "instant" : "smooth" });
});
renderReader();
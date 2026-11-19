import { labels, studies } from "./research-copy.mjs";

const language = document.getElementById("language");
const filter = document.getElementById("topic");
const container = document.getElementById("cards");
let locale = localStorage.getItem("execution-locale") === "zh-CN" ? "zh-CN" : "en";

function line(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function render() {
  const copy = labels[locale];
  document.documentElement.lang = locale;
  document.title = copy.research + " · " + copy.brand;
  document.querySelectorAll("[data-copy]").forEach((item) => { item.textContent = copy[item.dataset.copy]; });
  document.querySelectorAll("[data-label]").forEach((item) => { item.setAttribute("aria-label", copy[item.dataset.label]); });
  language.textContent = locale === "en" ? "简体中文" : "English";
  language.lang = locale === "en" ? "zh-CN" : "en";
  container.replaceChildren();
  for (const [topic, example, en, zh] of studies) {
    if (filter.value !== "all" && topic !== filter.value) continue;
    const [title, finding, limit] = locale === "en" ? en : zh;
    const card = document.createElement("article");
    card.className = "atlas-card";
    card.append(line("p", copy[topic], "atlas-topic"), line("h3", title), line("p", finding));
    const boundary = line("p", limit, "atlas-boundary");
    boundary.prepend(line("strong", copy.boundary + " "));
    card.append(boundary);
    if (example) {
      const link = line("a", copy.examples);
      link.href = "./index.html#" + example;
      card.append(link);
    }
    container.append(card);
  }
}
filter.addEventListener("change", render);
language.addEventListener("click", () => {
  locale = locale === "en" ? "zh-CN" : "en";
  localStorage.setItem("execution-locale", locale);
  render();
});
render();

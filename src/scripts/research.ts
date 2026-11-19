import { labels, studies } from "./research-copy.ts";

const language = document.getElementById("language")!;
const filter = document.querySelector<HTMLSelectElement>("#topic")!;
const container = document.getElementById("cards")!;
let locale: keyof typeof labels = localStorage.getItem("execution-locale") === "zh-CN" ? "zh-CN" : "en";

function line<K extends keyof HTMLElementTagNameMap>(tag: K, text: string, className?: string) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function render() {
  const copy = labels[locale];
  document.documentElement.lang = locale;
  document.title = copy.research + " · " + copy.brand;
  document.querySelectorAll<HTMLElement>("[data-copy]").forEach((item) => { item.textContent = copy[item.dataset.copy as keyof typeof copy]; });
  document.querySelectorAll<HTMLElement>("[data-label]").forEach((item) => { item.setAttribute("aria-label", copy[item.dataset.label as keyof typeof copy]); });
  language.textContent = locale === "en" ? "简体中文" : "English";
  language.lang = locale === "en" ? "zh-CN" : "en";
  container.replaceChildren();
  for (const [topic, example, en, zh] of studies) {
    if (filter.value !== "all" && topic !== filter.value) continue;
    const [title, finding, limit, method] = locale === "en" ? en : zh;
    const card = document.createElement("article");
    card.className = "atlas-card";
    card.append(line("p", copy[topic], "atlas-topic"), line("h3", title), line("p", finding));
    const boundary = line("p", limit, "atlas-boundary");
    boundary.prepend(line("strong", copy.boundary + " "));
    const details = document.createElement("details");
    details.append(line("summary", copy.detail), line("p", method));
    card.append(boundary, details);
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

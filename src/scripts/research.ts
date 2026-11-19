import { labels, studies } from "./research-copy.ts";

const filter = document.querySelector<HTMLSelectElement>("#topic")!;
const container = document.getElementById("cards")!;

function line<K extends keyof HTMLElementTagNameMap>(tag: K, text: string, className?: string) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

export function renderResearch(locale: keyof typeof labels) {
  const copy = labels[locale];
  document.querySelectorAll<HTMLElement>("[data-research-copy]").forEach((item) => {
    item.textContent = copy[item.dataset.researchCopy as keyof typeof copy];
  });
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
      link.href = "#" + example;
      card.append(link);
    }
    container.append(card);
  }
}

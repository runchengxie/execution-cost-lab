import { capacity, cashScenario, costScenario } from "./model.ts";
import { english, chinese } from "./copy.ts";

function get(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element: ${id}`);
  return element;
}

function valueOf(id: string): string {
  const element = get(id);
  if (!(element instanceof HTMLSelectElement) && !(element instanceof HTMLInputElement)) {
    throw new Error(`Expected a form control: ${id}`);
  }
  return element.value;
}
let locale = localStorage.getItem("execution-locale") === "zh-CN" ? "zh-CN" : "en";
let terms: typeof english;
let number: Intl.NumberFormat;
let currency: Intl.NumberFormat;

function copy() {
  terms = locale === "en" ? english : chinese;
  number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  currency = new Intl.NumberFormat(locale, { style: "currency", currency: "CNY", maximumFractionDigits: 0 });
  document.documentElement.lang = locale;
  document.title = terms.brand;
  document.querySelectorAll<HTMLElement>("[data-copy]").forEach((item) => {
    item.textContent = terms[item.dataset.copy as keyof typeof terms];
  });
  document.querySelectorAll<HTMLElement>("[data-label]").forEach((item) => {
    item.setAttribute("aria-label", terms[item.dataset.label as keyof typeof terms]);
  });
  get("language").textContent = locale === "en" ? "简体中文" : "English";
  get("language").lang = locale === "en" ? "zh-CN" : "en";
}

function stat(label: string, value: string) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function bar(label: string, description: string, widths: ReadonlyArray<readonly [string, number]>, details = "") {
  const segments = widths.map(([css, width]) => `<i class="${css}" style="width:${width}%"></i>`).join("");
  return `<div class="bar-row"><div class="bar-caption"><strong>${label}</strong><span>${description}</span></div><div class="track" aria-hidden="true">${segments}</div>${details}</div>`;
}

function displayCash() {
  const data = cashScenario(valueOf("release") === "delayed", valueOf("allocation"));
  const stats = [
    stat(terms.booked, currency.format(data.bookedCash)),
    stat(terms.spendable, currency.format(data.availableCash)),
    stat(terms.gap, `${number.format(data.maxGap)} ${terms.shares}`),
  ].join("");
  const bars = data.targets.map((target, i) =>
    bar(`${terms.order} ${String.fromCharCode(65 + i)}`,
      `${number.format(data.bought[i])} / ${number.format(target)} ${terms.shares}`,
      [["fill", data.bought[i] / target * 100]])).join("");
  get("cashChart").innerHTML = `<div class="stats">${stats}</div>${bars}`;
}

function displayCapacity() {
  const data = capacity(Number(valueOf("size")), parseInt(valueOf("participation"), 10));
  get("capacityChart").innerHTML = data.map((row) =>
    bar(`${row.minutes} ${terms.minutes}`,
      `${number.format(row.filled)} ${terms.shares} · ${number.format(row.coverage)}%`,
      [["fill", row.coverage]])).join("");
}

function displayCost() {
  const matched = valueOf("comparison") === "matched";
  const data = costScenario(matched);
  const max = Math.max(...data.map((row) => row.total));
  const colors = [["fee", "#2d6d56"], ["price", "#79a18d"], ["opp", "#c48548"]] as const;
  const legend = colors.filter(([key]) => !matched || key !== "opp")
    .map(([key, color]) => `<span style="--key:${color}">${terms[key]}</span>`).join("");
  const rows = data.map((row, i) => {
    const widths = colors.map(([key]) => [key, (key === "opp" ? row.opportunity : row[key]) / max * 100] as const);
    const detail = ([[terms.execution, row.execution], ...(!matched ? [[terms.opp, row.opportunity] as const] : [])] as const)
      .map(([label, value]) => `<span>${label} ${currency.format(value)}</span>`).join("");
    return bar(i === 0 ? terms.fast : terms.slow,
      `${number.format(row.shares)} ${terms.shares} · ${terms.total} ${currency.format(row.total)}`,
      widths, `<div class="cost-details">${detail}</div>`);
  }).join("");
  get("costChart").innerHTML = `<div class="legend">${legend}</div>${rows}`;
}

function display() {
  displayCash();
  displayCapacity();
  displayCost();
}

get("language").addEventListener("click", () => {
  locale = locale === "en" ? "zh-CN" : "en";
  localStorage.setItem("execution-locale", locale);
  copy();
  display();
});
for (const id of ["release", "allocation", "size", "participation", "comparison"]) {
  get(id).addEventListener("change", display);
}
copy();
display();

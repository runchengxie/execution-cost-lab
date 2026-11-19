export function cashScenario(delayed: boolean, allocation: string) {
  const targets = [400, 600, 800];
  const opening = 6000;
  const sale = 12000;
  const price = 10;
  const spendable = opening + (delayed ? 0 : sale);
  const budget = Math.min(Math.floor(spendable / price), targets.reduce((a, b) => a + b, 0));
  let bought: number[];
  if (allocation === "proportional") {
    const total = targets.reduce((a, b) => a + b, 0);
    const exact = targets.map((target) => (target * budget) / total);
    bought = exact.map(Math.floor);
    const remainder = budget - bought.reduce((a, b) => a + b, 0);
    const order = exact.map((value, i) => [value - bought[i], i] as const)
      .sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    for (const [, i] of order.slice(0, remainder)) bought[i]++;
  } else {
    let remaining = budget;
    bought = targets.map((target) => {
      const fill = Math.min(target, remaining);
      remaining -= fill;
      return fill;
    });
  }
  const spent = bought.reduce((a, b) => a + b, 0) * price;
  return {
    targets, bought, bookedCash: opening + sale - spent, availableCash: spendable - spent,
    maxGap: Math.max(...targets.map((x, i) => x - bought[i])),
  };
}

export function capacity(order: number, participation: number) {
  const windows = [5, 15, 30];
  const prints = [52000, 104000, 156000];
  return windows.map((minutes, i) => {
    const filled = Math.min(order, Math.floor(prints[i] * participation / 100));
    return { minutes, filled, coverage: 100 * filled / order };
  });
}

export function costScenario(matched: boolean) {
  const orderSize = 10000;
  const routes = [{ filled: 6000, priceBps: 11 }, { filled: 8800, priceBps: 8 }];
  const common = Math.min(...routes.map((route) => route.filled));
  return routes.map((route) => {
    const shares = matched ? common : route.filled;
    const notional = shares * 20;
    const fee = notional * 6 / 10000;
    const price = notional * route.priceBps / 10000;
    const opportunity = matched ? 0 : (orderSize - shares) * 20 * 18 / 10000;
    return { shares, fee, price, opportunity, execution: fee + price, total: fee + price + opportunity };
  });
}

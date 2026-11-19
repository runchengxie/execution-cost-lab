import test from "node:test";
import assert from "node:assert/strict";
import { capacity, cashScenario, costScenario } from "../src/scripts/model.ts";

test("cash allocation conserves available money and respects all targets", () => {
  for (const delayed of [false, true]) {
    for (const allocation of ["priority", "proportional"]) {
      const result = cashScenario(delayed, allocation);
      assert.equal(result.bought.reduce((a, b) => a + b, 0), delayed ? 600 : 1800);
      assert.ok(result.bought.every((value, i) => value <= result.targets[i]));
      assert.equal(result.bookedCash - result.availableCash, delayed ? 12000 : 0);
    }
  }
  assert.ok(cashScenario(true, "proportional").maxGap < cashScenario(true, "priority").maxGap);
});

test("capacity never exceeds demand and grows with time or participation", () => {
  assert.deepEqual(capacity(10000, 5).map((x) => x.filled), [2600, 5200, 7800]);
  assert.ok(capacity(3000, 10).every((x) => x.coverage === 100));
});

test("matching fill quantity isolates executed cost from missed demand", () => {
  const full = costScenario(false);
  const matched = costScenario(true);
  assert.ok(full[1].execution > full[0].execution);
  assert.ok(matched[1].execution < matched[0].execution);
  assert.ok(matched.every((x) => x.shares === 6000 && x.opportunity === 0));
});

## How much did the trade cost?

Fix the decision reference before measuring the outcome. Separate **direct fees**, **signed execution-price differences** on fills, and **opportunity cost** on unfilled shares marked at a common terminal time.

Use +1 for buys and −1 for sells. Let q be filled shares, Q requested shares, P average fill price, B the decision reference, and T the terminal mark. Implementation shortfall is `fees + side × q × (P − B) + side × (Q − q) × (T − B)`. With multiple fills, compute the price term fill by fill. For a basket, sum currency amounts before converting to basis points against a consistent reference notional.

| Item | Synthetic buy | Synthetic sell |
| --- | ---: | ---: |
| Requested / filled shares | 1,000 / 700 | 1,000 / 700 |
| Reference / fill / terminal prices | CNY 20.00 / 20.02 / 20.05 | CNY 20.00 / 20.02 / 20.05 |
| Direct fees | CNY 8 | CNY 8 |
| Execution-price difference | +CNY 14 | −CNY 14 |
| Opportunity cost | +CNY 15 | −CNY 15 |
| Total implementation shortfall | **+CNY 37** | **−CNY 21** |

A negative cost is favorable relative to the reference. In the sell example, the unfinished shares appreciated by the terminal mark. To reconcile fees, match fill notionals, rates, charge types, minimums and rounding. A simulated ledger with an aggregate rate can establish the arithmetic under that rate.

## Why can a longer window look more expensive?

Look at **cost per share**, **shares filled**, and **what happened to the unfilled shares**. An extended schedule can send smaller slices while leaving the remaining order exposed to price movement for longer.

| Same synthetic 10,000-share buy | Rapid route | Extended route |
| --- | ---: | ---: |
| Shares filled | 6,000 | 8,800 |
| Fees and execution-price difference | CNY 204.00 | CNY 246.40 |
| Opportunity cost | CNY 144.00 | CNY 43.20 |
| Total cost | CNY 348.00 | CNY 289.60 |
| Fees and price difference at 6,000 shares each | CNY 204.00 | CNY 168.00 |

These are the homepage model’s inputs. The extended route pays more on its actual fills but also does more of the order. In a historical comparison, preserve fill order and truncate to a common share count with the same reference. Keep the full-order comparison alongside it. A signed price difference includes market movement, so evaluate own impact separately.

## How to compare the first 30 and 60 seconds

Separate the auction uncross from continuous-session arrival. Auction prints describe observed turnover. Estimating what added orders would receive requires arrival, limit price and allocation information. For continuous trading, compare an immediate start, a 30-second wait and a 60-second wait.

| Comparison | What stays fixed | What it answers |
| --- | --- | --- |
| Common deadline | For example, stop at 09:35 on every route | Is waiting worthwhile when the plan has a fixed cutoff? |
| Equal duration | Give each route five minutes | How much is lost from missing early liquidity at equal execution time? |
| Triggered wait or cancel-reprice | Original demand, deadline and terminal mark | Does waiting for a price or depth condition change fills and cost? |

A trigger can use only quotes available at the decision. Record orders whose trigger never fired and what happens at timeout. For passive posting, a book touching the limit does not establish a fill ahead of the resting queue. Report completion, matched execution cost and opportunity cost separately.

## From book capacity to basket capacity

One simple proxy multiplies observed volume by a participation cap. In the homepage example, 52,000 printed shares at 5% allow 2,600 shares in five minutes. That budget covers 65% of a 4,000-share order and 26% of a 10,000-share order. In time-ordered replay, apply the limit, available depth and accrued volume budget at each decision. Future prints are unavailable to the order.

When scaling a basket, hold its demand mix and execution rule fixed. Track buy and sell completion, days when both sides reach the threshold, and terminal position gaps. Weight filled and requested shares with the same reference prices. For resizing, retain **completion of the original plan**. Filling 7,600 out of a resized 8,000 is 95%, while it delivers 76% of the original 10,000.

Compare a fixed early stop, conditional extension and a fixed late stop. Checking both sides exposes buy or sell backlogs hidden by a pooled ratio. Cash, sellable inventory and terminal positions all matter. An average can also hide one severely incomplete session.

## Shared cash, inventory and order priority

After each sale, update booked cash, available cash and pending proceeds. Check spendable cash before each buy and sellable quantity before each sell. A longer window can reach a pending release, while inventory depends on available holdings.

| Synthetic account with room for 600 shares | Requested | Fixed sequence | Proportional |
| --- | ---: | ---: | ---: |
| A | 400 | 400 | 133 |
| B | 600 | 200 | 200 |
| C | 800 | 0 | 267 |
| Total | 1,800 | 600 | 600 |
| Largest single-order gap | | **800 shares** | **533 shares** |

The homepage model allocates individual shares and distributes the remainder after rounding. To measure weight gaps, value residuals at the same reference marks and divide by account equity. With cash available to cover all executable buys, fixed, proportional and largest-gap priority can agree. Distinguishing the rules requires genuinely cash-constrained cases while keeping displayed liquidity as a separate limit.

## L2 replay and own impact

Replay order-book updates, trades and account events in availability order. Audit timestamps, duplicates, gaps and session boundaries. Specify whether the simulation sweeps visible depth, infers queue depletion from prints, or does both. Shared simulated orders should not consume the same displayed liquidity twice.

| Parameter | What to record |
| --- | --- |
| Clock | Exchange and strategy-available times, submission and cancel delays |
| Aggressive orders | Depth levels swept, price guard and depth consumption |
| Passive orders | Queue ahead, cancel allocation and fills at the same price |
| Volume budget | Observed lookback volume, participation and unused budget carry |
| Own impact | Separate size or participation scenarios and changes in route ranking |

Historical replay measures available liquidity under order and queue assumptions. Simulated orders cannot change the historical record. Own-impact calibration needs linked live submissions, executions and market observations, with controls for the market’s own movement. A public impact scenario shows sensitivity to the assumption.

## Multiple routes, non-convex search and new evidence

Freeze the demand, information set, reference and terminal mark before comparing routes. Search over opening delays, participation schedules, repricing and stop thresholds. Lot sizes, price guards and completion thresholds can cause discontinuities. Use finite grids or multiple starting points to assess stability and retain simple baselines such as immediate execution and fixed windows.

| Evidence | What it answers | What is still needed |
| --- | --- | --- |
| Synthetic cases | Whether calculation and account constraints behave as designed | Historical observations and tradable demand |
| Previously inspected sessions | What could explain residuals and which assumptions matter | Independent dates and representative account inputs |
| Sessions after the rule freeze | Whether the candidate carries over to later available data | A longer sample and calibration against executions |

Record eligibility, comparison routes, thresholds and missing-input handling before new sessions. Preserve fill size, fees, signed price cost, opportunity cost, unfilled demand and coverage in the results. A trade date and a simulated fill do not establish when a signal was available or reveal every order in the original plan.

# Bargain Blitz — Game Design Document

> **Game #5 of Synapse**
> Skill area: **Mental Math · Percentage Estimation · Speed Decision-Making · Visual Scanning**
> Status: Ready (planned for Phase 2 release)

---

## 1. Concept

A 4×5 shelf is stocked with **20 items**, each tagged with a **full price** (white) and a **reduced price** (red). The player must shop *only* the items whose reduced price beats the round's discount criteria — for example, *"Pick items under 50% of full price."*

Click an item:
- If it satisfies the criteria → it slides into the **right column ("Cart")** as a correct pick.
- If it doesn't → it slides into the **left column ("Returns")** as a wrong pick.

Round 1 is gentle (50% threshold, easy round numbers). Subsequent rounds tighten the threshold and randomize prices to force real mental-math estimation. The whole session runs against a **5-minute timer** and as many rounds as the player can clear.

Bargain Blitz trains:
- **Percentage estimation** — "is 178 less than 25% of 799?"
- **Mental ratio comparison** — quick benchmarking of price ratios under time pressure.
- **Visual scanning** — finding the qualifying items fast in a crowded shelf.
- **Inhibition control** — resisting the urge to click "obvious" sale items that don't actually meet the threshold.

---

## 2. Core Game Rules

### 2.1 Shelf

- **4 rows × 5 columns = 20 cells**, each holding one item.
- Each cell shows:
  - The item icon/illustration in the center
  - The item's **full price** in white in the top-left
  - The item's **reduced price** in red just below the full price
  - A small strikethrough line on the full price for clarity

Items disappear from the shelf as soon as they're clicked (move to a side list).

### 2.2 Item Pool

- **40 unique items** are defined in code (emoji or simple SVG illustrations covering food, apparel, electronics, home goods, toys, books, etc.).
- Each round draws **20 randomly chosen items** from the pool of 40 (no duplicates within a round).

### 2.3 Round Criteria

A **big banner** at the top of the screen displays the active criterion in large text, e.g.:

> ### 🛒 Pick items where reduced price is **< 50%** of full price

The session is capped at **5 rounds**:

| Round | Threshold |
|-------|-----------|
| **Round 1** | `< 50%` (fixed, gentle introduction) |
| **Rounds 2 – 5** | randomly chosen each round from `{ <25%, <20% }`, never the same as the previous round |

Mathematically, an item *passes* if `reduced_price < threshold_pct × full_price`.

### 2.4 Click Logic

| Click target | Outcome |
|--------------|---------|
| Item that **passes** the criterion | +1 score, streak +1, item slides to **right (Cart) list**, top-to-bottom order |
| Item that **fails** the criterion | 0 score (no penalty), streak resets to 0, item slides to **left (Returns) list**, top-to-bottom order |

There is a single difficulty mode — wrong picks never deduct points; they only break the streak and crowd the Returns column. The two side lists keep growing during the round and reset between rounds. Both are scrollable if they overflow.

### 2.5 Round End

A round ends when **either** of:
- The player taps the **NEXT ROUND** button (always visible bottom-right). Unclicked items are discarded with no score impact.
- All 20 items have been clicked.

Then a 1.0 s transition shows the round summary (correct, wrong, accuracy, total score) and a fresh round begins.

### 2.6 Game End

The session ends when **either** of:

- The player completes (or skips with NEXT ROUND) **all 5 rounds** — the End Screen appears with the title *"All 5 rounds complete!"*.
- The **5:00 countdown timer** hits `0:00` — the current round is interrupted and the End Screen appears with the title *"Time's up."*.

---

## 3. Pricing Rules

All prices are **integers**. Every shelf has **exactly 5 passing items** out of 20 (a fixed ratio rather than a random spread), so the player always knows the target count.

### Rounds 1 – 3 (clean mental math)
- Full price ∈ `[50, 500]` for round 1, `[10, 999]` for rounds 2 – 3.
- **Last digit must be 0 or 5** (multiples of 5) — keeps quick percentage math tractable: 25% of 240 is 60, 20% of 75 is 15, etc.

### Rounds 4 – 5 (general)
- Full price ∈ `[10, 999]`.
- No last-digit restriction.

### Reduced-price generation

The 20 slots are pre-assigned: **5 pass**, **15 fail**, then shuffled. For each slot the full price is generated first (with the lower bound bumped if needed so the cutoff supports a passing reduced price), then the reduced price is drawn from the matching half-range:

```text
PASSERS_PER_ROUND = 5
passFlags = shuffle([true]*5 + [false]*15)

for i in 0..19:
    wantPass = passFlags[i]
    full     = randomFullPrice(round, threshold, wantPass)
    cutoff   = floor((threshold/100) * full)
    if wantPass:
        reduced = randInt(1, max(1, cutoff - 1))         // strictly < threshold * full
    else:
        reduced = randInt(max(cutoff, 1), full - 1)      // ≥ threshold * full, < full
```

`randomFullPrice` ensures `cutoff ≥ 2` for passing slots (by bumping the lower bound to `ceil(200 / threshold%)`) so a valid passing reduced price always exists.

---

## 4. Scoring

| Action | Points |
|--------|--------|
| Correct pick (item passes, player clicked) | **+1** |
| Wrong pick (item fails, player clicked) | 0 (no penalty; resets streak) |
| Skip an item (never clicked) | 0 |
| Round-clear bonus: clicked every passing item, no wrong picks | **+3** |
| Time bonus at game end (1 pt per 5 s remaining) | up to +60 |

There is one mode — wrong picks never subtract points; the only consequence is a broken streak and a more crowded Returns column.

---

## 5. Timer

- Single **5:00 countdown** spans all rounds.
- Pauses during round-summary transitions (~1 s) and player pause.
- Turns **red below 0:30**, pulses below 0:10.

---

## 6. Controls

| Input | Action |
|-------|--------|
| Click / tap item cell | Buy that item (correct or wrong) |
| Click **NEXT ROUND** | Skip the remaining items and load the next round |
| Click **Hint: On / Off** | Toggle the breakeven-price hint pill on each shelf cell — see §7 |
| Click **End at this point** | End-confirm modal: *"End the run? Your current score will be saved."* On confirm, the in-flight round is finalized and the End screen appears |

There are no keyboard shortcuts. There is no Pause or Reset button.

---

## 7. UI Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [ ← Back ]   Synapse · Bargain Blitz       ⏱ 03:42      ⛔ Reset    │
├─────────────────────────────────────────────────────────────────────┤
│         🛒  PICK ITEMS UNDER  25%  OF FULL PRICE                    │
│              Round 4    Score 12    Streak ✱ ✱                      │
├─────────────────────────────────────────────────────────────────────┤
│ ✗ RETURNS │                  SHELF                  │ ✓ CART        │
│           │  ┌─────┬─────┬─────┬─────┬─────┐        │               │
│ 1. 🥖 80  │  │ ̶8̶0̶ │ ̶2̶0̶0̶│ ̶3̶5̶0̶│ ̶6̶0̶ │ ̶1̶2̶0̶│        │ 1. 📷 -85%   │
│   →62     │  │ 🥖  │ 🍕  │ 👕  │ 🧦  │ 📱  │        │ 2. 👟 -78%   │
│           │  │ 62  │ 90  │ 45  │ 12  │ 95  │        │ 3. 🧥 -82%   │
│ 2. 🍕 200 │  ├─────┼─────┼─────┼─────┼─────┤        │ 4. 🪑 -90%   │
│   →90     │  │ ̶6̶8̶0̶│ ̶4̶5̶0̶│ ̶3̶3̶ │ ̶8̶8̶0̶│ ̶7̶7̶0̶│        │               │
│           │  │ 💻  │ 🎧  │ 🍎  │ 🛏️  │ 🧥  │        │               │
│           │  │ 220 │ 110 │ 8   │ 580 │ 75  │        │               │
│           │  ├─────┼─────┼─────┼─────┼─────┤        │               │
│           │  │ ... │ ... │ ... │ ... │ ... │        │               │
│           │  └─────┴─────┴─────┴─────┴─────┘        │               │
├─────────────────────────────────────────────────────────────────────┤
│                              [ ▶ NEXT ROUND ]                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Visual states

| Element | Default | On click |
|---------|---------|----------|
| Item cell | translucent indigo card · item icon · price tags in top-left | flash green if correct / red if wrong, then slide-out animation |
| Full-price pill | **black text on white** (no strikethrough), top-left | — |
| Reduced-price pill | **red text on white**, same font size as full price, in a horizontal row directly below the full price | — |
| Hint pill *(hint mode only)* | **gold text on amber**, sits to the right of the reduced-price pill in the same row, showing the breakeven full price `reduced × (100 / threshold%)`. Compare to the full-price pill: full > hint → it's a deal. | — |
| Cart list (right) | green-tinted list, growing top-to-bottom | new entry slides in from shelf |
| Returns list (left) | red-tinted list, growing top-to-bottom | new entry slides in from shelf |
| Criteria banner | huge gradient text at top | pulses gently for 0.6 s when round changes |

### Cart and Returns list rows
Each row shows:
`<icon> <full-price strikethrough> → <reduced-price>` plus the discount % so the player can review their picks.

---

## 8. End-of-Game Screen

Displays:
- **Final score**
- **Rounds played**
- **Per-round table** (round #, threshold, correct, wrong, score)
- **Overall accuracy %**
- **Best streak** (consecutive correct picks)
- Buttons: **Play Again** · **Back to Hub** · **Share Score**

---

## 9. Data Logging

Every session is captured for analysis. JSON shape:

```json
{
  "session_id": "uuid-v4",
  "user_id": "anonymous-or-userId",
  "game": "bargain-blitz",
  "started_at": "2026-05-06T14:00:00.000Z",
  "ended_at":   "2026-05-06T14:05:01.230Z",
  "ended_reason": "timeout | reset | quit",
  "duration_ms": 301230,
  "final_score": 23,
  "rounds_played": 7,
  "total_correct": 27,
  "total_wrong":   4,
  "rounds": [
    {
      "round_no": 1,
      "threshold_pct": 50,
      "started_at":   "2026-05-06T14:00:00.000Z",
      "ended_at":     "2026-05-06T14:00:38.412Z",
      "duration_ms":  38412,
      "shelf": [
        { "slot": 1, "item": "🥖", "full": 80,  "reduced": 62 },
        { "slot": 2, "item": "🍕", "full": 200, "reduced": 90 }
        /* …20 items */
      ],
      "actions": [
        { "ts": "2026-05-06T14:00:04.123Z", "slot": 2, "passed": true,  "result": "correct" },
        { "ts": "2026-05-06T14:00:06.881Z", "slot": 1, "passed": false, "result": "wrong"  }
        /* …one entry per click */
      ],
      "skipped_slots": [3, 5, 11, 14, 19, 20]
    }
    /* …more rounds */
  ]
}
```

### Captured fields summary

| Field | Description |
|-------|-------------|
| `started_at` / `ended_at` | ISO timestamps for the session |
| `ended_reason` | `timeout` · `reset` · `quit` |
| `rounds[].threshold_pct` | The discount threshold used (10, 20, 25, or 50) |
| `rounds[].shelf` | The 20 items + their full and reduced prices |
| `rounds[].actions` | Each click with timestamp, slot, whether the item passed, and correct/wrong outcome |
| `rounds[].skipped_slots` | Items the player never clicked |

### Storage

- **Phase 1 (MVP):** `localStorage` under key `bargainBlitz.sessions[]`, capped at 20 entries.
- **Phase 2:** POST to `/api/v1/sessions` once user accounts ship.

---

## 10. End-at-this-point Behavior

- Clicking **End at this point** opens a confirmation modal: *"End the run? Your current score will be saved."*
- On confirm, the current session is finalized with `ended_reason: "quit"` and persisted, then the End screen is shown.
- To start fresh, click **Play Again** on the End screen.

---

## 11. Algorithm

### 11.1 Threshold for the round

```text
function pickThreshold(roundNo, prev):
    if roundNo == 1:
        return 50                          // fixed, gentle intro
    // Rounds 2 – 5 (the cap): alternate between 25 and 20, never repeating prev.
    pool     = [25, 20]
    return choose(pool excluding prev)
```

### 11.2 Generating one shelf (20 items, exactly 5 passing)

```text
function generateShelf(roundNo, threshold):
    items     = sampleWithoutReplacement(POOL_OF_40_ITEMS, count = 20)
    passFlags = shuffle([true]*5 + [false]*15)        // exactly 5 passers, shuffled
    shelf     = []
    for i in 0..19:
        wantPass = passFlags[i]
        full     = randomFullPrice(roundNo, threshold, wantPass)
        reduced  = randomReducedPrice(full, threshold, wantPass)
        shelf.push({ item: items[i], full, reduced, passes: wantPass })
    return shelf

function randomFullPrice(roundNo, threshold, wantPass):
    if roundNo == 1:    lo, hi = 50, 500
    else if roundNo<=3: lo, hi = 10, 999
    else:               lo, hi = 10, 999
    if wantPass:
        // Need cutoff ≥ 2 so randInt(1, cutoff - 1) is valid.
        lo = max(lo, ceil(200 / threshold))
    if roundNo <= 3:
        // Multiples of 5 only (last digit 0 or 5).
        lo5 = ceilToMultipleOf5(lo); hi5 = floorToMultipleOf5(hi)
        return lo5 + 5 * randInt(0, (hi5 - lo5) / 5)
    return randInt(lo, hi)

function randomReducedPrice(full, threshold, wantPass):
    cutoff = floor((threshold / 100) * full)
    if wantPass:
        return randInt(1, max(1, cutoff - 1))
    else:
        lo = max(cutoff, 1); hi = max(lo, full - 1)
        return randInt(lo, hi)
```

### 11.3 Click evaluation

```text
function onClick(slot, threshold):
    cell    = shelf[slot]
    passed  = cell.reduced < (threshold / 100) * cell.full

    if passed:
        score  += 1
        streak += 1
        moveToCart(cell)
        log(slot, "correct")
    else:
        streak = 0                       // wrong picks reset the streak; no score penalty
        moveToReturns(cell)
        log(slot, "wrong")
```

### 11.4 Hint mode

When **Hint** is on, each shelf cell renders a third gold pill (`reduced × (100 / threshold%)`) to the right of the reduced price. This is the breakeven full price — the player picks an item iff `full > hint`.

For the four thresholds in play, the multipliers are clean integers: **50% → ×2**, **25% → ×4**, **20% → ×5**. Toggling the button mid-round patches existing cells in place rather than rebuilding the shelf, so click animations and cleared cells are preserved. Preference persists to `localStorage["bargainBlitz.hintMode"]`.

---

## 12. Implementation Notes

- Pure HTML + CSS + vanilla JS. File: `games/bargain-blitz.html`.
- Use CSS Grid for the 4×5 shelf and Flexbox for the side lists.
- Item icons can be Unicode emoji (no external assets) or SVGs swapped in later for visual polish.
- Slide-out animation for the clicked item: a brief `transform: translateX` + `opacity` transition (~300 ms) before the cell is hidden.
- Score updates are immediate (no delay) so players get crisp feedback per click.
- Keep a fixed pool of 40 items in `POOL` constant; a random subset of 20 is drawn each round (`Fisher-Yates`).
- Avoid using prices where reduced ≥ full (always reduce); the generator above handles this.
- Session JSON written to `localStorage` under `bargainBlitz.sessions`, capped at 20 entries.

---

## 13. Variants & Future Enhancements

- **Strict mode:** miss any qualifying item → -1 at round end (forces full scan).
- **Reverse mode:** the criterion flips to *"items NOT meeting the discount"* — find the rip-offs.
- **Multi-criteria mode:** combine percentage and absolute price (*"under 25% off AND under $100"*).
- **Story mode:** themed shelves (Black Friday, Pharmacy, Tech Sale) with corresponding item icons.
- **Currency variation:** randomize between $, ¥, ฿, € etc. — number magnitudes change.
- **Shopping list mode:** a target list of categories must be filled (must include 1 food, 2 apparel, etc.) on top of the discount criterion.
- **Adaptive difficulty:** the threshold tightens after each consecutive perfect round.

---

*Document version: 1.0 — Last updated: May 2026*

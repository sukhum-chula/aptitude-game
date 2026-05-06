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

| Round | Threshold |
|-------|-----------|
| **Round 1** | `< 50%` (fixed, gentle introduction) |
| **Rounds 2 – 5** | randomly chosen each round from `{ <25%, <20% }` |
| **Rounds 6+** | randomly chosen each round from `{ <50%, <25%, <20%, <10% }` |

Mathematically, an item *passes* if `reduced_price < threshold_pct × full_price`.

### 2.4 Click Logic

| Click target | Outcome |
|--------------|---------|
| Item that **passes** the criterion | +1 score, item slides to **right (Cart) list**, top-to-bottom order |
| Item that **fails** the criterion | -1 score (or 0 in Casual mode — see §7), item slides to **left (Returns) list**, top-to-bottom order |

The two side lists keep growing during the round and reset between rounds. Both are scrollable if they overflow.

### 2.5 Round End

A round ends when **either** of:
- The player taps the **NEXT ROUND** button (always visible bottom-right). Unclicked items are discarded with no score impact.
- All 20 items have been clicked.

Then a 1.0 s transition shows the round summary (correct, wrong, accuracy, total score) and a fresh round begins.

### 2.6 Game End

The session ends when the **5:00 countdown timer** hits `0:00`. The current round is interrupted; the End Screen appears.

---

## 3. Pricing Rules

All prices are **integers**.

### Round 1 (introductory, easy mental math)
- Full price ∈ `[50, 500]`
- Last digit ∈ `{0, 2, 4, 5, 6, 8}` (i.e., 0, 5, or even — never 1, 3, 7, 9)
- This ensures clean halves: 80, 100, 250, 460, etc.
- Reduced price chosen so that roughly half of the 20 items pass the < 50 % threshold.

### Round 2 onward (general)
- Full price ∈ `[10, 999]`
- No last-digit restriction
- Reduced price chosen so that roughly **40 – 60 %** of the 20 items pass the round's threshold (see §10 for the generation algorithm).

### Reduced-price generation

For each item, given the round threshold `T` (e.g., 0.25):

```text
shouldPass   = randBool(p = 0.5)            // ~50% mix per round
if shouldPass:
    reduced = randInt(1, floor(T * full) - 1)
else:
    reduced = randInt(ceil(T * full), full - 1)
```

This guarantees a healthy mix of pass/fail items every round, so the player can't shortcut by always clicking everything or always skipping.

---

## 4. Scoring

| Action | Points |
|--------|--------|
| Correct pick (item passes, player clicked) | **+1** |
| Wrong pick (item fails, player clicked) | **-1** *(Standard)* / 0 *(Casual)* |
| Skip an item (never clicked) | 0 |
| Round-clear bonus: clicked every passing item, no wrong picks | **+3** |
| Time bonus at game end (1 pt per 5 s remaining) | up to +60 |

**Casual** difficulty sets wrong-pick penalty to 0 to lower the stakes for new players.

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
| `Enter` / Space | Press NEXT ROUND |
| `R` key | Reset (with confirmation modal) |
| `P` key | Pause (timer + freeze) |

A **NEXT ROUND** button, **Reset**, and **Pause** live on the HUD.

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
| Item cell | translucent indigo card · item icon · prices in top-left | flash green if correct / red if wrong, then slide-out animation |
| Full price | small white text with strikethrough | — |
| Reduced price | small bright red text below full price | — |
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

## 10. Reset Behavior

- Clicking **Reset** (or pressing `R`) opens a confirmation modal: *"Reset the game? Your progress will be lost."*
- On confirm, the current session is finalized with `ended_reason: "reset"` and saved; a fresh `session_id`, fresh round 1 shelf, and 5:00 timer begin.

---

## 11. Algorithm

### 11.1 Threshold for the round

```text
function pickThreshold(roundNo):
    if roundNo == 1:
        return 50
    if roundNo <= 5:
        return choose([25, 20])
    return choose([50, 25, 20, 10])
```

### 11.2 Generating one shelf (20 items)

```text
function generateShelf(roundNo, threshold):
    items = sampleWithoutReplacement(POOL_OF_40_ITEMS, count = 20)
    shelf = []
    for item in items:
        full    = randomFullPrice(roundNo)
        reduced = randomReducedPrice(full, threshold)
        shelf.push({ item, full, reduced })
    return shelf

function randomFullPrice(roundNo):
    if roundNo == 1:
        loop:
            p = randInt(50, 500)
            if lastDigitIn(p, [0, 2, 4, 5, 6, 8]):
                return p
    else:
        return randInt(10, 999)

function randomReducedPrice(full, threshold):
    cutoff      = floor((threshold / 100) * full)
    shouldPass  = randBool(p = 0.5)
    if shouldPass:
        return randInt(1, max(1, cutoff - 1))
    else:
        return randInt(min(cutoff, full - 1), full - 1)
```

### 11.3 Click evaluation

```text
function onClick(slot, threshold):
    cell    = shelf[slot]
    passed  = cell.reduced < (threshold / 100) * cell.full

    if passed:
        score += 1
        moveToCart(cell)
        log(slot, "correct")
    else:
        score -= 1                     // 0 in Casual mode
        moveToReturns(cell)
        log(slot, "wrong")
```

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

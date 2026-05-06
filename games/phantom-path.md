# Phantom Path — Game Design Document

> **Game #11 of Synapse**
> Skill area: **Pattern Recognition · Forecasting · Visual Tracking · Statistical Inference**
> Status: Locked (planned for Phase 3 release)

---

## 1. Concept

A ghostly **phantom monster** appears at the top of a 10×10 grid and descends one row per second. Its horizontal (X) position drifts according to a hidden pattern — anchor + variance — leaving behind a glowing trail that gradually fades after 10 seconds.

When the phantom exits the bottom of the grid (row 10), the player must predict its **next landing column** on the unseen **row 11**. Click the correct tile → score a point. Decode the underlying pattern fast enough, and the points add up over the 3-minute session.

Phantom Path trains:
- **Pattern recognition** — spotting the periodic anchor pattern.
- **Statistical forecasting** — reasoning under noise (variance).
- **Visual short-term memory** — holding the trail in mind as it fades.
- **Probabilistic decision-making** — picking the best guess, not just any guess.

---

## 2. Core Game Rules

### 2.1 The Grid

- A **10 × 10 visible grid** (columns 1–10 × rows 1–10).
- Below the grid is a **prediction strip**: 10 cells representing **row 11** (hidden landing row).

### 2.2 The Phantom & Its Movement

- Each round starts with a **1-second pre-roll** ("Get ready…") on an empty board so the player can refocus before the descent.
- The phantom then appears at **row 1**.
- Every **1 second** afterwards the phantom moves down to the next row (row 2, row 3, …, row 10).
- After step 10, the phantom *exits* the bottom of the visible grid. The player then clicks the predicted **row 11** column to advance — see §2.4.

### 2.3 X-Position Pattern (the puzzle)

Each round picks a **deviation triplet** and a **drift direction**, then re-uses them across all three periods. The whole 11-step path is computed as offsets from a single seed `f1`:

```
D1, D2, D3 ∈ [-2, +2]   with |D2 − D1| ≤ 2 and |D3 − D2| ≤ 2
E1 ∈ {-1, +1}             (the anchor-drift direction)
f1 = rand(1, 10), then shifted into bounds (see below)

Period 1 (anchor f1):
  Step 1   x = f1
  Step 2   x = f1 + D1
  Step 3   x = f1 + D2
  Step 4   x = f1 + D3

Period 2 (anchor f1 + E1):
  Step 5   x = f1 + E1
  Step 6   x = f1 + D1 + E1
  Step 7   x = f1 + D2 + E1
  Step 8   x = f1 + D3 + E1

Period 3 (anchor f1 + 2·E1):
  Step 9   x = f1 + 2·E1
  Step 10  x = f1 + 2·E1 + D1
  Step 11  x = f1 + 2·E1 + D2          ← HIDDEN — predict this column
```

Notes:
- The **period is 4**: each period starts with the pure anchor and the same `D1, D2, D3` deviations follow.
- Period 3 is a half-period (only steps 9, 10, 11 — anchor, +D1, +D2). The hidden step uses **D2**, the same offset visible at step 3 (period 1) and step 7 (period 2).
- Anchors drift by exactly `E1` each period (a single-direction walk, not a random walk).
- After offsets are computed, `f1` is shifted into `[1 − minOffset, 10 − maxOffset]` so every step lands in `[1, 10]` — no clamping or wrapping at runtime.

The player's job: from the visible 10 steps, infer the deviation pattern and click the predicted column on row 11.

### 2.4 Prediction Window

- After the phantom moves to row 10, the prediction strip (row 11) becomes **clickable** and **waits indefinitely** for the player.
- The 3-minute global timer **pauses** during the prediction phase, so taking time to think doesn't drain the session clock.
- Clicking a column logs the guess and advances to the reveal phase. There is no auto-timeout for the round.

### 2.5 Vanishing Trail

- Each visited cell shows a **glowing trail dot**.
- **Normal mode:** each dot stays at full opacity for **8 steps** (8 seconds), then fades linearly to 0 over the final **1 step**, and is removed at age **9 steps**. So when the player reaches the prediction phase, the earliest dots have already started disappearing — the gradual fade is the core difficulty driver.
- **Hint mode** (see §5): trails persist for the entire round at full opacity, never fading.

### 2.6 Round Cycle & Scoring

| Action | Reward |
|--------|--------|
| Correct prediction (clicked actual row-11 column) | **+1** |
| Wrong prediction | 0 |
| Missed the window (no click) | 0 |
| Streak bonus (3+ correct in a row) | +1 extra per consecutive correct |

After the result is revealed (the picked cell + the actual landing flash on row 11), the result text remains for **2 seconds** so the player can absorb the outcome and any visible hint lines, then the next round begins with a fresh `f1`.

### 2.7 Game End

The game ends when the **3:00 countdown timer** reaches `0:00`. Whatever round is in progress is allowed to finish (the prediction window plays out), and then the End Screen appears.

---

## 3. Timer

- One **3:00 countdown timer** spans all rounds.
- Timer is paused only during the result-reveal animation (~600 ms) and player-pause.
- When the timer hits `0:00`, no new round starts; the in-flight round may complete its prediction window, then game ends.
- Timer turns **red** below 0:30 and pulses below 0:10.

---

## 4. Controls

| Input | Action |
|-------|--------|
| Mouse click / tap on a row-11 cell | Submit prediction |

There are no keyboard shortcuts — input is fully click/tap-driven.

The HUD has three buttons:

- **Hint: On / Off** — toggles hint mode (see §5). Persists to `localStorage["phantomPath.hintMode"]`.
- **End at this point** — opens the End-confirm modal: *"End the run? Your current score will be saved."* On confirm the in-flight round is finalized and the End screen appears with the current score.

There is no Pause or Reset button. **Play Again** on the End screen returns to the intro for a fresh run.

---

## 5. UI Layout

```
┌────────────────────────────────────────────────────────────┐
│ [ ← Back ]   Synapse · Phantom Path     ⏱ 02:43   ⛔ Reset  │
├────────────────────────────────────────────────────────────┤
│  Round 7   Score 5   Streak ✱✱✱                            │
├────────────────────────────────────────────────────────────┤
│        col: 1  2  3  4  5  6  7  8  9  10                  │
│  row 1: ·  ·  ·  ·  ●  ·  ·  ·  ·  ·                       │  step 1 (faded)
│  row 2: ·  ·  ·  ·  ·  ·  ●  ·  ·  ·                       │  step 2
│  row 3: ·  ·  ·  ·  ●  ·  ·  ·  ·  ·                       │  step 3
│  row 4: ·  ·  ●  ·  ·  ·  ·  ·  ·  ·                       │  step 4
│  row 5: ·  ·  ·  ·  ·  ●  ·  ·  ·  ·                       │  step 5 (anchor 2)
│  row 6: ·  ·  ·  ●  ·  ·  ·  ·  ·  ·                       │  step 6
│  row 7: ·  ·  ·  ·  ·  ·  ●  ·  ·  ·                       │  step 7
│  row 8: ·  ·  ·  ·  ●  ·  ·  ·  ·  ·                       │  step 8
│  row 9: ·  ·  ·  ·  ·  ●  ·  ·  ·  ·                       │  step 9 (anchor 3)
│  row 10:·  ·  ·  ●  ·  ·  ·  ·  ·  ·                       │  step 10
├────────────────────────────────────────────────────────────┤
│  ROW 11 (predict):                                         │
│  [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]  ← click your guess         │
│  ⏳ 2.4s left                                               │
└────────────────────────────────────────────────────────────┘
```

### Visual states

| Element | Default | Active |
|---------|---------|--------|
| Trail dot | radial glow purple→indigo. Normal mode: full opacity 8 s, fade over the final 1 s. Hint mode: opacity stays at 1 for the round. | newest dot has bright spark |
| Phantom (current step) | bright violet orb with subtle wobble animation | leaves trail behind |
| Row-11 cell | translucent slot | hover: indigo border; clicked: pulse |
| Correct cell reveal | green flash | shows actual landing |
| Wrong guess reveal | red flash on guess + green flash on actual | side-by-side |
| Hint anchor (rows 1, 3, 9) | gold halo (`box-shadow` ring) when hint mode is on | applied as the phantom passes through these rows |
| Hint line **f1 → f3** | dashed gold line (animated) | drawn after step 3 — visualises the `D2` deviation |
| Hint line **f9 → f11** | dashed green line | drawn after step 9 — `f11 = f9 + D2`, which is the same `D2` revealed by the gold line |

**Hint mode** (toggled from the HUD) keeps the trail visible for the entire round and progressively draws two dashed lines that reveal the recurring `D2` offset across periods 1 and 3, so the player can read the answer geometrically.

---

## 6. End-of-Game Screen

Displays:
- **Final score**
- **Total rounds completed**
- **Accuracy %** (correct / completed rounds)
- **Best streak**
- **Average reaction time** in the prediction window
- **Per-pattern accuracy heatmap** (see §8) — which anchor patterns the player struggled with most
- Buttons: **Play Again** · **Back to Hub** · **Share Score**

---

## 7. Scoring (summary)

| Action | Points |
|--------|--------|
| Correct prediction | +1 |
| Streak bonus (per consecutive correct beyond 2) | +1 each |
| Lightning bonus (predicted within first 1 s of window) | +1 |
| Timer bonus at end (1 pt per 5 s remaining if all rounds correct) | up to +20 |

Maximum theoretical score depends on rounds completed (~12–15 in 3 minutes typical, more for fast players).

---

## 8. Data Logging

Every session is captured for analysis. Each game session emits a JSON record like:

```json
{
  "session_id": "uuid-v4",
  "user_id": "anonymous-or-userId",
  "game": "phantom-path",
  "started_at": "2026-05-05T11:02:00.000Z",
  "ended_at":   "2026-05-05T11:05:01.230Z",
  "ended_reason": "timeout | reset | quit",
  "duration_ms": 181230,
  "final_score": 9,
  "rounds_played": 13,
  "rounds_correct": 7,
  "accuracy_pct":  53.8,
  "best_streak":   4,
  "avg_response_ms": 1380,
  "rounds": [
    {
      "round_no": 1,
      "started_at": "2026-05-05T11:02:00.000Z",
      "ended_at":   "2026-05-05T11:02:13.450Z",
      "anchors": [4, 5, 4],
      "path_x":  [4, 6, 3, 5, 5, 4, 7, 3, 4, 6],
      "true_row11_x": 5,
      "predicted_x":  6,
      "result": "wrong",
      "response_ms": 1240,
      "trail_visible_when_predicting": [4, 5, 6, 7, 8, 9, 10]
    },
    /* ... */
  ]
}
```

### Captured fields summary

| Field | Description |
|-------|-------------|
| `started_at` / `ended_at` | ISO timestamps for the game session |
| `ended_reason` | `timeout` (3 min done), `reset`, or `quit` |
| `rounds[].anchors` | The 3 hidden anchors A1, A2, A3 used that round |
| `rounds[].path_x` | The 10 visible x-positions |
| `rounds[].true_row11_x` | Actual row-11 column (the answer) |
| `rounds[].predicted_x` | Player's clicked column (or `null` if missed) |
| `rounds[].response_ms` | Time from window-open to click |
| `rounds[].trail_visible_when_predicting` | Which step-dots were still on screen at click time |

### Storage

- **Phase 1 (MVP):** save JSON to `localStorage` under key `phantomPath.sessions[]`, capped at 20 entries.
- **Phase 2:** POST to `/api/v1/sessions` once user accounts ship.

---

## 9. End-at-this-point Behavior

- Clicking **End at this point** opens a confirmation modal: *"End the run? Your current score will be saved."*
- On confirm:
  - The in-flight round (if any) is finalized as `result: "timeout"` (no answer logged) and pushed to the rounds log.
  - The session is finalized with `ended_reason: "quit"` and persisted.
  - The End screen shows the cumulative score, accuracy, best streak, and average response time.

There is no separate Reset action. To start over, use **Play Again** on the End screen.

---

## 10. Algorithm

```text
function generateRound():
    D1 = randInt(-2, 2)
    D2 = randInt(max(-2, D1 - 2), min(2, D1 + 2))   // |D2 − D1| ≤ 2
    D3 = randInt(max(-2, D2 - 2), min(2, D2 + 2))   // |D3 − D2| ≤ 2
    E1 = choose([-1, +1])

    offsets = [
        0,                       // step 1  (f1, anchor of period 1)
        D1,                      // step 2
        D2,                      // step 3
        D3,                      // step 4
        E1,                      // step 5  (anchor of period 2)
        D1 + E1,                 // step 6
        D2 + E1,                 // step 7
        D3 + E1,                 // step 8
        2*E1,                    // step 9  (anchor of period 3)
        2*E1 + D1,               // step 10
        2*E1 + D2,               // step 11 — hidden, the answer
    ]

    minOff = min(offsets); maxOff = max(offsets)
    f1     = clamp(randInt(1, 10), 1 - minOff, 10 - maxOff)
    path   = offsets.map(o => f1 + o)
    return { f1, drift: E1, deviations: [D1, D2, D3], path }

function runRound(round):
    showFooter("Get ready…")
    wait(1s)                                 // 1-step pre-roll, empty board
    for step in 1..10:
        moveTo(round.path[step-1])
        scheduleFade(step, +9s)              // dot fully visible 8 s, fades to 0 over the next 1 s
        wait(1s)

    pauseGlobalTimer()
    openPredictionWindow()                   // no auto-timeout — wait for click
    onClick(col):
        log({ predicted_x: col, response_ms: now - windowOpen })
        if col == round.path[10]:
            score += 1 + streakBonus() + lightningBonus()
            streak += 1
        else:
            streak = 0
        revealAnswer(round.path[10])
        wait(2s)                              // reveal pause before next round
        resumeGlobalTimer()
        nextRound()
```

---

## 11. Implementation Notes

- Pure HTML + CSS + vanilla JS. File: `games/phantom-path.html`.
- Use CSS Grid for the 10×10 board and a separate row for the prediction strip.
- Use `requestAnimationFrame` for smooth trail-opacity fade-out; each dot has its own `data-spawn-at` timestamp and the render loop updates `opacity` based on `(now - spawn) / 10000`.
- **Out-of-bounds handling:** if the random anchor + variance falls outside [1, 10], re-roll the variance until it lands inside. (Alternative: clamp; clamping skews the distribution at edges and gives a small real-world hint, which can be intentional or undesirable — pick one and document it.)
- The phantom uses a small SVG sprite (a cute ghost or eye) with a violet glow filter; trail dots are scaled-down copies with reduced opacity.
- Session JSON written to `localStorage` under `phantomPath.sessions`, capped at 20 entries.
- Difficulty levers (for later): variance range (±2 default → ±3 hard), period length (4 default → 3 hard), trail lifetime (10 s default → 6 s hard), grid size (10×10 → 12×12).

---

## 12. Variants & Future Enhancements

- **Multi-phantom mode:** 2 phantoms moving in parallel, predict both row-11 positions.
- **Reverse mode:** phantom travels upward; predict row-0.
- **Pattern hint mode (training):** show A1, A2, A3 markers as faint dots after each period — a learning aid for new players.
- **Adversarial mode:** the variance distribution shifts mid-round (e.g., ±2 → ±3 at step 5) — player must adapt.
- **Daily phantom:** one fixed seed for the day, shareable scores across the leaderboard.
- **Heatmap analytics:** show which anchor configurations players struggle with most.

---

*Document version: 1.0 — Last updated: May 2026*

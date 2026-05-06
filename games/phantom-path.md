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

- A single phantom monster appears at **row 1** at the start of each round.
- Every **1 second** the phantom moves down to the next row (row 2, row 3, …, row 10).
- After step 10, the phantom *exits* the bottom of the visible grid. The player then has a short window to click the predicted **row 11** column before the next round starts.

### 2.3 X-Position Pattern (the puzzle)

The X-position of the phantom follows a **periodic anchor + variance** pattern:

```
Step 1  (anchor A1):       x  = A1
Step 2:                    x  = A1 + v2     where v2 ∈ {-2,-1,0,1,2}
Step 3:                    x  = A1 + v3     where v3 ∈ {-2,-1,0,1,2}
Step 4:                    x  = A1 + v4     where v4 ∈ {-2,-1,0,1,2}

Step 5  (anchor A2 = A1 ± 1):
                           x  = A2
Step 6:                    x  = A2 + v6
Step 7:                    x  = A2 + v7
Step 8:                    x  = A2 + v8

Step 9  (anchor A3 = A2 ± 1):
                           x  = A3
Step 10:                   x  = A3 + v10
Step 11 (HIDDEN - to predict):
                           x  = A3 + v11    where v11 ∈ {-2,-1,0,1,2}
```

Notes:
- The **period is 4**: every 4th step is a fresh anchor, and the 3 following steps are noisy deviations from that anchor (±2 columns).
- Between periods, the anchor **drifts by exactly ±1 column** (a controlled random walk).
- All positions are clamped to the grid bounds [1, 10] — if a generated x falls outside, it is wrapped or re-rolled (see implementation note in §11).

The player's job: from the visible 10 steps, infer **A3** (or estimate the most-likely landing column) and click it on row 11.

### 2.4 Prediction Window

- After the phantom moves to row 10, the prediction strip (row 11) becomes **clickable** for **3 seconds**.
- Clicking inside the window logs the guess; missing the window logs a `timeout` (no score).

### 2.5 Vanishing Trail

- Each visited cell shows a **glowing trail dot**.
- Each trail dot remains visible for exactly **10 seconds** after it appeared.
- This means: when step 11's prediction window opens, the **step-1 dot has just faded out**, step-2 fades next, and so on. By the end of the prediction window, only steps 4–10 are still visible.
- This gradual fade is the core difficulty driver: the player must commit to memory the early anchor positions before they vanish.

### 2.6 Round Cycle & Scoring

| Action | Reward |
|--------|--------|
| Correct prediction (clicked actual row-11 column) | **+1** |
| Wrong prediction | 0 |
| Missed the window (no click) | 0 |
| Streak bonus (3+ correct in a row) | +1 extra per consecutive correct |

After the result is revealed (the actual phantom briefly flashes on row 11), the next round begins **immediately** with a fresh A1 and fresh phantom.

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
| `R` key | Reset (with confirmation modal) |
| `P` key | Pause (timer + phantom freeze) |
| `1`–`9`, `0` keyboard shortcut | Predict column 1–10 |

A **Reset** button and **Pause** button live on the HUD.

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
| Trail dot | radial glow purple→indigo, opacity decaying linearly over 10 s | newest dot has bright spark |
| Phantom (current step) | bright violet orb with subtle wobble animation | leaves trail behind |
| Row-11 cell | translucent slot | hover: indigo border; clicked: pulse |
| Correct cell reveal | green flash | shows actual landing |
| Wrong guess reveal | red flash on guess + green flash on actual | side-by-side |

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

## 9. Reset Behavior

- Clicking **Reset** (or pressing `R`) opens a confirmation modal: *"Reset the game? Your progress will be lost."*
- On confirm:
  - Current session is finalized with `ended_reason: "reset"` and saved.
  - A fresh `session_id` and 3:00 timer begin a new session.

---

## 10. Algorithm

```text
function generateRound():
    A1 = randInt(3, 8)               // keep early anchors well inside the grid
    A2 = clamp(A1 + choose([-1, +1]), 1, 10)
    A3 = clamp(A2 + choose([-1, +1]), 1, 10)

    path = []
    for step in 1..11:
        anchor = (step <= 4) ? A1 : (step <= 8) ? A2 : A3
        if step % 4 == 1:
            x = anchor                    // pure anchor on the period-start step
        else:
            x = clamp(anchor + randInt(-2, +2), 1, 10)
        path.push(x)

    visible_path = path[0..9]            // steps 1–10
    true_row11   = path[10]              // step 11 (the answer)
    return { anchors: [A1, A2, A3], visible_path, true_row11 }

function runRound(round):
    for step in 1..10:
        moveTo(round.visible_path[step-1])
        scheduleFade(step, +10s)         // dot fades after 10 s
        wait(1s)

    openPredictionWindow(3s)
    onClick(col):
        log({ predicted_x: col, response_ms: now - windowOpen })
        if col == round.true_row11:
            score += 1 + streakBonus()
            streak += 1
        else:
            streak = 0
        revealAnswer(round.true_row11)
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

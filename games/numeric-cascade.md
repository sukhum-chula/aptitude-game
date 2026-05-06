# Numeric Cascade — Game Design Document

> **Game #1 of Synapse**
> Skill area: **Visual Search · Speed · Focus · Working Memory**
> Status: **Ready (first to be implemented)**

---

## 1. Concept

**Numeric Cascade** is a fast-paced number-sequencing game inspired by the classic Schulte Table cognitive test. Players see a 5×5 grid filled with shuffled numbers and must tap them in the correct sequence as fast as possible. As each correct number is tapped, it fades out and is *cascaded* with a new higher (or lower) number — creating a continuous stream of numerical targets across three rounds.

The game trains:
- **Visual scanning speed** — finding the next target in a noisy grid.
- **Selective attention** — filtering out distractor numbers.
- **Working memory** — holding the current target in mind while scanning.
- **Reflex accuracy** — balancing speed with correct selection.

---

## 2. Core Game Rules

### 2.1 Grid

- A **5 × 5 grid** (25 cells) is displayed in the center of the screen.
- Each cell shows one number.
- Numbers are **non-repeating** within the grid at any given time.

### 2.2 Rounds

The game consists of **3 rounds**, each requiring the player to click numbers from **1 to 50** in a specific order:

| Round | Direction | Target Sequence |
|-------|-----------|-----------------|
| 1 | Ascending | 1 → 2 → 3 → … → 50 |
| 2 | Descending | 50 → 49 → 48 → … → 1 |
| 3 | Ascending | 1 → 2 → 3 → … → 50 |

### 2.3 Round Start State

- **Round 1 starts with numbers 1–25** randomly placed in the 25 cells.
- **Round 2 starts with numbers 26–50** randomly placed (because the player must descend from 50).
- **Round 3 starts again with numbers 1–25** randomly placed.

### 2.4 Cascade Logic (Replenishment)

When the player clicks the **correct expected number**:

1. Score increases by **+1**.
2. That number **fades out** with an animation (~250 ms).
3. A **new number** appears in the same cell:
   - In **Round 1 (1→50 ascending)**: the next batch numbers 26–50 are drawn from a pool. If pool empty, the cell stays empty.
   - In **Round 2 (50→1 descending)**: numbers 25–1 are drawn from a pool.
   - In **Round 3 (1→50 ascending)**: same as Round 1.

So at any moment the grid contains a *sliding window* of 25 numbers around the player's current target.

### 2.5 Skip Penalty

If the player clicks a number **larger than the expected next number** (e.g., expected `2`, but clicks `8`):

- All numbers in the grid that are **smaller than the clicked number** are removed (regardless of whether they are still on the grid).
- Empty cells are immediately refilled with new random numbers from the appropriate pool.
- The skip is logged as a **wrong click** (does not increase score).
- The next expected number becomes **the clicked number + 1** (since lower numbers no longer count toward sequence completion).

Example (Round 1):
- Expected next: `2`. Player clicks `8`.
- Numbers `2, 3, 4, 5, 6, 7` are removed from the grid (if present).
- They are replaced with random new numbers from 26–50 pool.
- The next expected number becomes `9`.

For descending Round 2, the inverse applies (clicking a number lower than expected removes all higher numbers in between).

### 2.6 Wrong Click (Already-Cleared Number)

If the player clicks a number that was already cleared earlier in the round (shouldn't normally happen since cells refill, but just in case) — no score, logged as wrong click.

### 2.7 Round End

A round ends when the **target sequence is completed** (last expected number clicked), e.g., `50` in Round 1.

After a 1.5-second transition screen showing round score, the next round begins automatically.

### 2.8 Game End

The game ends when **either** of the following happens:
- All 3 rounds completed.
- The **5:00 countdown timer** reaches `0:00`.

When the game ends, the **End Screen** displays the final score, accuracy, total time, and per-round breakdown.

---

## 3. Scoring

| Action | Points |
|--------|--------|
| Correct click | +1 |
| Wrong click (skip) | 0 (penalized via skip logic) |
| Round-clear bonus | +5 |
| Time bonus (per second remaining at game end) | +1 |

Maximum theoretical score: `(50 × 3) + (5 × 3) + 300 (time bonus)` = **465** points.

---

## 4. Timer

- A single **5:00 countdown timer** runs across all 3 rounds.
- Timer is paused during round transition screens.
- Timer turns **red** when below 0:30.
- Timer reaching `0:00` ends the game immediately.

---

## 5. Controls

| Input | Action |
|-------|--------|
| Mouse click (or tap) on a cell | Select that number |
| `R` key | Reset the game (with confirmation modal) |
| `P` key | Pause the game (timer pauses) |

A **Reset** button is also visible on the HUD.

---

## 6. UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [ ← Back to Hub ]   Synapse · Numeric Cascade              │
├─────────────────────────────────────────────────────────────┤
│  Round: 1 / 3   Next: 7   Score: 12   Time: 04:32   [Reset] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                ┌──┬──┬──┬──┬──┐                             │
│                │14│ 3│22│ 8│11│                             │
│                ├──┼──┼──┼──┼──┤                             │
│                │ 5│18│ 1│25│16│                             │
│                ├──┼──┼──┼──┼──┤                             │
│                │ 9│21│ 6│13│ 4│                             │
│                ├──┼──┼──┼──┼──┤                             │
│                │17│10│24│ 2│19│                             │
│                ├──┼──┼──┼──┼──┤                             │
│                │ 7│15│20│23│12│                             │
│                └──┴──┴──┴──┴──┘                             │
│                                                             │
│           [ Pause ]    [ How to Play ]                      │
└─────────────────────────────────────────────────────────────┘
```

### HUD elements
- **Round indicator** — current/total rounds
- **Next target** — large, highlighted; the next number the player must click
- **Score** — current cumulative score
- **Timer** — MM:SS countdown
- **Reset** — restarts the entire game

### Cell visual states
- **Default** — translucent card with number
- **Hover** — subtle scale + border glow
- **Correct click** — green flash → fade out → new number fades in
- **Wrong click** — red flash + small shake animation
- **Highlight target** *(optional, accessibility mode)* — slight pulse on the expected number's cell

---

## 7. End-of-Game Screen

Displays:
- **Final score** (large, gradient text)
- **Accuracy** (% of correct clicks among total clicks)
- **Total time** used
- **Per-round table**:

| Round | Score | Wrong Clicks | Time |
|-------|-------|--------------|------|
| 1 | 50 | 2 | 1:34 |
| 2 | 50 | 0 | 1:48 |
| 3 | 50 | 1 | 1:12 |

- Buttons: **Play Again** · **Back to Hub** · **Share Score**

---

## 8. Data Logging (for Analysis)

All session activity is captured for later analytics. Each game session produces a JSON record:

```json
{
  "session_id": "uuid-v4",
  "user_id": "anonymous-or-userId",
  "game": "numeric-cascade",
  "started_at": "2026-05-05T10:14:23.000Z",
  "ended_at":   "2026-05-05T10:18:47.512Z",
  "ended_reason": "completed | timeout | reset | quit",
  "final_score": 152,
  "total_correct": 150,
  "total_wrong":   8,
  "accuracy_pct":  94.9,
  "rounds": [
    {
      "round_no": 1,
      "direction": "asc",
      "started_at": "2026-05-05T10:14:23.000Z",
      "ended_at":   "2026-05-05T10:15:57.412Z",
      "duration_ms": 94412,
      "score": 50,
      "wrong_clicks": 2,
      "events": [
        {
          "ts": "2026-05-05T10:14:24.123Z",
          "elapsed_ms": 1123,
          "expected": 1,
          "clicked": 1,
          "result": "correct",
          "cell": [2, 1]
        },
        {
          "ts": "2026-05-05T10:14:25.430Z",
          "elapsed_ms": 2430,
          "expected": 2,
          "clicked": 8,
          "result": "skip",
          "cell": [3, 0],
          "removed_numbers": [2, 3, 4, 5, 6, 7]
        }
        /* ...one entry per click */
      ]
    },
    { "round_no": 2, "direction": "desc", "...": "..." },
    { "round_no": 3, "direction": "asc",  "...": "..." }
  ]
}
```

### Captured fields summary

| Field | Description |
|-------|-------------|
| `session_id` | Unique identifier for the game session |
| `started_at` / `ended_at` | ISO timestamps of game start and end |
| `ended_reason` | Why the game ended (`completed` · `timeout` · `reset` · `quit`) |
| `rounds[].started_at` / `ended_at` | Round-level timestamps |
| `rounds[].events[]` | Every click with timestamp, expected vs actual, result, grid cell coordinates |
| `final_score` · `accuracy_pct` | Aggregated metrics |

### Storage strategy

- **Phase 1 (MVP):** save JSON to `localStorage` under key `numericCascade.sessions[]`. Provides offline playback / personal history.
- **Phase 2:** when user accounts ship, POST the JSON to `/api/v1/sessions` and persist to the backend database for cross-device history and aptitude analytics.

---

## 9. Reset Behavior

- Clicking **Reset** (or pressing `R`) opens a confirmation modal: *"Reset the game? Your current progress will be lost."*
- On confirm:
  - The current session log is finalized with `ended_reason: "reset"` and saved.
  - A **new session** begins with a fresh `session_id`, fresh grid, and timer back to 5:00.

---

## 10. Algorithm Summary

```text
function startRound(roundNo):
    direction = (roundNo == 2) ? 'desc' : 'asc'
    expected  = (direction == 'asc') ? 1 : 50
    pool      = (direction == 'asc') ? [26..50] : [25..1]
    grid      = shuffle((direction == 'asc') ? [1..25] : [26..50])
    log("round_start", roundNo)

function onCellClick(cell):
    n = cell.value
    log("click", { expected, clicked: n })

    if n == expected:
        score += 1
        cell.fadeOut()
        cell.replaceWith(pool.pop() ?? null)
        expected += (direction == 'asc') ? 1 : -1
        if (direction == 'asc' && expected > 50) || (direction == 'desc' && expected < 1):
            endRound()

    elif (direction == 'asc' && n > expected) || (direction == 'desc' && n < expected):
        // skip penalty
        removed = numbersBetween(expected, n)
        grid.removeAll(removed)
        grid.refillEmptyCells(pool)
        expected = n + (direction == 'asc' ? 1 : -1)
        log("skip", { removed })

    else:
        // wrong (already-cleared) — rare
        log("wrong")
```

---

## 11. Technical Notes (implementation guidance)

- Pure HTML + CSS + vanilla JS, in line with the Synapse MVP stack.
- File location: `games/numeric-cascade.html`.
- Use CSS Grid for the 5×5 board.
- Use `requestAnimationFrame` for the countdown timer (smooth, accurate).
- Use CSS transitions (`opacity`, `transform`) for fade in/out animations.
- All game state lives in a single `state` object; all mutations go through reducer-style functions to make logging trivial.
- No external libraries required for MVP.

---

## 12. Future Enhancements

- **Difficulty modes:** 4×4 (easy), 5×5 (normal), 6×6 (hard), 7×7 (expert).
- **Adaptive difficulty:** grid size grows after each completed round in a single session.
- **Color distractors:** half the cells colored red — only click red ones in some rounds.
- **Multiplayer:** real-time race against friends.
- **Heatmap analytics:** which grid positions take the longest to find next target.

---

*Document version: 1.0 — Last updated: May 2026*

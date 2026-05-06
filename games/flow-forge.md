# Flow Forge — Game Design Document

> **Game #8 of Synapse**
> Skill area: **Spatial Reasoning · Logical Planning · Pathfinding · Trial-and-Error Optimization**
> Status: Locked (planned for Phase 3 release)

---

## 1. Concept

A water source on the left side of a grid needs to reach **valid outlet pipes** on the right side. The grid is filled with pipe segments — straights, elbows, and T-junctions — placed in random rotations. The player **clicks each tile to rotate that pipe by 90°**, planning the route, and finally hits **LAUNCH** to release the water.

If the flow successfully reaches every valid outlet, the round is won. The challenge ramps over **3 rounds**: bigger grids and multiple required outlets in later rounds.

Flow Forge trains:
- **Spatial reasoning** — visualizing rotated shapes and their connectivity.
- **Logical planning** — sequencing pipe orientations to satisfy a goal.
- **Pathfinding intuition** — finding (one of many) valid solutions.
- **Decision under constraint** — splitting flow to multiple outlets via T-junctions in rounds 2 & 3.

---

## 2. Core Game Rules

### 2.1 Grid

| Round | Grid Size | Outlets to Reach |
|-------|-----------|------------------|
| 1 | 4 × 4 | **1** valid outlet (other 3 blocked by valves) |
| 2 | 4 × 4 | **2** valid outlets (other 2 blocked) |
| 3 | 5 × 5 | **2** valid outlets (other 3 blocked) |

The **water source** is always on the **left side, row 3 (from top)**, sitting outside the grid and pointing right into column 1.

The **outlets** are on the **right side**, one per row, sitting outside the grid. Some are open (valid targets), others are sealed by a **valve icon** (must NOT be reached).

### 2.2 Pipe Tiles

Each cell holds one pipe segment from this set:

| Type | Shape | Connections (when in canonical rotation) | Notes |
|------|-------|------------------------------------------|-------|
| **Straight** | ─ or │ | left ↔ right *(or top ↔ bottom)* | 2 visual rotations (90° equivalent) |
| **Elbow** | ┐ ┘ ┌ └ | two adjacent sides | 4 rotations |
| **T-junction** | ┬ ┤ ┴ ├ | three sides | 4 rotations — only available rounds 2 & 3 (needed to split flow) |
| **Empty** | ░ | no connections | dead cell — water cannot enter |

Each round generates a random mix of pipe types in random rotations. Round 1 may use only straights + elbows; rounds 2–3 also include T-junctions.

### 2.3 Rotation

- **Single click** on any tile rotates its pipe **90° clockwise**.
- Rotation animation is ~150 ms.
- Tiles can be rotated freely any number of times before LAUNCH is pressed.
- Empty cells are not clickable.

### 2.4 Launching the Flow

Once the player believes the layout is correct, they click the **LAUNCH** button (large, glowing, bottom of the screen).

On launch:
1. The board is **frozen** (no more rotations).
2. Water animates from the source through the connected pipes — a flowing blue gradient progressing one tile every ~150 ms.
3. Pipes that lie on the actual water path are filled with the animated water; **other pipes remain dry** even if rotated correctly but disconnected.
4. After the animation completes, the result is evaluated:
   - **Win:** every valid outlet was reached, AND no valve was reached.
   - **Lose:** at least one valid outlet was missed, OR water hit a valve (invalid outlet).

### 2.5 Scoring

- **+1** point for each round won.
- Maximum score across 3 rounds: **3**.
- Optional bonuses (UI/UX nice-to-have):
  - **+1** speed bonus if the round is solved in under 30 s
  - **+1** efficiency bonus if no rotation is wasted (i.e., total clicks = minimum needed)

### 2.6 Round Cycle

After LAUNCH:
- A 1.5 s result banner appears (✅ "Flow Complete!" or ❌ "Pipeline Broken").
- The next round auto-starts with a fresh randomized grid.
- After round 3, the End Screen appears.

### 2.7 Game End

The game ends when **either** of:
- All 3 rounds completed (win or lose each).
- The **5:00 countdown timer** reaches `0:00` — the in-progress round is automatically launched and evaluated, then the End Screen appears.

---

## 3. Timer

- One **5:00 countdown timer** spans all 3 rounds.
- Timer pauses during the LAUNCH animation and result-reveal banner.
- Timer turns **red** below 0:30 and pulses below 0:10.

---

## 4. Controls

| Input | Action |
|-------|--------|
| Click / tap a tile | Rotate that pipe 90° clockwise |
| Click **LAUNCH** | Run the flow simulation |
| Click **End at this point** | End-confirm modal: *"End the run? Your current score will be saved."* On confirm, the in-flight round is logged with `result: "quit"` and the End screen appears |

There are no keyboard shortcuts and no Pause or Reset button. Use **Play Again** on the End screen to start a fresh run.

---

## 5. UI Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [ ← Back ]   Synapse · Flow Forge        ⏱ 04:21    ⛔ Reset    │
├────────────────────────────────────────────────────────────────┤
│  Round 2 / 3       Score 1                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                       col 1  col 2  col 3  col 4               │
│            row 1     ┌ ── ┐  ┌────┐  ┌────┐  ┌────┐    🛑 valve│
│                      │ └─┐│  │ ─ ─│  │┌── │  │ ─│ │            │
│            row 2     │┌──┘│  │ │  │  │└──┐│  │  │ │   ✓ outlet │
│                      ││┌──┴──┴┘   ─ ─└┐  └┴──┴──┘│            │
│  💧 SOURCE → row 3   │└┘            ─ ─└─────────┘   ✓ outlet │
│                      │┌─┐  ┌────┐  ┌────┐  ┌────┐             │
│            row 4     ││ │  │ ─ ─│  │ ─ ─│  │ ─│ │    🛑 valve │
│                      │└─┘  └────┘  └────┘  └──┘ │             │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                       [ 🚀 LAUNCH ]                            │
└────────────────────────────────────────────────────────────────┘
```

### Visual states

| Element | Default | Active |
|---------|---------|--------|
| Pipe tile | indigo translucent card with white pipe glyph | hover: subtle border glow; rotating: 90° spin animation |
| Water-filled pipe | bright cyan→blue gradient flowing along the segment | only segments on the actual flow path |
| Source | animated water droplet pulse | always visible, left side |
| Valid outlet | green pipe stub with "✓" | turns bright cyan when water arrives |
| Valve | red circular handle "🛑" | flashes red if water hits it (= loss) |
| LAUNCH button | gradient indigo → cyan, glowing | disabled while flow animating |

---

## 6. End-of-Game Screen

Displays:
- **Final score** (out of 3)
- **Total rotations used**
- **Time used** / time remaining
- **Per-round table:**

| Round | Result | Rotations | Time |
|-------|--------|-----------|------|
| 1 | ✅ Win | 7 | 38 s |
| 2 | ❌ Loss | 22 | 1:47 |
| 3 | ✅ Win | 19 | 1:54 |

- Buttons: **Play Again** · **Back to Hub** · **Share Score**

---

## 7. Data Logging

Every session is captured for analysis. Each game session emits a JSON record:

```json
{
  "session_id": "uuid-v4",
  "user_id": "anonymous-or-userId",
  "game": "flow-forge",
  "started_at": "2026-05-06T09:14:00.000Z",
  "ended_at":   "2026-05-06T09:18:42.450Z",
  "ended_reason": "completed | timeout | reset | quit",
  "final_score": 2,
  "rounds": [
    {
      "round_no": 1,
      "grid_size": [4, 4],
      "source_row": 3,
      "valid_outlets": [2],
      "valves":        [1, 3, 4],
      "started_at":    "2026-05-06T09:14:00.000Z",
      "launched_at":   "2026-05-06T09:14:38.310Z",
      "duration_ms":   38310,
      "rotations":     7,
      "result":        "win",
      "initial_layout": [
        { "row": 1, "col": 1, "type": "elbow",    "rotation": 0 },
        { "row": 1, "col": 2, "type": "straight", "rotation": 1 }
        /* …16 total cells */
      ],
      "final_layout":   [ /* same shape, with player's chosen rotations */ ],
      "rotation_log": [
        { "ts": "2026-05-06T09:14:03.120Z", "row": 2, "col": 1 },
        { "ts": "2026-05-06T09:14:04.870Z", "row": 2, "col": 2 }
        /* … */
      ]
    },
    { "round_no": 2, "grid_size": [4,4], "valid_outlets": [1,4], "...": "..." },
    { "round_no": 3, "grid_size": [5,5], "valid_outlets": [2,5], "...": "..." }
  ]
}
```

### Captured fields summary

| Field | Description |
|-------|-------------|
| `started_at` / `ended_at` | ISO timestamps of the session |
| `ended_reason` | `completed` · `timeout` · `reset` · `quit` |
| `rounds[].grid_size` | `[rows, cols]` for that round (`[4,4]` or `[5,5]`) |
| `rounds[].source_row` | Always `3` for Round 1 (4×4); see §10 for 5×5 |
| `rounds[].valid_outlets` / `valves` | Row indices of open / blocked outlets |
| `rounds[].initial_layout` | The starting tile types + rotations |
| `rounds[].final_layout` | Tiles + rotations at LAUNCH |
| `rounds[].rotation_log` | Every click with timestamp and cell |
| `rounds[].result` | `win` or `loss` |

### Storage

- **Phase 1 (MVP):** `localStorage` under key `flowForge.sessions[]`, capped at 20 entries.
- **Phase 2:** POST to `/api/v1/sessions` once user accounts ship.

---

## 8. End-at-this-point Behavior

- Clicking **End at this point** opens a confirmation modal: *"End the run? Your current score will be saved."*
- On confirm, the in-flight round is appended to the rounds log with `result: "quit"` (its layout, valves, rotations, and rotation_log are captured), then the session is finalized with `ended_reason: "quit"` and persisted.
- The End screen displays the current score and per-round breakdown. Click **Play Again** to start fresh.

---

## 9. Algorithm

### 9.1 Generating a solvable round

```text
function generateRound(roundNo):
    if roundNo == 1:  size = (4, 4); validCount = 1
    if roundNo == 2:  size = (4, 4); validCount = 2
    if roundNo == 3:  size = (5, 5); validCount = 2

    sourceRow = (size.rows == 4) ? 3 : pickRandom([2, 3, 4])
    validOutlets = pickRandomRows(size.rows, count=validCount)
    valves       = allRows - validOutlets

    // 1. Build a guaranteed-solvable layout in canonical rotations
    solvedLayout = buildPath(size, sourceRow, validOutlets)

    // 2. Fill remaining cells with random pipe types (filler distractors)
    fillRemainingCells(solvedLayout)

    // 3. Scramble: rotate every tile by a random {0, 90, 180, 270}
    initialLayout = scramble(solvedLayout)

    return { size, sourceRow, validOutlets, valves, initialLayout, solvedLayout }
```

### 9.2 Flow simulation (on LAUNCH)

```text
function simulateFlow(layout, sourceRow, validOutlets, valves):
    flooded = set()
    queue   = [(sourceRow, 0, "right")]   // starting outside the grid, entering from left

    while queue not empty:
        (r, c, fromSide) = queue.pop()
        if (r, c) is outside grid:
            // reached the right side at row r
            if r in valves:        return "loss-hit-valve"
            if r in validOutlets:  recordReachedOutlet(r); continue
            else:                  continue
        tile = layout[r][c]
        if not tile.acceptsConnectionFrom(fromSide):
            continue
        if (r, c, fromSide) already flooded: continue
        mark (r, c) as flooded
        for each side in tile.connections - {fromSide}:
            (nr, nc, nFromSide) = step(r, c, side)
            queue.push((nr, nc, nFromSide))

    if all validOutlets in reached: return "win"
    else:                            return "loss-incomplete"
```

The result determines whether the player gets +1 score, and which pipes are visually filled with water (the `flooded` set).

---

## 10. Implementation Notes

- Pure HTML + CSS + vanilla JS. File: `games/flow-forge.html`.
- Use CSS Grid for the board; each cell is an absolutely-positioned button with a rotated `<svg>` of the pipe glyph.
- **Pipe SVGs** — one master SVG per type with `transform: rotate(90deg)` set per-cell via inline style; rotation animation is a CSS transition on `transform`.
- **Water animation** — once flow is computed, animate a `linear-gradient` `background-position` along each flooded pipe sequentially. Use a setTimeout chain (or `requestAnimationFrame`) so the visual flow propagates tile-by-tile.
- **Source row for 5×5 (Round 3):** keep it visually similar to rounds 1–2 by anchoring source row 3 (middle), or randomize among rows 2–4 for variety. The doc shows both options; the algorithm chooses based on round.
- **Solvability guarantee** — always build a solved layout first, then scramble rotations. This prevents accidentally generating an unsolvable level.
- **Filler tile choice** — for round 1 (only 1 outlet), bias filler to `straight` and `elbow`. For rounds 2 & 3, ensure at least one `T-junction` exists in the solvable path.
- Session JSON written to `localStorage` under `flowForge.sessions`, capped at 20 entries.

---

## 11. Variants & Future Enhancements

- **Free-mode editor:** players design and share their own grids.
- **Limited rotation budget:** a max-clicks counter — encourages efficient solutions.
- **Multi-source mode:** two source droplets (different colors) that must reach matching colored outlets without crossing.
- **Animated valves:** valves periodically open/close, requiring timing in addition to layout.
- **Daily challenge:** one fixed seed for the day, leaderboard of fastest solves.
- **Adaptive difficulty:** grid size grows after each completed round in a single session (5×5 → 6×6 → 7×7).
- **Hint button (training mode):** highlights one tile that's currently in the wrong rotation, costs 1 second of timer or +5 rotations.

---

*Document version: 1.0 — Last updated: May 2026*

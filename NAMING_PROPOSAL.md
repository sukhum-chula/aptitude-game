# Platform Naming & Icon Proposal

> **Status:** Historical proposal. The platform shipped under **Synapse** (one of the candidates evaluated below — see §"Side-by-side comparison"), not the document's headline recommendation of MindForge. The hero copy and footer in `index.html`, plus all game-page titles, use Synapse with the tagline *"Spark Your Thinking."* Treat the rest of this document as the original brand-naming exploration; the icon system never had a final mark designed in code (the hub uses a stylised SVG of two neuron nodes connected by a glowing arc + spark, matching the Synapse vibe rather than the MindForge anvil sketches).

> Original goal: replace the working name **BrainArena** with something that better reflects the platform's mission — *aptitude training through play* — and pair it with a distinctive icon.

---

## Why rename?

"BrainArena" leans heavily on *competition* (arena = battleground). The platform is really about *training and improvement* through fun mini-games. A name that signals **growth, sharpness, or mental play** will fit broader audiences (students, casual learners, professionals) better than one that implies only battle/leaderboard play.

---

## Top 5 Candidates

### 1. MindForge  ⚒️🧠  *(Recommended)*

> *"Forge a sharper mind, one game at a time."*

- **Why it works:** "Forge" implies effort + craftsmanship — you're shaping/strengthening your mind. Carries gravitas without being intimidating.
- **Icon concept:**
  - Primary: stylized brain inside a hexagonal anvil silhouette, with a spark above.
  - Alt: a hammer striking a glowing brain.
- **Color palette:** keep current indigo/violet, add a warm "spark" accent (`#f59e0b` orange) for the icon highlight.
- **Tagline ideas:** "Train. Play. Sharpen." · "Where minds get sharper."

### 2. Cortex  🧬

> *"Where every neuron plays."*

- **Why it works:** clinical, modern, short, memorable. Premium-tech feel.
- **Icon concept:** minimalist brain hemisphere outline with abstract circuit lines flowing through it.
- **Vibe:** sleek and serious — leans more "professional brain training" than "playful learning game."

### 3. AptiVerse  🌌

> *"A universe of aptitude challenges."*

- **Why it works:** the **-Verse** suffix matches the multi-game-hub concept perfectly. Scales nicely if more games are added.
- **Icon concept:** a planet/orbit with a tiny brain at its center; orbiting dots represent the mini-games.
- **Vibe:** modern, expansive, slightly futuristic.

### 4. Brainery  🌱

> *"A playground for curious minds."*

- **Why it works:** brain + nursery. Friendly, warm, and student-focused — great if the target audience tilts toward learners and parents.
- **Icon concept:** a sprouting lightbulb, or a brain with a small leaf or graduation cap.
- **Vibe:** approachable, educational, slightly whimsical.

### 5. Synapse  ⚡

> *"Spark your thinking."*

- **Why it works:** scientific, energetic, suggests fast cognitive connections.
- **Icon concept:** two glowing dots connected by a lightning arc, or a constellation of neurons forming a network shape.
- **Vibe:** sharp, fast, dynamic — fits speed/reaction games well.

---

## Side-by-side comparison

| Name | Tone | Audience fit | Icon distinctiveness | Memorability |
|------|------|--------------|----------------------|--------------|
| **MindForge** | Powerful, growth | Broad (students + adults) | High (anvil/spark) | High |
| Cortex | Clinical, modern | Pro / serious learners | Medium | High |
| AptiVerse | Fun, futuristic | Younger / gamer leaning | High (orbit) | Medium |
| Brainery | Friendly, warm | Students / parents | Medium (leaf-bulb) | Medium |
| Synapse | Sharp, energetic | Speed / focus seekers | Medium (arc) | High |

---

## Recommendation: **MindForge**

It strikes the best balance for BrainArena's mission:

- **Captures training, not just competition** — better than "Arena."
- **Works across audiences** — students prepping for tests, professionals brushing up, casual brain-trainers.
- **Strong visual identity** — the anvil + spark gives the brand a distinctive icon that won't be confused with the dozens of "brain" / "lightbulb" logos in the space.
- **Verb-friendly tagline** — "Forge your mind" naturally extends to marketing copy.

---

## Proposed New Icon — MindForge

### Concept A — Anvil + Brain + Spark  *(primary)*

```
        ✦
       / \
      /   \
   ╔═════════╗
   ║  brain  ║   ← stylized hemisphere with subtle circuit lines
   ╚═════════╝
   ░░░░░░░░░░░   ← anvil base (rounded)
```

- Hexagonal or shield-shaped frame so it pairs with the existing card-grid aesthetic.
- The "spark" is a single 4-point star above the brain; can animate with a subtle pulse on hover.
- Gradient: indigo (`#6366f1`) → violet (`#8b5cf6`) → orange spark accent (`#f59e0b`).

### Concept B — Hammer + Brain  *(alt)*

- A side-view of a brain being struck by a small hammer at its top, with a spark emitting on impact.
- More literal but less abstract — could feel slightly busy at small sizes.

### Concept C — "Sparked Brain" minimal mark  *(monogram)*

- Just a brain silhouette with a single bright spark dot on its top-left lobe.
- Best for app-icon and favicon use where detail is lost at 32×32.

### Recommended icon system

| Use case | Concept |
|----------|---------|
| Hub logo (header, hero) | **A — Anvil + Brain + Spark** (full mark) |
| Mobile / favicon (≤ 32px) | **C — Sparked Brain** (simplified) |
| Loading states / branded animations | spark pulse on Concept A |

---

## Migration notes (if MindForge is approved)

- Update `<title>` and `.logo` text in `index.html`.
- Swap the `🧠` emoji in `.logo-icon` for an inline SVG of Concept A.
- Update `PROJECT_DETAIL.md` and `CLAUDE.md` references from "BrainArena" → "MindForge."
- Reserve domain options: `mindforge.app`, `mindforge.games`, `playmindforge.com` (assuming availability).
- Future: design a wordmark version that combines the spark mark with the "MindForge" wordmark for marketing pages.

---

## Outcome (resolved)

The platform shipped as **Synapse** with the tagline *"Spark Your Thinking."* Migration steps that were actually taken:

- `index.html` `<title>`, hub `.logo` wordmark, and footer all read **Synapse**.
- The `.logo-icon` is an inline SVG of two neuron nodes connected by a glowing arc, with an animated yellow spark above — closer to Concept C ("Sparked Brain" mark) of the **Synapse** candidate than the **MindForge** anvil mock.
- Each game page header reuses the same Synapse wordmark + 🧠 emoji icon (theme.css default).
- `PROJECT_DETAIL.md` and `CLAUDE.md` reference Synapse throughout. No domain has been reserved yet.

This document is preserved as a record of the rename exploration, not as guidance for future work.

---

*Document version: 1.1 — original 2026-05; outcome appended 2026-05-06.*

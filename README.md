# Splendor – Mobile Web Edition

This project recreates the award-winning board game **Splendor** as a mobile-first web experience built with React, Vite, Tailwind CSS, and TypeScript. It is optimized for single-device pass-and-play sessions, mirroring the physical game's flow: collect gems, reserve developments, attract nobles, and be the first to 15 prestige points.

## Highlights
- 🎨 **Mobile-native UI** with large touch targets, bottom action bar, and slide-up action sheets.
- ♟️ **Full official card & noble sets**, faithfully reproduced from Space Cowboys' release.
- 📜 **Rule enforcement & helpers** – token limits, reserve caps, gold wildcards, noble visits, and final-round handling.
- 🧠 **Stateful reducer & context** power deterministic gameplay, logs, and multi-player sequencing without external services.

## Getting Started

```bash
cd splendor-app
npm install
npm run dev
```

Visit the printed local URL (default: `http://localhost:5173`) on desktop or mobile. Use your mobile simulator or device for the intended experience.

## Gameplay Notes
- Configure 2–4 players on the setup screen (custom names supported).
- Use the bottom action bar each turn:
  - **Take Tokens** – up to three different gems or two of a kind (if ≥4 remain). Built-in helpers keep you under the 10-token limit.
  - **Reserve** – select a face-up or mystery card and optionally discard excess tokens after receiving a gold wildcard.
  - **Purchase** – auto-suggests cards you can afford (board + reserved) and displays the exact payment blend.
- Track nobles, decks, player holdings, and recent turns in dedicated panels.
- When someone reaches 15 prestige, the app automatically runs the final round and declares the winner (with Splendor’s fewest-card tiebreaker).

## Data Attribution

Card and noble definitions come from the open-source **[gembalaya](https://github.com/sillle14/gembalaya)** project (MIT License). This repository embeds that data (see `src/data/cards.ts`) and credits the source wherever used.
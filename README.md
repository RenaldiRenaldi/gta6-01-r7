# Solmara: Twelve Debts

[![Competition](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01)
[![Rank](https://make.fun/badge/gta6-01/RenaldiRenaldi/gta6-01-r7/rank.svg)](https://make.fun/bounty/gta6-01)
[![Reward](https://make.fun/badge/gta6-01/RenaldiRenaldi/gta6-01-r7/reward.svg)](https://make.fun/bounty/gta6-01)

Dani Cruz and Mara Sol take on twelve debts in a fictional coastal Jakarta. Follow the story from Mart 24 to the bank vault, or explore Kuningan in Free Roam.

Run `node serve.ts` and open `http://127.0.0.1:8080`.

| Key | Action |
| --- | --- |
| WASD / arrows | Move |
| Space / Shift | Brake and hide / use Focus |
| Click / F | Attack / interact |
| Tab / V / B | Switch character / switch vehicle mode / split up |
| Z / X / C | Call Ines, Lio, or Luz |
| M / R | Progression / tune radio |
| P / Q / Esc | Phone / gear / pause |

Save slots and settings stay in the browser. Completing a debt autosaves to the current slot. Use the pink GPS line to reach mission objectives. In Free Roam, the phone can take you to the pier or back to Kuningan.

The four showcase URLs in `shots.json` stage deterministic views. Package the game and the captures locally with `MAKEFUN_OUTPUT_DIR=out node main.ts`.

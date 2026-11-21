# Solmara: Twelve Debts

[![Competition](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01)
[![Rank](https://make.fun/badge/gta6-01/RenaldiRenaldi/gta6-01-r7/rank.svg)](https://make.fun/bounty/gta6-01)
[![Reward](https://make.fun/badge/gta6-01/RenaldiRenaldi/gta6-01-r7/reward.svg)](https://make.fun/bounty/gta6-01)

Dani Cruz takes on twelve debts in a fictional coastal Jakarta. Follow the story from Mart 24 to the bank vault, or explore Kuningan in Free Roam.

Run `node serve.ts` and open `http://127.0.0.1:8080`.

| Key | Action |
| --- | --- |
| WASD / arrows | Move |
| Space / Shift | Brake and hide / use Focus |
| Click / F | Attack / interact |
| V | Change vehicle mode |
| Z / X / C | Call Ines, Lio, or Luz |
| M / R | Progression / tune radio |
| P / Q / Esc | Phone / gear / pause |

Save slots and settings stay in the browser. Completing a debt autosaves to the current slot. Use the pink GPS line to reach mission objectives. In Free Roam, the phone can take you to the pier or back to Kuningan.

The four showcase URLs in `shots.json` stage the daytime Kumala chase, MART 24 robbery, coastal progression atlas, and sunset title screen. Action and title captures are 1280 × 720; the complete records sheet is 1280 × 1056 so its lower panels stay visible. The campaign follows Dani, with support from Ines, Lio, and Luz. Package the game and the captures locally with `MAKEFUN_OUTPUT_DIR=out node main.ts`.

Dani's full-body scale uses the adjacent car's tire-contact-to-roof height, rather than its body sill or shadow. The shared target is 1.18× in the hero, market, title, and on-foot city render. The stats screen contains a booking portrait, not a standing character beside a vehicle; a person-to-car ratio does not apply there.

November 21 scale audit, measured in the Chromium captures (approximately ±1 px at raster edges):

| Capture | Dani height before → after | Car roof height | Ratio before → after |
| --- | --- | --- | --- |
| Summer hero | 182.1 → 179.2 px | 151.9 px, orange Mariner | 1.199 → 1.180 |
| Spring market | 140.0 → 137.0 px | 116.1 px, foreground cruiser | 1.205 → 1.180 |
| Stats | Booking portrait only | No spatial reference | Not applicable |
| Title | 87.5 → 87.2 px | 73.9 px, orange car | 1.184 → 1.180 |

The checked-in starting captures did not reproduce the reported 1.9× ratio when measured from tire contact to roof. The updated code makes the same 1.18× rule explicit across full-body scenes. In the hero capture Dani spans y≈473.8–653.0 and the car spans y≈501.0–652.8; in market the respective spans are 481.7–618.7 and 555.0–671.1; on the title they are 534.8–622.0 and 548.7–622.6. Shadows and the cruiser's light bar are excluded.

Browser verification covered Continue, confirmed New Game, three writable/loadable slots, debt autosave, persistent sliders/graphics/HUD, Free Roam, all four movement modes, phone apps, and Heat/evidence escape. All four showcase captures repeated byte-for-byte without page errors. Local `makefun check` does not validate the unsealed recording's server-side transcript gates.

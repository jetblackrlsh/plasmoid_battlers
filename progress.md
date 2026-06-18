Original prompt: Create a game based on the provided Plasmoid Battlers concept: a static GitHub Pages web game with Plasmoid collection, battle, gacha, management, local saves, generated visuals, MIDI-style SFX, music, battle result screens, and player profile stats. Commit and push the finished game and provide the GitHub Pages URL.

Progress:
- Initialized a static web game in an otherwise empty repository.
- Confirmed existing music assets in `Music/` and planned direct static references for GitHub Pages.
- The user clarified that built-in chat image generation does not require an API key and should be used for art assets. Found the active session log under `.codex/sessions/2026/06/18`, decoded `image_generation_end.payload.result` base64 PNG data, and saved generated art as `assets/art/home.png`, `summon.png`, `victory.png`, `defeat.png`, and `atlas.png`.
- Implemented static HTML/CSS/JS gameplay: battle turns, type advantage, switching, gacha, team management, profile totals, local saves, music, generated art backgrounds, WebAudio MIDI-style SFX, battle summary modal, `render_game_to_text`, and `advanceTime(ms)`.
- Verified desktop and mobile flows with Playwright screenshots and no console errors.
- Added a How To Play page covering Blind Battles, Planned Battles, type advantages, speed, switching, and team building.
- Split Battle Mode into Blind Battles and Planned Battles; Planned Battles scout the enemy team first, allow a temporary counter-pick squad from the vat, then start battle with that matchup.
- Added active-battle hover inspection for active Plasmoid type and speed, a mid-battle forfeit action, and enemy team generation scaled to a comparable weighted stat power level.

TODO:
- Commit and push to `origin` when requested.

# SLING HEIST

A small, asset-light HTML5 canvas arcade game. Serve this folder with any static web server, for example `python3 -m http.server 8000`, and open the page. No build step or API keys are required. The CrazyGames SDK is loaded from their CDN; if unavailable, the game uses local storage and runs without ads.

## One-file local test

Open `sling-heist-local.html` directly in a browser—no server or internet is needed for this test build. It embeds the art, styling and game code and deliberately uses local mode, so CrazyGames ads, account and cloud features cannot be tested in this file. Browsers may restrict saves and sharing on `file://` URLs. After changing the source, regenerate the file with `npm run build:local` (Node.js and npm access are required for that build step). The standard multi-file version remains the portal integration build.

## Files and assets

- `index.html`, `style.css`: responsive shell and UI.
- `sling-heist-local.html`: generated, self-contained offline gameplay-test build.
- `scripts/build-local.mjs`: creates the local HTML from the source files.
- `game.js`: fixed-step game loop, seeded chunks, rendering, controls and progression.
- `physics.js`: testable aim/grace, rope movement, release and swept hazard collision functions.
- `dialogue.js`: original contextual fourth-wall remarks for the thief.
- `platform.js`: CrazyGames v3 boundary and local fallback; portal subclasses are starting points, not working integrations for those portals.
- `config.js`: tuning constants and cosmetic catalog.
- `ui.js`: reusable UI and PNG share card.
- `assets/vault-bg.jpg`: AI-generated background created for this project. All other art and sound are procedurally drawn/generated. No third-party game assets required. Fonts use system fallbacks if Google Fonts is unavailable. For future replacements, check licenses and attribution at Kenney.nl (CC0) or OpenGameArt.org (filter for CC0).

## Tuning reference

All central physics and economy constants are in `config.js`: prototype gravity 1100 px/s²; overall simulation speed 0.72×; starting speed 260 px/s; drag 0.995/frame; grapple reach 450 px; cone ±60°; reel 0.995/frame; perfect window 20–70°; input buffer 100ms; coyote 90ms; chunks 320px; alarm 120 + 18√distance px/s, cap 520 (currently scaled vertically by `FLOOR_VERTICAL_FACTOR = 0.08` to accommodate the side-scrolling view, so this is **not** yet the exact requested floor speed); hazard telegraph 0.6s; revive 150 coins; invulnerability 2s; daily par 640m; reward cooldown 3 minutes. The catalog lists the cosmetic prices and colors.

## CrazyGames submission QA

- Enable Progress Save in the CrazyGames submission settings. Run on the portal and with `?sdk=local` and `?sdk=full` using the official SDK QA environment; confirm initialization, loading, gameplay, data, account and banner events.
- Check unfilled, disabled, cooldown, and blocked ads. Reward only on `adFinished`; retry must never block. Confirm audio mutes only on `adStarted`, including SDK mute settings. Check that rewarded offers are optional and no rewarded revive and midgame are chained.
- Check banner dimensions and no HUD overlap on supported mobile sizes; do not show banners during gameplay. Confirm the screen remains useful for at least five seconds on average before enabling banners in production.
- Exercise mouse, touch, Space and remapped key; pause/visibility/blur, portrait/landscape, fullscreen and orientation changes.
- Test cloud save across login/devices, corrupt saves, guest/offline storage, UTC date rollover/streaks, and all purchases. Check that profile sign-in is only player initiated.
- Open a challenge in the portal, verify seed and ghost, and test PNG download. Check mobile performance and repeated retry memory over 100 runs.
- Playtest the course, accessibility, difficulty and economics; verify localization and run lengths before submission.

## Store description

One rope. One vault. One big score.
Swing through a laser-filled vault in this one-tap arcade heist.
Snatch shiny loot and chain perfect releases for huge combos.
Outrun the alarm, unlock your look, and take on a new daily vault.
Challenge a friend: can they beat your getaway?

## Thumbnail concepts

Create both 512×512 and 1280×720 crops for each concept, keeping the subject and title inside the square-safe center.

1. Masked thief mid-swing over a red laser, gold coins spilling behind.
2. Close-up of the thief barely clearing a laser, with a giant “SO CLOSE!” reaction.
3. Thief versus alarm floor, yellow rope sweeping across a dark vault.
4. Split diagonal: a ninja and a robot race for a glowing gem.
5. Giant golden vault door opening to reveal the thief and a mountain of loot.
6. A rope arc and a bold ×5 combo with a dramatic green perfect-release flash.

## SDK references

Integration was checked against the CrazyGames [game](https://docs.crazygames.com/sdk/game/), [video ads](https://docs.crazygames.com/sdk/video-ads/), [banners](https://docs.crazygames.com/sdk/banners/), [data](https://docs.crazygames.com/sdk/data/), [user](https://docs.crazygames.com/sdk/user/) and [advertisement requirements](https://docs.crazygames.com/requirements/ads/) pages. The SDK's current invite API is `game.inviteLink(params)` and `game.getInviteParam(key)`.

## Known gaps before production

This is a playable prototype, not a submission-ready implementation of the complete brief. In particular, UI text is currently English only; the generated sections do not yet implement all twelve requested hand-authored obstacle templates, falling platforms or one-way lasers, nor is solvability formally verified. Coyote time now remembers the last valid anchor for 90 ms after it leaves the aim cone, provided it remains ahead and within reach; its feel still needs human playtesting. The intended music, full particle/shake/hit-stop treatment, contextual three-step tutorial, and full slow-motion high-score presentation are not complete. The new ready state waits for the player before starting or retrying; the slower prototype physics deliberately differ from the original brief after player feedback and need human playtesting. Run length, difficulty and coin economy need further tuning. Ghost links contain up to the first 75 seconds at 10 Hz and are lossy. The other portal adapter classes are stubs only. Run `npm test` for physics unit tests and a mock-SDK smoke test. The smoke test uses a mock SDK and DOM; it is not a substitute for testing the real CrazyGames QA tool, adblock, browsers or 100 real consecutive runs.

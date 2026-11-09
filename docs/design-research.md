# Sling Heist: design and market research

This is a starting point for the design conversation, not a prediction of success. References are design examples; do not copy their characters, artwork, dialogue or visual identity.

## What the games teach us

1. **Stickman Hook — a clear one-input fantasy.** Its CrazyGames page describes holding the mouse button to grapple, angle- and gravity-based swinging, progressive challenges and unlockable characters. Our lesson: make the anchor, arc and release understandable at a glance; give players time to learn before adding complicated threats. The page does not establish its earnings. [1](https://www.crazygames.com/game/stickman-rope)
2. **Crossy Road — optional monetization and collectible personality.** Its developers reported $10 million in revenue and 50 million downloads over its first 90 days in 2014–15, across mobile platforms. Revenue is not profit and these figures are historical, not a forecast for a CrazyGames title. The reported approach included unobtrusive purchases and optional ads; our lesson is to make the base game enjoyable without spending and earn interest through expressive cosmetic variety. CrazyGames has its own rules and permitted monetization formats. [2](https://www.polygon.com/2015/3/3/8142247/crossy-road-earnings-10-million-gdc-2015/)
3. **Bob the Robber 2 — readable heist ingredients.** Its portal description mentions side-view locations, loot, traps, lasers and guards. Our lesson: make every screen look recognizably like a heist, while keeping the action easy to read. The listing does not establish revenue. [3](https://www.crazygames.com/game/bob-the-robber-2)
4. **Escaping the Prison — personality in failure.** Its portal description shows a choice-based escape game with varied failure scenarios. Our lesson: a failed run can deliver a short, original, sympathetic joke and an immediate retry; the game must never insult the player or obscure why they failed. It is an example of characterful presentation, not evidence about its revenue. [4](https://www.crazygames.com/game/escaping-the-prison)
5. **Subway Surfers — freshness around a recognizable core.** A mobile-marketing analysis describes ongoing characters, missions, events and world updates. Our lesson: later vault themes and cosmetic characters can make the same accessible core feel fresh. Do not assume its download figures are profits or that its mobile monetization translates directly to CrazyGames. [5](https://www.blog.udonis.co/mobile-marketing/mobile-games/subway-surfers)

## Proposed original creative direction

**A cheeky, slightly overconfident thief and the human player form a two-person getaway team.** The thief knows the player is there, celebrates smart swings and reacts to close calls. The comedy should be brief, original and affectionate; it should never compete with hazards, interrupts or repeat constantly.

- **Character:** an unmistakable silhouette, large expressive eyes/mask, a signature scarf, grappling glove and a loot bag that responds to movement. A few clear facial and body poses are more useful than tiny details that vanish on a phone.
- **Environment:** layered 2D vault rooms: dark teal/navy architecture, warm gold loot, distinct cyan anchor points and high-contrast red/orange hazards. Use shape and movement in addition to color. Keep the path and grappling targets cleaner and brighter than background detail.
- **Progression of themes:** begin with one polished vault, then explore new areas such as a jewel gallery or high-security lab. This is a proposed creative direction, not existing content.
- **Moment-to-moment hook:** give the player time to prepare, hold to swing, release with momentum, narrowly escape a hazard, hear a short quip, and choose to try again. The character is the player's accomplice, not a critic.
- **Monetization:** prioritize a fair, replayable game; ads must be optional or placed at allowed natural breaks and follow current CrazyGames rules. In particular, do not interrupt gameplay or chain a rewarded revive with a midgame ad between the same levels. [6](https://docs.crazygames.com/requirements/ads/)

## UI text and layout audit

A headless Chromium check of the standalone local build identified two concrete issues: the desktop-style side-card layout overlapped the main actions at 390×844 and extended beyond the screen at 320×568; the speech bubble could overlap the start instructions at 320×568 and 844×390. The menu now scrolls in narrow layouts, controls wrap or shrink, and speech/instruction positions reserve space for each other. We checked these specific elements in headless Chromium at 1280×720, 390×844, 320×568, 844×390 and 320×400; this is not a substitute for testing every panel, browser, actual device, translation or portal frame. Share a screenshot, browser and screen size if a different piece of text is still misplaced.

## References and assets that would help

- First: one to three reference images, sketches or links to establish character shape, mood, color and the kind of humor the owner likes. References are for discussion, not assets to copy.
- First actual asset: an original transparent PNG character concept, ideally a clean full-body pose at approximately 1024px or larger. Separate head, torso, arms, legs and bag as transparent layers when possible; one flattened image is still helpful. Include permission or license information for any third-party or AI-generated material.
- Optional: a background concept in a wide format such as 1920×1080, without UI or text, preferably with separate back/middle/foreground layers. The final export will need optimization and portrait-safe framing.
- We can prototype shapes, animation, interface and physics without waiting for final art. Approval of a concept should come before producing a full cosmetic set.

## Work sequence

1. Agree on the thief's visual and comedic identity from references.
2. Validate a human-friendly swing and readable opening area with small playtests.
3. Implement and test one polished character and one vault section first.
4. Expand hazards, dialogue and cosmetic variety only after that slice feels good.
5. Test menus and in-game text in real phone, desktop and portal environments, including larger fonts and translations.
6. Review ad flow and saves against the current portal requirements before submission.

Success measures for future playtests: can a new player understand the first swing without help, how long does the first run last, do they choose to retry, and can they identify why they lost? These are hypotheses and measurement ideas, not claims that the present prototype is already balanced or viral.

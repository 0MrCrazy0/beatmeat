# Splatter Circuit v4
**Created by MrCrazy**: game idea, design and direction.

Splatter Circuit is an original full-screen HTML5 fighting game and belt-scroller for PC and mobile. It plays fully offline as an installable PWA. It combines special-move fighting (motions, supers, X-Rays, finishers) with two co-op street-brawler campaigns.

## Run it locally
Serve the folder over HTTP, for example `python3 -m http.server 8000`, then open http://localhost:8000. Serving it this way lets the service worker cache the game, so it then works offline and can be installed. Opening index.html directly also works, but without offline caching.

## Deploy (static hosting, no build step)
The folder is already a finished static site. Upload it as-is, with `index.html` at the root.
- **Netlify:** go to app.netlify.com, then Add new site > Deploy manually, and drag the folder (or the unzipped zip) onto the page. Or run `npx netlify-cli deploy --dir . --prod` from inside the folder.
- **GitHub Pages:**
  1. Push the folder's contents to a repo.
  2. Go to Settings > Pages > Deploy from a branch, choose `main` and `/ (root)`.
  3. The game goes live at `https://<user>.github.io/<repo>/`. All paths are relative, so a sub-path works.
- **itch.io:**
  1. Zip the folder's *contents* so that index.html sits at the zip root.
  2. Create a new project and set Kind of project to HTML.
  3. Upload the zip and tick "This file will be played in the browser".
  4. Set the viewport to 960x540 and enable the Fullscreen button and Mobile friendly.
- Any HTTPS host works. HTTPS is needed for offline/PWA install and gamepad vibration.

## Modes
- **Story**: two campaigns, each for 1 or 2 players in co-op. P2 can join at any time with START.
  - **Take Back the City**: a street war against the Malgrave crime family, in 8 districts. You get riot-van backup (BLOCK+RUN, once per life).
  - **Blood Vendetta**: a rescue-and-revenge run through 6 missions, with hazards: pits, spikes and conveyors.
  - Both campaigns have lives, shared continues that carry across stages, score and extra lives, initials on the leaderboard, and auto-save with CONTINUE.
  - Each has a good ending, and a bad ending if you need a continue in the final two stages.
- **Arcade**: a ladder that ends at The Warden, with an ending for each fighter.
- **Versus** (with stage select), **Survival**, **CPU Battle**.
- **Training**: dummy modes, hitboxes, input display, meter fill and on-screen controls.
- **Tutorial**, **How to Play**.
- **Extras**: gallery, achievements, stats, leaderboard and unlocks.
- **Attract demo**: plays after the title screen sits idle.

**Pause works in every mode** (Start / Enter / Esc). The menu has Resume, Move List, Settings, Controls, Restart and Quit, and in story it saves your progress. Returning from Settings restores the exact game state.

## Default controls
| Action | P1 keyboard | P2 keyboard | Pad (2x2 default) | Pad (6-button preset) |
|---|---|---|---|---|
| Move | W A S D | Arrows | Stick / D-pad | Stick / D-pad |
| Low / High punch | U / I | Num7 / Num8 (or [ / ]) | X□ / Y△ | X□ / Y△ |
| Low / High kick | J / K | Num4 / Num5 (or ; / ') | A✕ / B○ | A✕ / B○ |
| Block | Space (or Q) | Num0 (or ,) | LB / L1 | LB / L1 |
| Run | O | Num9 (or .) | RB / R1 | RT / R2 |
| Special (SP) | L (or E) | Num6 (or /) | RT / R2 | RB / R1 |
| Start / Pause | Enter | NumEnter (or \) | Start / Options | Start |
| Back | Esc / Backspace | Num+ (or -) | Back / Share | Back |

- The two keyboard layouts share no keys, so two players can use one keyboard.
- Keys can be rebound under Settings > Controls. Pad layout (2x2 or 6-button), deadzone, vibration and per-player remaps are also there.
- Touch screens get a floating stick and a 2x2 punch/kick cluster with BLOCK, RUN and SP. The layout, size and opacity can all be edited.
- Pad prompts switch automatically between Xbox, PlayStation and Switch glyphs.
- **The same inputs work in Versus and Story.** In story:
  - TAP ↑ to jump; HOLD ↑ or ↓ to change lane.
  - ↓↓ sidesteps, →→ dashes, ←← backdashes.

## Universal system
- **Specials:** a motion plus a button (shown with arrows relative to facing right), or **SP + direction** for the simple version. Hold RUN while doing a special for an **EX** version (1 bar). Charge moves: hold ← or ↓ for a moment, then release into the motion.
- **Meter (3 bars):**
  - **Super:** ↓→↓→+HP, or SP+RUN (2 bars).
  - **X-Ray:** ↓←↓←+HK, or SP+BLOCK (3 bars).
  - **Breaker:** SP+BLOCK while being hit (1 bar).
- **Movement:** dash, backdash (briefly invincible), 3D sidestep (↓↓, Tekken style), run, and a short pre-jump.
- **Defence:**
  - Block; ↓+BLOCK blocks low.
  - Parry: tap → just before a hit, or ↓ for lows.
  - Tech roll: press any button as you land.
  - Throw: →+LP up close.
- **Combos:** target combos (up to 10-hit strings), cancels, juggle scaling, counter hits, and input buffering during hit-freeze.
- **Finishers:** at END THEM!, enter a finisher motion, or SP+↓/↑/→. ↓↓+BLOCK (or SP+←) is the stage kill on arenas that have one.
- **Street moves (story):**
  - Grab a dizzy enemy, then LP x3 for knees, ↓+LP for an elbow, ↑+LK for a rising knee, and LK/HK to throw (←+LK/HK throws backward).
  - ←+HP is a back elbow on an enemy behind you.
  - LK+HK in the air is a cyclone kick.
  - Weapons: LP picks up and HK throws knives.
  - SP+RUN with less than 2 bars is the star move.
  - Mash to escape bear-hugs.
- The **Move List** (pause menu) shows every move for your fighter, with your current device's button icons.

## Roster
### RAZOR VANCE: CHAIN BOXING
Relentless pressure. Chains rekka follow-ups and hunts the corner.

- **Specials:** SHOCK KNUCKLE (↓ → +LP), CHAIN RUSH (↓ → +HP), BREAKER KNEE (← → +LK), GUT HOOK (← ← +HP), JAILBREAK UPPER (→ ↓ → +HP)
- **Target combos:** LP > LP > HP | HP > HP > LP > HK
- **Command normals:** CELL DOOR (→+HP), LOW CHAIN (←+LK)
- **Super:** PRISON RIOT | **X-Ray:** SOLITARY CONFINEMENT
- **Finishers:** CHAIN SNAP (→ → ↓ +HP), TRAIN WRECK (↓ ↓ → +HK), LIMB LOCK (← → ← +LP)

### KIRA NEON: WHEEL-FU
Fastest walk and dash in the Circuit. Low health, high-low skate mix-ups and an air dive.

- **Specials:** RAZOR DISC (↓ ← +LP), SKATE SLASH (← → +HK), WHEELIE RISE (↓ ↑ +HK), RAIL GRIND (↓ → +LK), DIVE BOMB (in air: ↓+HK)
- **Target combos:** LK > LK > HP > HK | LP > LK > HK
- **Command normals:** SHIN SPLITTER (→+LK), ELBOW PAD (→+HP)
- **Super:** DERBY JAM | **X-Ray:** SKULL GRIND
- **Finishers:** SPIN CUT (← → ← +LK), DISC STORM (→ ↓ → +HP), LEG SWEEPER (↓ ↓ ← +HK)

### OKAFOR: STORM ZONER
Controls the whole screen with lightning. Slow walk, strong anti-airs, keeps you out.

- **Specials:** THUNDER ORB (↓ → +HP), SKY BOLT (↓ → +LP), STORM CALL (↓ ← +HP), SKY STEP (↓ ↑ +LK), STATIC RISE (← → +HP), ION FIELD (↓ ↓ +LP)
- **Target combos:** LP > HP > HP > LK | LK > HK
- **Command normals:** PALM OF HEAVEN (←+HP), CLOUD KICK (→+HK)
- **Super:** NINTH CLOUD | **X-Ray:** GROUNDED
- **Finishers:** LIGHTNING ROD (↓ ↓ ↑ +HP), OVERLOAD (← ← → +LK), STORM SPLIT (→ ← → +HK)

### MR. GRAVES: GRAVE WALKER
Vanishes and reappears behind or above you. Grave Hands lock down the ground.

- **Specials:** SKULL TOSS (↓ ← +HP), GRAVE HANDS (↓ ↓ +LK), SOUL STEP (↓ ← +LK), CROW DROP (↓ ↑ +LP), COFFIN SNAP (← → +HP)
- **Target combos:** HP > LP > HP > HK | LP > LP > LK
- **Command normals:** LID SLAM (→+HP), SPADE SWEEP (←+HK)
- **Super:** MASS GRAVE | **X-Ray:** EMBALMED
- **Finishers:** ROT AWAY (← → ↓ +LP), SIX FEET UNDER (→ ← ↓ +HK), EXHUMED (↓ ← ↓ +HP)

### MAGMA MAE: PIT WRESTLING
Huge health and the most damaging throws. Slow, but one read means half your life bar.

- **Specials:** VOLCANO SLAM (→ ← +HP), MAGMA SPIT (↓ → +LP), ERUPTION (↓ ↑ +HK), LAVA LARIAT (← → +LP), CALDERA DROP (→ ↓ ← +HK)
- **Target combos:** HP > HP > HK | LP > LP > HP
- **Command normals:** LAVA HEADBUTT (→+HP), CLOTHESLINE (←+HP)
- **Super:** PYROCLASTIC PILEDRIVER | **X-Ray:** MOLTEN CORE
- **Finishers:** MELTDOWN (↓ → ↓ +HP), MAGMA BOMB (→ → → +LK), WISHBONE (← ← → +HP)

### DR. HEX: TWO-FORMULA
Swaps between CALM (safe, zoning) and FRENZY (fast, brutal normals, takes more damage).

- **Specials:** ACID FLASK (↓ → +HK), BLINK SERUM (↓ ← +LP), CENTRIFUGE (← → +LP), MUTAGEN (↓ ↓ +HP), TOXIC CLOUD (↓ ← +HK)
- **Target combos:** LP > LP > HP > LK | LK > LK > HK
- **Command normals:** SCALPEL (→+LP), SYRINGE POKE (←+LK)
- **Super:** OVERDOSE | **X-Ray:** BIOPSY
- **Finishers:** DISSOLVE (← ← ↓ +HK), VOLATILE (↓ → → +HP), AMPUTATION (→ ← ← +LP)

### TUSK: BONE-YARD BRAWL
Hold back or down to store power. Charge moves come out instantly and hit like a truck.

- **Specials:** GORE CHARGE ([← hold] → +HP), MUD SLING ([← hold] → +LP), HOG HOP ([↓ hold] ↑ +HK), QUAKE STOMP (↓ ↓ +HK), TUSK TOSS (→ ← +LP)
- **Target combos:** HP > LP > HK | LK > LK > HP
- **Command normals:** SKULL BASH (→+HP), HOOF STOMP (←+HK)
- **Super:** STAMPEDE | **X-Ray:** GORED
- **Finishers:** TRAMPLE (→ → ← +HK), SKEWER (↓ ↓ ↓ +HP), SPLIT HOG (← → → +HP)

### SOL REYES: QUICKDRAW
Fast bullets at every angle, a lasso to drag you in and a fan-the-hammer volley.

- **Specials:** SIDEWINDER (← → +LP), SKY SHOT (↓ → +LP), DUST DEVIL (↓ → +LK), HIGH NOON (→ → +HP), FAN THE HAMMER (↓ ← +HP), LASSO (← ← +LK)
- **Target combos:** LP > HP > LK > HK | LP > LP > HK
- **Command normals:** SPUR KICK (→+HK), PISTOL WHIP (←+HP)
- **Super:** DEAD MAN'S HAND | **X-Ray:** GUT SHOT
- **Finishers:** SIX SHOOTER (← ← ← +LP), SUNSTROKE (↓ ← → +HK), KNEECAPPER (↓ ↓ → +LP)

### GLITCH: FRAME-PERFECT
Kickboxing built from memorised strings, including a 10-hit FATAL ERROR, plus a parry stance.

- **Specials:** BIT BLAST (↓ → +LK), LAG SPIKE (↓ ← +HK), FIREWALL (← → +LK), BUFFER PARRY (↓ ↓ +LP), PACKET STORM (↓ ↑ +HP)
- **Target combos:** LP > LP > LK > LK > HP > LP > HK > HK > HP > HK | LK > LP > LK > HK | LP > LK > HP
- **Command normals:** STEP KICK (→+LK), BACKSPACE (←+HP)
- **Super:** BLUE SCREEN | **X-Ray:** HARD RESET
- **Finishers:** DELETE (→ ↓ ← +LK), SYSTEM CRASH (↑ ↑ ↓ +HP), CTRL+X (← ← → +HK)

### GOLIATH-9: RIOT ARMOR
Heavy attacks absorb one hit. Massive health, very slow.

- **Specials:** ROCKET FIST (↓ → +HP), PISTON CHARGE (← → +HK), COMPACTOR (→ ← +HP), SEISMIC SLAM (↓ ↓ +HK), TURRET (↓ ← +LP)
- **Target combos:** HP > HP > HK | LP > HP
- **Command normals:** HYDRAULIC PUNCH (→+HP)
- **Super:** MELTDOWN PROTOCOL | **X-Ray:** HYDRAULIC CRUSH
- **Finishers:** SCRAP PRESS (→ → ↓ +HP), REACTOR LEAK (↓ ↓ ← +HK), DISASSEMBLE (← → ← +HP)

### THE WARDEN: THRONE ARTS
A boss with every tool: zoning, teleports, a throne counter and crushing damage.

- **Specials:** VOID SPHERE (↓ → +LP), PHASE (↓ ← +LK), GRASP OF THE THRONE (↓ ↓ +HP), THRONE COUNTER (↓ ← +HP), JUDGEMENT (← → +HK)
- **Target combos:** LP > HP > HK | LK > LK > HP > HK
- **Command normals:** SCEPTRE CRUSH (→+HP)
- **Super:** FINAL SENTENCE | **X-Ray:** CONDEMNED
- **Finishers:** SENTENCED (← → ↓ +HP), ERASURE (↓ ↓ → +LK), QUARTERED (→ ← → +HK)

## Settings
- **Audio:** volume for music, SFX and voice, plus announcer and voices on/off.
- **Display:** quality (low/medium/high), FPS cap (30/60/unlimited), screen shake, screen blood and fullscreen.
- **Accessibility:** colour-blind modes (deuteranopia and tritanopia), text size and simple inputs.
- **Input:** keyboard bindings, a pad remap for each player, deadzone, single-pad P2, and the touch layout.
- **Save:** progress saves automatically to local storage. Export/Import moves a save between devices.

## Credits
Created by MrCrazy. All characters, stages, story, art, music and sound are original and procedurally generated in code.

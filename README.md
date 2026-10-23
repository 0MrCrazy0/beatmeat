# Splatter Circuit v6
**Created by MrCrazy**: game idea, design and direction.

Splatter Circuit is an original full-screen HTML5 fighting game and belt-scroller for PC and mobile. It plays fully offline as an installable PWA. It combines special-move fighting (motions, supers, X-Rays, finishers) with two co-op street-brawler campaigns.

## What's new in v6
- **Story mode uses the full versus kit**: normals, flips, air combos, flying kick, roundhouse wall bounce, specials, EX (special + RUN), supers (SP+RUN, 2 bars), X-Rays (SP+BLOCK, 3 bars) and throws / command grabs, with the full gore system.
- **Story launcher**: land HEAVY PUNCH launcher and hold or tap UP to jump-cancel after the airborne enemy, then juggle (juggle damage scales down after 3 hits).
- **Wall bounce** off the screen edges in story, leaving blood stains on the wall.
- **Story X-Ray** cinematic with bone-crack stages. X-Rays take 20% of a boss's health; supers are capped at 30% of a boss bar.
- Street enemies have +30% health and bosses +20% to suit the stronger kit. Both campaigns have been tested clear, solo and co-op.
- **Portraits re-framed automatically per fighter** for every size: select grid, HUD, results, VS, cutscenes, gallery and ladder strips. Nobody is cropped any more.
- **Weapons are held in the hand properly.** Pipe, bat, knife and chain are attached at the fist with a grip point, follow the arm through every pose for both facings, and each has its own swing arc and smear. Hit reach matches the visible tip. Durability is only used up on contact. Weapons drop when you are knocked down and can be picked up again ([LP] PICK UP prompt), keeping their remaining durability. Thrown knives spin in flight and can be picked up where they land.
- Pickups: food has its own eat sound and cash its own coin sound, and stars can no longer be eaten as food (that bug lost the star).
- QA polish: prompt bar no longer covers names, cutscene counter moved off the portrait, pause BACK clears the meters, story-select portrait has a margin, version labels updated.

## What's new in v5
- **Every button works.** Mouse, touch, keyboard and gamepad were each tested on every screen. Every menu has a BACK button. Mouse hover gets a highlight. There is a clickable pause button for mouse players.
- **Touch controls:**
  - The joystick is anchored by default (FIXED). FLOAT mode re-centres only where your thumb first lands.
  - **Settings > Edit Touch Layout:** UNLOCK, drag a control, use BIGGER/SMALLER, then LOCK. The layout is locked by default.
  - Buttons are bigger and multitouch works. Scrolling, zooming and long-press menus are blocked during play.
- **Button theme:** MK-style 4 attacks plus BLOCK. Punches are red with a fist icon, kicks blue with a boot, BLOCK is steel with a shield, SP gold, RUN green. The HOW TO PLAY table is generated from your live key and pad bindings.
- **Moves:**
  - Flip jumps, plus a distinct jump attack per button: jab, hammer-fist overhead, knee, spin roundhouse.
  - FLYING KICK (flip forward, then HK) and ROUNDHOUSE (B+HK).
  - **Air combos** (3 different air buttons on hit) and **wall bounce**.
  - Glitch's bicycle-kick special INFINITE LOOP (B,F+HK).
  - Move lists use MK notation (B,F+HP).
- **Fixes:** the back-leg texture flip is fixed. Scaling was checked at 8 sizes from 360x640 to 3840x2160, including notch and home-bar safe areas. Heavy hits get an impact flash and juggles throw extra gore.

## Deploy with Netlify Drop (fastest)
1. Unzip `SplatterCircuit-v5.zip`.
2. Open **https://app.netlify.com/drop** in a browser and sign in, or create a free account.
3. Drag the **`SplatterCircuit-v5` folder** (the one with `index.html` directly inside it) onto the drop area.
4. Wait for the upload to finish. Netlify gives you a live `https://<random-name>.netlify.app` link.
5. Optional: under Site configuration > Change site name, pick a nicer address.
6. To update later, open the site, go to Deploys, and drag the new folder onto it again.

*No server?* `SplatterCircuit-v5-singlefile.html` is the whole game in one file. Double-click it to play offline in any modern browser, or drop it on any static host. It has no service worker, so it does not install as an app.

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
| Light / Heavy punch (LP / HP) | U / I | Num7 / Num8 (or [ / ]) | X□ / Y△ | X□ / Y△ |
| Light / Heavy kick (LK / HK) | J / K | Num4 / Num5 (or ; / ') | A✕ / B○ | A✕ / B○ |
| Block | Space (or Q) | Num0 (or ,) | LB / L1 | LB / L1 |
| Run | O | Num9 (or .) | RB / R1 | RT / R2 |
| Special (SP) | L (or E) | Num6 (or /) | RT / R2 | RB / R1 |
| Start / Pause | Enter | NumEnter (or \) | Start / Options | Start |
| Back | Esc / Backspace | Num+ (or -) | Back / Share | Back |

- The two keyboard layouts share no keys, so two players can use one keyboard.
- Keys can be rebound under Settings > Controls. Pad layout (2x2 or 6-button), deadzone, vibration and per-player remaps are also there.
- Touch screens get a **fixed** joystick (FLOAT is optional in Settings) and a 2x2 punch/kick cluster with BLOCK, RUN and SP.
  - To move or resize controls: Settings > Edit Touch Layout > UNLOCK, then drag, use BIGGER/SMALLER, then LOCK. Opacity can also be edited.
  - Controls always stay inside the screen's safe area.
- Pad prompts switch automatically between Xbox, PlayStation and Switch glyphs.
- **The same inputs work in Versus and Story.** In story:
  - TAP ↑ to jump; HOLD ↑ or ↓ to change lane.
  - ↓↓ sidesteps, →→ dashes, ←← backdashes.

## Universal system
- **Specials:** a motion plus a button (MK notation: F = toward the opponent, B = away, D = down, U = up; e.g. B,F+HP), or **SP + direction** for the simple version. Hold RUN while doing a special for an **EX** version (1 bar). Charge moves: hold ← or ↓ for a moment, then release into the motion.
- **Meter (3 bars):**
  - **Super:** D,F,D,F+HP, or SP+RUN (2 bars).
  - **X-Ray:** D,B,D,B+HK, or SP+BLOCK (3 bars).
  - **Breaker:** SP+BLOCK while being hit (1 bar).
- **Movement:** dash, backdash (briefly invincible), 3D sidestep (D,D), run, and a short pre-jump.
- **Defence:**
  - Block; D+BLOCK blocks low.
  - Parry: tap F just before a hit, or D for lows.
  - Tech roll: press any button as you land.
  - Throw: F+LP up close.
- **Kicks and air game:**
  - B+HK roundhouse (wall bounce).
  - Flip jumps (U+F / U+B), and jump LP / HP (overhead) / LK / HK.
  - FLYING KICK: flip forward, then HK (wall bounce).
  - Air combos: chain 3 different air buttons on hit.
  - Wall bounces happen once per combo, so keep the juggle going.
- **Combos:** target combos (up to 10-hit strings), cancels, juggle scaling, counter hits, and input buffering during hit-freeze.
- **Finishers:** at END THEM!, enter a finisher motion, or SP+D/U/F. D,D+BLOCK (or SP+B) is the stage kill on arenas that have one.
- **Street moves (story):**
  - Grab a dizzy enemy, then LP x3 for knees, ↓+LP for an elbow, ↑+LK for a rising knee, and LK/HK to throw (←+LK/HK throws backward).
  - ←+HP is a back elbow on an enemy behind you.
  - LK+HK in the air is a cyclone kick.
  - Weapons: LP picks up and HK throws knives.
  - SP+RUN with less than 2 bars is the star move.
  - Mash to escape bear-hugs.
- The **Move List** (pause menu) shows every move for your fighter, with your current device's button icons.

## Roster
Every fighter has their own specials, strings, command normals, super, X-Ray and finishers.

### RAZOR VANCE: CHAIN BOXING
Relentless pressure. Chains rekka follow-ups and hunts the corner.

- **Specials:** SHOCK KNUCKLE (D,F+LP), CHAIN RUSH (D,F+HP), BREAKER KNEE (B,F+LK), GUT HOOK (B,B+HP), JAILBREAK UPPER (F,D,F+HP)
- **Target combos:** LP, LP, HP | HP, HP, LP, HK
- **Command normals:** CELL DOOR (F+HP), LOW CHAIN (B+LK)
- **Super:** PRISON RIOT | **X-Ray:** SOLITARY CONFINEMENT
- **Finishers:** CHAIN SNAP (F,F,D+HP), TRAIN WRECK (D,D,F+HK), LIMB LOCK (B,F,B+LP)

### KIRA NEON: WHEEL-FU
Fastest walk and dash in the Circuit. Low health, high-low skate mix-ups and an air dive.

- **Specials:** RAZOR DISC (D,B+LP), SKATE SLASH (B,F+HK), WHEELIE RISE (D,U+HK), RAIL GRIND (D,F+LK), DIVE BOMB (in air: D+HK)
- **Target combos:** LK, LK, HP, HK | LP, LK, HK
- **Command normals:** SHIN SPLITTER (F+LK), ELBOW PAD (F+HP)
- **Super:** DERBY JAM | **X-Ray:** SKULL GRIND
- **Finishers:** SPIN CUT (B,F,B+LK), DISC STORM (F,D,F+HP), LEG SWEEPER (D,D,B+HK)

### OKAFOR: STORM ZONER
Controls the whole screen with lightning. Slow walk, strong anti-airs, keeps you out.

- **Specials:** THUNDER ORB (D,F+HP), SKY BOLT (D,F+LP), STORM CALL (D,B+HP), SKY STEP (D,U+LK), STATIC RISE (B,F+HP), ION FIELD (D,D+LP)
- **Target combos:** LP, HP, HP, LK | LK, HK
- **Command normals:** PALM OF HEAVEN (B+HP), CLOUD KICK (F+HK)
- **Super:** NINTH CLOUD | **X-Ray:** GROUNDED
- **Finishers:** LIGHTNING ROD (D,D,U+HP), OVERLOAD (B,B,F+LK), STORM SPLIT (F,B,F+HK)

### MR. GRAVES: GRAVE WALKER
Vanishes and reappears behind or above you. Grave Hands lock down the ground.

- **Specials:** SKULL TOSS (D,B+HP), GRAVE HANDS (D,D+LK), SOUL STEP (D,B+LK), CROW DROP (D,U+LP), COFFIN SNAP (B,F+HP)
- **Target combos:** HP, LP, HP, HK | LP, LP, LK
- **Command normals:** LID SLAM (F+HP), SPADE SWEEP (B+HK)
- **Super:** MASS GRAVE | **X-Ray:** EMBALMED
- **Finishers:** ROT AWAY (B,F,D+LP), SIX FEET UNDER (F,B,D+HK), EXHUMED (D,B,D+HP)

### MAGMA MAE: PIT WRESTLING
Huge health and the most damaging throws. Slow, but one read means half your life bar.

- **Specials:** VOLCANO SLAM (F,B+HP), MAGMA SPIT (D,F+LP), ERUPTION (D,U+HK), LAVA LARIAT (B,F+LP), CALDERA DROP (F,D,B+HK)
- **Target combos:** HP, HP, HK | LP, LP, HP
- **Command normals:** LAVA HEADBUTT (F+HP), CLOTHESLINE (B+HP)
- **Super:** PYROCLASTIC PILEDRIVER | **X-Ray:** MOLTEN CORE
- **Finishers:** MELTDOWN (D,F,D+HP), MAGMA BOMB (F,F,F+LK), WISHBONE (B,B,F+HP)

### DR. HEX: TWO-FORMULA
Swaps between CALM (safe, zoning) and FRENZY (fast, brutal normals, takes more damage).

- **Specials:** ACID FLASK (D,F+HK), BLINK SERUM (D,B+LP), CENTRIFUGE (B,F+LP), MUTAGEN (D,D+HP), TOXIC CLOUD (D,B+HK)
- **Target combos:** LP, LP, HP, LK | LK, LK, HK
- **Command normals:** SCALPEL (F+LP), SYRINGE POKE (B+LK)
- **Super:** OVERDOSE | **X-Ray:** BIOPSY
- **Finishers:** DISSOLVE (B,B,D+HK), VOLATILE (D,F,F+HP), AMPUTATION (F,B,B+LP)

### TUSK: BONE-YARD BRAWL
Hold back or down to store power. Charge moves come out instantly and hit like a truck.

- **Specials:** GORE CHARGE (HOLD B 1s, F+HP), MUD SLING (HOLD B 1s, F+LP), HOG HOP (HOLD D 1s, U+HK), QUAKE STOMP (D,D+HK), TUSK TOSS (F,B+LP)
- **Target combos:** HP, LP, HK | LK, LK, HP
- **Command normals:** SKULL BASH (F+HP), HOOF STOMP (B+HK)
- **Super:** STAMPEDE | **X-Ray:** GORED
- **Finishers:** TRAMPLE (F,F,B+HK), SKEWER (D,D,D+HP), SPLIT HOG (B,F,F+HP)

### SOL REYES: QUICKDRAW
Fast bullets at every angle, a lasso to drag you in and a fan-the-hammer volley.

- **Specials:** SIDEWINDER (B,F+LP), SKY SHOT (D,F+LP), DUST DEVIL (D,F+LK), HIGH NOON (F,F+HP), FAN THE HAMMER (D,B+HP), LASSO (B,B+LK)
- **Target combos:** LP, HP, LK, HK | LP, LP, HK
- **Command normals:** SPUR KICK (F+HK), PISTOL WHIP (B+HP)
- **Super:** DEAD MAN'S HAND | **X-Ray:** GUT SHOT
- **Finishers:** SIX SHOOTER (B,B,B+LP), SUNSTROKE (D,B,F+HK), KNEECAPPER (D,D,F+LP)

### GLITCH: FRAME-PERFECT
Kickboxing built from memorised strings, including a 10-hit FATAL ERROR, plus a parry stance.

- **Specials:** BIT BLAST (D,F+LK), LAG SPIKE (D,B+HK), FIREWALL (B,F+LK), BUFFER PARRY (D,D+LP), PACKET STORM (D,U+HP), INFINITE LOOP (B,F+HK)
- **Target combos:** LP, LP, LK, LK, HP, LP, HK, HK, HP, HK | LK, LP, LK, HK | LP, LK, HP
- **Command normals:** STEP KICK (F+LK), BACKSPACE (B+HP)
- **Super:** BLUE SCREEN | **X-Ray:** HARD RESET
- **Finishers:** DELETE (F,D,B+LK), SYSTEM CRASH (U,U,D+HP), CTRL+X (B,B,F+HK)

### GOLIATH-9: RIOT ARMOR
Heavy attacks absorb one hit. Massive health, very slow.

- **Specials:** ROCKET FIST (D,F+HP), PISTON CHARGE (B,F+HK), COMPACTOR (F,B+HP), SEISMIC SLAM (D,D+HK), TURRET (D,B+LP)
- **Target combos:** HP, HP, HK | LP, HP
- **Command normals:** HYDRAULIC PUNCH (F+HP)
- **Super:** MELTDOWN PROTOCOL | **X-Ray:** HYDRAULIC CRUSH
- **Finishers:** SCRAP PRESS (F,F,D+HP), REACTOR LEAK (D,D,B+HK), DISASSEMBLE (B,F,B+HP)

### THE WARDEN: THRONE ARTS
A boss with every tool: zoning, teleports, a throne counter and crushing damage.

- **Specials:** VOID SPHERE (D,F+LP), PHASE (D,B+LK), GRASP OF THE THRONE (D,D+HP), THRONE COUNTER (D,B+HP), JUDGEMENT (B,F+HK)
- **Target combos:** LP, HP, HK | LK, LK, HP, HK
- **Command normals:** SCEPTRE CRUSH (F+HP)
- **Super:** FINAL SENTENCE | **X-Ray:** CONDEMNED
- **Finishers:** SENTENCED (B,F,D+HP), ERASURE (D,D,F+LK), QUARTERED (F,B,F+HK)

## Settings
- **Audio:** volume for music, SFX and voice, plus announcer and voices on/off.
- **Display:** quality (low/medium/high), FPS cap (30/60/unlimited), screen shake, screen blood and fullscreen.
- **Accessibility:** colour-blind modes (deuteranopia and tritanopia), text size and simple inputs.
- **Input:** keyboard bindings, a pad remap for each player, deadzone, single-pad P2, and the touch layout.
- **Save:** progress saves automatically to local storage. Export/Import moves a save between devices.

## Credits
Created by MrCrazy. All characters, stages, story, art, music and sound are original and procedurally generated in code.

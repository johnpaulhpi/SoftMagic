# Soft Magic

*You are the magic inside a legendary sword.*

A browser fantasy-world simulator in the spirit of Dwarf Fortress's legends, played as a Reigns-style
card game. A thousand years pass in a hundred ten-year turns: dwarves under the northern mountains, high
elves on the old-growth coast, humans in a great eastern city, a shared valley between them, and orc tribes
in the swamp barrows of the south who, halfway through the age, are united by a Dark Lord.

You cannot swing yourself. You change the sword's magical properties — Become Sharper, Enhance Holder's
Senses, Magnify Holder's Obsession with Victory, Magnify Holder's Nostalgia for Home, Seek New Holder,
Intensify Holder's Charisma — and the people who carry it change with it.

## Playing

Open `index.html` in a browser, or publish the repository with GitHub Pages (Settings → Pages → deploy
from the main branch root). Everything is in that one file; the only network request is for Google Fonts.

- New players start with **The Pitchfork**, a two-minute tutorial on a farm run by a cruel landlord.
- Modes: Easy (a celestial advisor and two extra will), Normal, Hard (no heroes, only ordinary folk).
- Maps: isometric voxel terrain, the classic 2D map, or a "fancy 2D" map — switch from the header.
- Save / load (browser storage), music with mute, and a first-time guide you can turn off.

## Development

```
./build.sh                          # rebuild index.html from src/
node test/test.js 30                # 30 unattended ages headless: outcome and mistake tallies
node test/dbg.js 4242 quest,land    # a seed's chronicle, filtered by entry kind
node test/policy.js                 # checks that the sword can steer outcomes
```

- `src/sim.js` — the simulation: pure functions over one JSON-cloneable state object (seeded RNG inside it),
  so the Seer's projections and save files are just copies of the state.
- `src/iso.js` — the isometric voxel renderer. `src/ui.js` — panels, the Bearer card, the classic and fancy
  2D maps, music, save/load. `src/tut.js` — the tutorial. `src/head.html` — markup and CSS.
- `src/assets_iso.js` — a generated sprite atlas (base64) built from the Kenney packs below; the 3D kit
  models were pre-rendered into the same isometric projection as the landscape tiles.

## Credits

Art by **Kenney** (www.kenney.nl), all CC0: Isometric Landscape, Sketch Town Expansion, Nature Kit,
Fantasy Town Kit, Modular Cave Kit, Roguelike Characters. Credit is voluntary under CC0 but appreciated.

## License

Choose a license for the code before publishing (MIT is a common choice for a game like this).

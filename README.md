# nottpr
## About
nottpr is a Node.js module for the ALTTPR API written in TypeScript. It it written with an object-oriented approach in mind, providing structured objects to help make requests to ALTTPR's API be streamlined and easy to write.

Additional ROM patching functionality is included, allowing you to patch ROMs yourself.

This module is based on v31 of the randomizer. If a major change to the randomizer causes something in this module to break, please open a new GitHub issue.

Note: nottpr is **not** approved for use in official races at this time. This may be subject to change in the future.

## Special Thanks
* Synack: Most of nottpr's functionality is inspired by pyz3r, an API library for ALTTPR written in Python. You should check it out at https://github.com/tcprescott/pyz3r.
* Veetorp: Much of the code in nottpr for patching randomizer ROMs was originally done by him, in addition to also being the main driving force behind ALTTPR and its development today.

## Installing
nottpr is compatible with Node.js v16.0.0 and newer.

After setting up your Node environment, you can install this module with the command `npm install nottpr`.

To use nottpr in your project, it must be imported using ES import syntax or dynamic import. You cannot import nottpr with require.
```js
import ALTTPR, * as nottpr from "nottpr";
// or
const nottpr = await import("nottpr");
const { "default": ALTTPR } = nottpr;
```

## Using nottpr
### Generating Regular and Customizer Seeds
nottpr offers two ways you can create payloads: the manual way or with a builder.

The manual way is similar to pyz3r:
```js
import ALTTPR from "nottpr";

// Crosskeys 2023 settings
const seed = await ALTTPR.randomizer({
    accessibility: "locations",
    crystals: {
        ganon: "7",
        tower: "7"
    },
    dungeon_items: "full",
    enemizer: {
        boss_shuffle: "none",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none"
    },
    entrances: "crossed",
    glitches: "none",
    goal: "fast_ganon",
    hints: "off",
    item: {
        functionality: "normal",
        pool: "normal"
    },
    item_placement: "advanced",
    lang: "en",
    mode: "open",
    spoilers: "on",
    tournament: false,
    weapons: "randomized"
});

console.log(seed.permalink);
```

While this works, it is substantially more work to type out. A builder solves that problem by default filling settings as an open 7/7. In essence, if you're fine with a default setting as it is, you don't have to specify it later.

Builders come equipped with a number of setter methods whose return value is the current object. As such, they can be chained.
```js
import ALTTPR, {
    SeedBuilder,
    Accessibility,
    Entrances,
    Goals,
    Keysanity
} from "nottpr";

// Crosskeys 2023 settings
const builder = new SeedBuilder()
    .setAccessibility(Accessibility.Locations)
    .setDungeonItems(Keysanity.Full)
    .setEntrances(Entrances.Crossed)
    .setGoal(Goals.FastGanon);

const seed = await ALTTPR.randomizer(builder);
console.log(seed.permalink);
```

Both examples result in the same value being passed to the generator.

For customizer seeds, you can use the `CustomizerBuilder` class, although a manual payload may be preferred due to the large amount of settings in the customizer. You can generate customizer seeds with the `ALTTPR.customizer` method.

### Fetching Previously Generated Seeds
Similar to pyz3r, you can fetch seeds by their hash:
```js
import ALTTPR from "nottpr";

const seed = await ALTTPR.fetchSeed("ry08zA75y5");
console.log(seed.hashCode);
```

Seeds are cached locally upon generation or retrieval in the `ALTTPR.seeds` object. When fetching a seed, nottpr will first check if a seed with the given hash is cached. If it is, that data is returned. Otherwise, the API is called and the fetched seed is added to the cache. You can skip the cache check by specifying `true` as a second parameter.
```js
import ALTTPR from "nottpr";

// Not cached. API is requested and data is cached.
let seed = await ALTTPR.fetchSeed("Rv2legZlGl");
// Cache check is skipped. API is requested again and data is recached.
seed = await ALTTPR.fetchSeed("Rv2legZlGl", true);
```

### Fetching Sprites
nottpr also gives you the ability to fetch sprites by name.
```js
import ALTTPR from "nottpr";

const sprite = await ALTTPR.fetchSprite("Angel");
const buffer = await sprite.fetch(); // You can even download the sprite as buffered data!
```

### Patching
nottpr allows you to patch randomizer seeds yourself with the `Seed.patchRom` method. Be advised that when patching a ROM, it is returned as a buffer. It will not create a new file on your system. How the buffered data is handled is up to the implementer.
```js
import ALTTPR, {
    SeedBuilder,
    BossShuffle,
    Hash,
    HeartColor.
    HeartSpeed,
    Keysanity,
    MenuSpeed
} from "nottpr";
import fs from "fs/promises";

// MC boss with pseudoboots
const builder = new SeedBuilder()
    .setDungeonItems(Keysanity.Mc)
    .setEnemizer({
        boss_shuffle: BossShuffle.Full
    })
    .setPseudoboots(true)
    .setOverrideStartScreen([ // You can even override the file select hash!
        Hash.Bow,
        Hash.BigKey,
        Hash.Hookshot,
        Hash.Mail,
        Hash.Ocarina
    ]);

const sprite = await ALTTPR.fetchSprite("Dark Boy");
const darkBoy = await sprite.fetch();

const seed = await ALTTPR.randomizer(builder);
const patched = await seed.patchRom(pathToJp10Rom, {
    heartSpeed: HeartSpeed.Half,
    heartColor: HeartColor.Green,
    menuSpeed: MenuSpeed.Normal,
    quickswap: true,
    backgroundMusic: true,
    msu1resume: true,
    sprite: darkBoy,
    reduceFlash: true
});

await fs.writeFile(`./seeds/${seed.hash}.sfc`, patched);
```
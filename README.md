# z3rscript
## About
z3rscript is a Node.js package for the ALTTPR API written in TypeScript. It it written with an object-oriented approach in mind, providing structured objects to help make requests to ALTTPR's API be simple and easy to understand.

Additional ROM patching functionality is included, allowing you to patch ROMs yourself.

This package is based on v31 of the randomizer. If a major change to the randomizer causes something in this package to break, please open a new GitHub issue.

## Installing
After setting up your environment, you can install this package with the command `npm install z3rscript`

To use z3rscript in your project, it must be imported using either ES6 import or dynamic import. You cannot import z3rscript with require.
```js
import ALTTPR from "z3rscript";
// or
const ALTTPR = import("z3rscript");
```

## Using z3rscript
### Generating Regular and Customizer Seeds
z3rscript offers two ways you can create payloads: the manual way or with a builder.

The manual way is similar to [pyz3r](https://github.com/tcprescott/pyz3r):
```js
import ALTTPR from "z3rscript";

// Crosskeys 2023 settings
const seed = await ALTTPR.randomizer({
    accessibility: "locations",
    crystals: {
        ganon: "7",
        tower: "7",
    },
    dungeon_items: "full",
    enemizer: {
        boss_shuffle: "none",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none",
    },
    entrances: "crossed",
    glitches: "none",
    goal: "fast_ganon",
    hints: "off",
    item: {
        functionality: "normal",
        pool: "normal",
    },
    item_placement: "advanced",
    lang: "en",
    mode: "open",
    spoilers: "on",
    tournament: false,
    weapons: "randomized",
});

console.log(seed.permalink);
```

While this works, it is substantially more work to type out. A builder object solves that problem by default filling settings as an open 7/7. Meaning if you're fine with a default setting as it is, you don't have to specify it later.

Using a builder:
```js
import ALTTPR, { SeedBuilder } from "z3rscript";

// Crosskeys 2023 settings
const builder = new SeedBuilder()
    .setAccessibility("locations")
    .setDungeonItems("full")
    .setEntrances("crossed")
    .setGoal("fast_ganon");

const seed = await ALTTPR.randomizer(builder);
console.log(seed.permalink);
```

Both examples result in the same value being passed to the generator.

For customizer seeds, you can use the `CustomizerBuilder` class, although a manual payload may be preferred due to the large amount of settings in the customizer. You can generate customizer seeds with the `ALTTPR.customizer` method.

### Fetching Previously Generated Seeds
Similar to pyz3r, you can retrieve seeds by their hash like so:
```js
import ALTTPR from "z3rscript";

const seed = ALTTPR.fetchSeed("ry08zA75y5");
```

### Fetching Sprites
z3rscript also gives you the ability to fetch sprites by name:
```js
import ALTTPR from "z3rscript";

const sprite = await ALTTPR.fetchSprite("Angel");
const buffer = await sprite.fetch(); // You can even download the sprite as buffered data!
```

### Generating Mystery Seeds
Mystery weightsets can be easily created using the `MysteryWeightset` object. Unlike builder objects, mystery weightsets have no default values and any setting not specified in the weightset will default to what it is in an open 7/7 when selecting settings. Customizer seeds are not supported at this time.

When setting a weight for a weightset, the total does not have to equal 100. If you want to force a particular setting, input only the setting you want and give it a value of 1. Decimal values are rounded to the nearest whole.

Creating a weightset and generating a mystery seed:
```js
import ALTTPR, { MysteryWeightset } from "z3rscript";

const weightset = new MysteryWeightset()
    .setWeight("accessibility", {
        items: 5.6, // Rounds to 6
        locations: 3,
        none: 1
    }).setWeight("crystals.ganon", {
        "2": 1,
        "4": 3,
        "5": 4,
        "6": 6,
        "7": 5
    }).setWeight("crystals.tower", {
        "7": 1 // Forced to 7
    })
    // ...
    .setWeight("weapons", {
        randomized: 13,
        assured: 9,
        vanilla: 4,
        swordless: 1
    });

const selected = weightset.select(); // Returns a SeedBuilder object
const seed = await ALTTPR.randomizer(selected);
console.log(seed.permalink);
```

### Patching
z3rscript allows you to patch randomizer seeds yourself. Be advised that when patching a ROM, the patched ROM is returned as a buffer. It will not create a new file on your system. How the buffered data is handled is up to the implementer.

```js
import ALTTPR, { SeedBuilder } from "z3rscript";
import fs from "fs/promises";

// MC boss with pseudoboots
const builder = new SeedBuilder()
    .setDungeonItems("mc")
    .setEnemizer({
        boss_shuffle: "full"
    })
    .setPseudoboots(true)
    .setOverrideStartScreen([0, 1, 2, 3, 4]); // You can even override the file select hash!

const sprite = await ALTTPR.fetchSprite("Dark Boy");
const darkBoy = await sprite.fetch();

const seed = await ALTTPR.randomizer(builder);
const patched = await seed.patchRom(pathToJp10Rom, {
    heartSpeed: "half",
    heartColor: "green",
    menuSpeed: "normal",
    quickswap: true,
    backgroundMusic: true,
    msu1resume: true,
    sprite: darkBoy,
    reduceFlash: true
});

await fs.writeFile(`../seeds/${seed.hash}.sfc`, patched);
```
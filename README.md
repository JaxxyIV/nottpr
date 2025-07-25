# nottpr

## About

nottpr is a Node.js module for the ALTTPR API written in TypeScript. It is written with an object-oriented approach in mind, providing structured objects to make requests to ALTTPR's API be streamlined and easy to write.

Additional ROM patching functionality is included to allow you to patch ROMs yourself.

This module is based on v31 of the randomizer. If a major change to the randomizer causes something in this module to break, please open a new GitHub issue.

Note: nottpr uses the [z3r-patch](https://github.com/JaxxyIV/z3r-patch) module for seed patching. Refer to z3r-patch's README for information on its legal status in official races.

## Special Thanks

- Synack: Most of nottpr's functionality is inspired by pyz3r, an API library for ALTTPR written in Python. You can check it out [here](https://github.com/tcprescott/pyz3r).
- clearmouse: Credit for prize packs/drops code in spoiler log.

## Installation

nottpr is compatible with Node.js v22.0.0 and newer. nottpr has not been tested in Deno or Bun.

After setting up your Node environment, you can install this module with the command `npm install nottpr`.

nottpr is an ES module and can only be imported via ES import syntax. You cannot import nottpr with require.

```js
/* OK! */
import ALTTPR, * as nottpr from "nottpr";
// or
const nottpr = await import("nottpr");
const { "default": ALTTPR } = nottpr;

/* WRONG! */
const { "default": ALTTPR } = require("nottpr");
```

## Using nottpr

### Seed Generation

nottpr offers two ways you can create payloads: the manual way or with a builder. All seed generation is done through the `ALTTPR.generate` method.

The manual way is similar to pyz3r:

```js
import ALTTPR from "nottpr";

// Crosskeys 2023 settings
const seed = await ALTTPR.generate({
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

While this works, it is substantially more work to type out. A builder solves this problem by prefilling settings by default as an open 7/7. In essence, if you're fine with a default setting as it is, you don't have to specify it later.

Builders come equipped with setter methods whose return value is the current object. As such, they can be chained.

```js
import ALTTPR, {
    Accessibility,
    Entrances,
    Goals,
    Keysanity,
    SeedBuilder
} from "nottpr";

// Crosskeys 2023 settings
const builder = new SeedBuilder()
    .setAccessibility(Accessibility.Locations)
    .setDungeonItems(Keysanity.Full)
    .setEntrances(Entrances.Crossed)
    .setGoal(Goals.FastGanon);

const seed = await ALTTPR.generate(builder);
console.log(seed.permalink);
```

Both examples result in the same value being passed to the generator.

#### Customizer Seeds

Customizer seeds are also generated through the `ALTTPR.generate` method. Like regular seeds, you can provide a complete payload or use a `CustomizerBuilder`. Customizer JSON files created on alttpr.com can be converted to a builder through the `CustomizerBuilder.fromCustomizerJSON` static method.

When using a `CustomizerBuilder`, it is important to note that the item pool and drop pool counts will sync with starting equipment/placed items and prize packs respectively. You do not need to provide these counts manually. If your preset is imported from an external source like SahasrahBot, you should disable syncing with the `CustomizerBuilder.disableSync` instance method to speed up performance.

```js
import ALTTPR, {
    util,
    CustomizerBuilder,
    Accessibility,
    District,
    Goals,
    Item,
    ItemLocation,
    Keysanity
} from "nottpr";

// AD Keys Boots w/ vanilla CT smalls + GT-restricted GTBK
const preset = new CustomizerBuilder()
    .setAccessibility(Accessibility.Locations)
    .setCustom(custom => custom
        .setCustomPrizePacks(false))
    .setDungeonItems(Keysanity.Full)
    .setEquipment(equipment => equipment
        .setStartingBoots(true))
    .setForcedItems({
        [Item.BigKeyGT]: util.getDistrict(District.GanonsTowerNoBK)
    })
    .setGoal(Goals.Dungeons)
    .setLocations({
        [ItemLocation.CTFirstFloor]: Item.SmallKeyCT,
        [ItemLocation.CTDarkMaze]: Item.SmallKeyCT
    });

const seed = await ALTTPR.generate(builder);

console.log(seed.permalink);
console.log(seed.hashCode);
```

Depending on the settings used, a manual payload may be preferred over a builder due to the large amount of settings in the customizer.

### Fetching Previously Generated Seeds

Similar to pyz3r, you can fetch seeds by their hash:

```js
import ALTTPR from "nottpr";

const seed = await ALTTPR.fetchSeed("ry08zA75y5");
console.log(seed.hashCode);
```

Seeds are cached locally upon generation or retrieval in the `ALTTPR.seeds` object. When fetching a seed, nottpr will first check if a seed with the given hash is cached. If it is, that data is returned. Otherwise, the API is called and the fetched seed is added to the cache.

### Fetching Sprites

Sprites are cached in the `ALTTPR.sprites` object to allow for easy retrieval. The `ALTTPR.fetchSprites` method can be used to fetch all sprites on alttpr.com. The cache will be empty on program initialization, so it must be populated first by fetching from the API.

```js
import ALTTPR from "nottpr";

await ALTTPR.fetchSprites();
const sprite = ALTTPR.sprites.get("Angel");
const buffer = await sprite.fetch(); // You can even download the sprite as buffered data!
```

Adding custom sprites to the cache is currently unsupported. You can still pass your own .zspr files when patching a seed though.

### Patching

nottpr allows you to patch randomizer seeds yourself with the `Seed.patch` method. Be advised that when patching a ROM, it is returned as a buffer. It will not create a new file on your system. How the buffered data is handled is up to the implementer.

You can also retrieve a seed's spoiler log by using the `Seed.spoilerLog` method. It accepts an optional boolean parameter to output additional information about prize packs. By default, this behavior is disabled.

```js
import ALTTPR, {
    SeedBuilder,
    BossShuffle,
    Hash,
    HeartColor.
    HeartSpeed,
    Keysanity
} from "nottpr";
import * as fs from "fs/promises";

// MC boss with pseudoboots
const builder = new SeedBuilder()
    .setDungeonItems(Keysanity.Mc)
    .setEnemizer({
        boss_shuffle: BossShuffle.Full
    })
    .setPseudoboots(true);

const seed = await ALTTPR.generate(builder);
const patched = await seed.patch(pathToJp10Rom, {
    heartSpeed: HeartSpeed.Half,
    heartColor: HeartColor.Green,
    quickswap: true,
    msu1resume: true,
    sprite: (await ALTTPR.fetchSprites()).get("Dark Boy"),
    reduceFlash: true
});

await fs.writeFile(`./seeds/${seed.hash}.sfc`, patched);
await fs.writeFile(`./seeds/logs/spoiler_${seed.hash}.json`, seed.spoilerLog(true));
```

### Importing Presets

#### SahasrahBot

nottpr allows you to convert most SahasrahBot preset YAMLs into native builder objects with the `util.fromSahasrahBotPreset` function. Door randomizer presets are currently not supported.

The object returned from `util.fromSahasrahBotPreset` will be typed as a `BaseSeedBuilder`. If you are using TypeScript or want to make further adjustments to the preset after importing, use `instanceof` to narrow the object to a `SeedBuilder` or `CustomizerBuilder`:

```js
import ALTTPR, { util, CustomizerBuilder } from "nottpr";

// We know this is a CustomizerBuilder. The editor does not.
const builder = util.fromSahasrahBotPreset("./invrosia.yaml");

if (builder instanceof CustomizerBuilder) {
    builder.disableSync(); // Disable sync since the settings are imported
}

const seed = await ALTTPR.generate(builder);
console.log(seed.permalink);
```

#### alttpr.com

You can import alttpr.com's built-in presets with the static async method `SeedBuilder.fromWebPreset`:

```js
import ALTTPR, {
    SeedBuilder,
    Accessibility,
    Goals,
    ItemPlacement,
    Weapons
} from "nottpr";

// Import VT OWG and change settings to OWG assured:
const builder = (await SeedBuilder.fromWebPreset("veetorp"))
    .setAccessibility(Accessibility.Items)
    .setGoal(Goals.DefeatGanon)
    .setItem({
        placement: ItemPlacement.Advanced
    })
    .setWeapons(Weapons.Assured);

const seed = await ALTTPR.generate(builder);

console.log(seed.permalink);
console.log(seed.hashCode);
```
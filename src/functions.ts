import * as fs from "node:fs";
import * as yaml from "yaml";
import { unflatten } from "flat";
import BaseSeedBuilder from "./classes/builders/BaseSeedBuilder.js";
import SeedBuilder from "./classes/builders/SeedBuilder.js";
import CustomizerBuilder from "./classes/builders/CustomizerBuilder.js";
import districts from "./types/symbol/districts.js";
import { StartHashOverride } from "./types/structures.js";
import { District, Drop, EnemyGroup, Hash, ItemLocation } from "./types/enums.js";
import { prizePacks } from "./types/symbol/prizePacks.js";

/**
 * Utility function that generates a pseudorandom start screen hash. Useful for
 * applying the same start screen hash to multiple seeds.
 *
 * @returns The generated hash.
 */
export function randomStartHash(): StartHashOverride {
    const res = [];
    for (let i = 0; i < 5; ++i) {
        res[i] = Math.floor(Math.random() * Object.keys(Hash).length);
    }
    return res as StartHashOverride;
}

/**
 * Retrieves a common district of item locations. Useful for setting an item's
 * placement within a specific region of the game.
 *
 * @param dist The district to be imported.
 * @returns An array containing all the item locations within the specified
 * district.
 */
export function getDistrict(dist: District): ItemLocation[] {
    return Array.from(districts[dist]);
}

/**
 * Retrieves the vanilla prize pack configuration for the given enemy group.
 *
 * @param pack The prize pack to retrieve.
 * @returns An array containing the drops of the given enemy group.
 */
export function getVanillaPack(pack: EnemyGroup): Drop[] {
    return Array.from(prizePacks[pack]);
}

/**
 * Converts a SahasrahBot preset YAML at the given file path into a builder
 * object.
 *
 * The returned object will be type-widened as a `BaseSeedBuilder`. Use
 * `instanceof` for type-narrowing to a `SeedBuilder` or `CustomizerBuilder`.
 *
 * Door randomizer presets are not supported. Attempting to parse one is a
 * `SyntaxError`.
 *
 * @param path The file path to the preset.
 * @returns The converted preset as a nottpr builder.
 */
export function fromSahasrahBotPreset(path: string): BaseSeedBuilder {
    const file = fs.readFileSync(path).toString();
    const preset = yaml.parse(file);

    if (typeof preset.settings === "undefined") {
        throw new SyntaxError("YAML file is missing attribute 'settings'.");
    }
    if (preset.doors) {
        throw new SyntaxError("Door presets are unsupported.");
    }

    let builder: SeedBuilder | CustomizerBuilder;
    const settings: any = unflatten(preset.settings);

    if (preset.customizer) { // CustomizerBuilder
        settings.drops = { ...settings.drops };

        builder = new CustomizerBuilder(settings);

        if ("forced_locations" in preset && preset.forced_locations.length) {
            const forced = preset.forced_locations.map((rec: { item: string, locations: string[] }) => ({ [rec.item.replace(":1", "")]: rec.locations }));
            builder.setForcedItems(...forced);
        }
    } else { // SeedBuilder
        builder = new SeedBuilder(settings);
    }

    return builder;
}
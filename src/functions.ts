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
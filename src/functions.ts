import { StartHashOverride } from "./types/apiStructs";
import { Hash } from "./types/enums";

/**
 * Utility function that generates a pseudorandom start screen hash.
 *
 * Useful for applying the same start screen hash to multiple seeds.
 * @returns The generated hash.
 */
export function randomStartHash(): StartHashOverride {
    const res = [];
    for (let i = 0; i < 5; ++i) {
        res[i] = Math.floor(Math.random() * Object.keys(Hash).length);
    }
    return res as StartHashOverride;
}
import SeedBuilder, { SeedOptions } from "./SeedBuilder";
import * as flat from "flat";
const { unflatten } = flat;

export default class MysteryWeightset {
    #weights: Map<string, Weights> = new Map<ConfigurableOptions, Weights>;
    constructor() { }

    getWeight(key: ConfigurableOptions): Weights | undefined {
        return this.#weights.get(key);
    }

    setWeight(key: ConfigurableOptions, weights: Weights): this {
        for (const k in weights) {
            if (weights[k] < 0) {
                throw new Error(`Unexpected negative value for ${k} in ${key}`);
            }
            weights[k] = Math.round(weights[k]);
        }
        this.#weights.set(key, weights);
        return this;
    }

    select(showSettings: boolean = false): SeedBuilder {
        let data: any = {};

        for (const [k, v] of this.#weights.entries()) {
            const arr: Array<string | boolean> = [];

            for (const key in v) {
                for (let i = 1; i <= v[key]; ++i) {
                    // Logic for settings that only accept a boolean
                    if (k === "allow_quickswap" || k === "pseudoboots") {
                        if (key.toLowerCase() === "true") {
                            arr.push(true);
                        } else {
                            arr.push(false);
                        }
                    } else {
                        arr.push(key);
                    }
                }
            }

            const sel: string | boolean = arr[Math.floor(Math.random() * arr.length)];
            data[k] = sel;
        }

        data = unflatten(data);

        return new SeedBuilder(data as SeedOptions)
            .setTournament(true)
            .setSpoilers(showSettings ? "off" : "mystery");
    }
}

type ConfigurableOptions = "accessibility" | "allow_quickswap" | "crystals.ganon" | "crystals.tower" | "dungeon_items" | "enemizer.boss_shuffle" | "enemizer.enemy_damage" | "enemizer.enemy_health" | "enemizer.enemy_shuffle" | "enemizer.pot_shuffle" | "entrances" | "glitches" | "goal" | "hints" | "item.functionality" | "item.pool" | "item_placement" | "mode" | "pseudoboots" | "weapons";

type Weights = { [x: string]: number };
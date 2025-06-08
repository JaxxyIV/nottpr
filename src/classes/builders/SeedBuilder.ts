import BaseSeedBuilder from "./BaseSeedBuilder";
import { EntranceShuffle } from "../../types/types";
import { BaseSeedOptions } from "../../types/optionObjs";
import Request from "../util/Request";
import { APIPreset } from "../../types/apiStructs";

/**
 * An instance of this class represents a payload object to be supplied to
 * alttpr.com's randomizer API. By default, all instances are initiated with
 * default settings to mimic an open 7/7 defeat Ganon.
 *
 * Settings can be altered through the use of various setter methods. These
 * methods return a reference to the current object. As such, they can be
 * chained.
 *
 * @extends BaseSeedBuilder
 * @example
 * ```js
 * import ALTTPR, { SeedBuilder, WorldState, Goals, Keysanity } from "nottpr";
 *
 * // Inverted AD Keys
 * const builder = new SeedBuilder()
 *     .setMode(WorldState.Inverted)
 *     .setGoal(Goals.Dungeons)
 *     .setDungeonItems(Keysanity.Full);
 * const seed = await ALTTPR.randomizer(builder);
 * ```
 */
export default class SeedBuilder extends BaseSeedBuilder<"entrances"> {
    static #webPresets: Record<WebPreset, APIPreset>;

    constructor(data?: SeedOptions) {
        super(data);
        if (typeof data === "undefined" || !("entrances" in data)) {
            super._setProp("entrances", "none");
        } else {
            super._setProp("entrances", data.entrances);
        }
    }

    get entrances(): EntranceShuffle {
        return super._getProp("entrances") as EntranceShuffle;
    }

    setEntrances(shuffle: EntranceShuffle): this {
        return super._setProp("entrances", shuffle);
    }

    /**
     * Creates a new class instance from a preset stored on alttpr.com.
     *
     * @param name The name of the preset
     * @returns The given preset as a builder.
     */
    static async fromWebPreset(name: WebPreset): Promise<SeedBuilder> {
        if (!this.#webPresets) {
            const res = await new Request("/randomizer/settings").get("json");
            const presets = res.presets as Record<WebPreset, APIPreset>;
            this.#webPresets = presets;
        }

        const selected = this.#webPresets[name];

        // Deals with unrecognized presets and if someone is actually clever
        // enough to use "custom".
        if (typeof selected === "undefined" || Array.isArray(selected)) {
            throw new ReferenceError(`${name} is not a valid preset.`);
        }

        return new this()
            .setAccessibility(selected.accessibility)
            .setCrystals({
                tower: selected.tower_open,
                ganon: selected.ganon_open,
            })
            .setDungeonItems(selected.dungeon_items)
            .setEnemizer({
                boss_shuffle: selected.boss_shuffle,
                enemy_damage: selected.enemy_damage,
                enemy_health: selected.enemy_health,
                enemy_shuffle: selected.enemy_shuffle,
            })
            .setEntrances(selected.entrance_shuffle)
            .setGlitches(selected.glitches_required)
            .setGoal(selected.goal)
            .setHints(selected.hints)
            .setItem({
                functionality: selected.item_functionality,
                pool: selected.item_pool,
            })
            .setItemPlacement(selected.item_placement)
            .setMode(selected.world_state)
            .setWeapons(selected.weapons);
    }
}

type WebPreset = "beginner" | "default" | "veetorp" | "crosskeys" | "quick" | "nightmare";

export type SeedOptions = BaseSeedOptions & {
    entrances?: EntranceShuffle
};
import BaseSeedBuilder from "./BaseSeedBuilder.js";
import Request from "../util/Request.js";
import { BaseSeedOptions } from "../../types/optionObjs.js";
import { APIPreset, RandomizerPayload } from "../../types/structures.js";
import { Entrances, Toggle } from "../../types/enums.js";

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
 *     .setWorldState(WorldState.Inverted)
 *     .setGoal(Goals.Dungeons)
 *     .setDungeonItems(Keysanity.Full);
 * const seed = await ALTTPR.generate(builder);
 * ```
 */
export default class SeedBuilder
    extends BaseSeedBuilder<RandomizerPayload> {
    static #webPresets: Record<WebPreset, APIPreset>;

    /**
     * Constructs a new SeedBuilder.
     *
     * @param data An optional partial payload object.
     */
    constructor(data?: SeedOptions) {
        super();
        if (!data) return;

        this._body = super._deepCopy(data) as typeof this._body;
    }

    get entrances(): Entrances {
        return this._body.entrances;
    }

    setEntrances(shuffle: Entrances): this {
        this._body.entrances = shuffle;
        return this;
    }

    /**
     * Creates a new class instance from a preset stored on alttpr.com.
     *
     * @param name The name of the preset.
     * @returns The given preset as a builder.
     */
    static async fromWebPreset(name: WebPreset): Promise<SeedBuilder> {
        if (!this.#webPresets) {
            const { presets } = await new Request("/randomizer/settings").get("json") as {
                presets: Record<WebPreset, APIPreset>
            };
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
            .setCrystals(selected.tower_open, selected.ganon_open)
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
            .setHints(selected.hints === Toggle.On)
            .setItem({
                functionality: selected.item_functionality,
                pool: selected.item_pool,
                placement: selected.item_placement
            })
            .setWorldState(selected.world_state)
            .setWeapons(selected.weapons);
    }
}

type WebPreset = "beginner" | "default" | "veetorp" | "crosskeys" | "quick" | "nightmare";

export type SeedOptions = BaseSeedOptions & {
    entrances?: Entrances
};
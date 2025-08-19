import * as fs from "node:fs";
import * as yaml from "yaml";
import BaseSeedBuilder from "./BaseSeedBuilder.js";
import Request from "../util/Request.js";
import { BaseSeedOptions } from "../../types/optionObjs.js";
import { APIPreset, DeepPartial, Keys, RandomizerPayload } from "../../types/structures.js";
import { Crystals, Entrances, Toggle } from "../../types/enums.js";
import { baseDefault } from "../../types/symbol/payloads.js";

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
    static readonly #calls = {
        accessibility: this.prototype.setAccessibility,
        allow_quickswap: this.prototype.setAllowQuickswap,
        crystals: this.prototype.setCrystals,
        dungeon_items: this.prototype.setDungeonItems,
        enemizer: this.prototype.setEnemizer,
        entrances: this.prototype.setEntrances,
        glitches: this.prototype.setGlitches,
        goal: this.prototype.setGoal,
        hints: this.prototype.setHints,
        item: this.prototype.setItem,
        item_placement: this.prototype.setItem,
        lang: this.prototype.setLanguage,
        mode: this.prototype.setWorldState,
        name: this.prototype.setName,
        notes: this.prototype.setNotes,
        override_start_screen: this.prototype.setHashCode,
        pseudoboots: this.prototype.setPseudoboots,
        spoilers: this.prototype.setSpoilers,
        tournament: this.prototype.setSpoilers,
        weapons: this.prototype.setWeapons
    };

    static from(data: SeedOptions | string): SeedBuilder {
        if (typeof data === "string") { // Assume yaml file
            const preset = yaml.parse(data);
            if (preset.customizer)
                throw new SyntaxError("Attempted to pass customizer preset.");
            if (preset.doors)
                throw new SyntaxError("Door randomizer presets are unsupported.");
            return this.from(preset.settings); // Convert yaml to object, redo the call
        } else if (typeof data !== "object") {
            throw new TypeError("data must be an object literal");
        }

        const builder = new this();
        let didItem = false;
        let didSpoil = false;

        for (const [k, v] of Object.entries(data) as [keyof RandomizerPayload, any][]) {
            if (Object.prototype.hasOwnProperty.call(this.#calls, k)) {
                const apply = this.#calls[k];
                if (k === "crystals") {
                    apply.call(builder, v.tower ?? 7, v.ganon ?? 7);
                    if (builder._body.crystals.tower === Crystals.Seven)
                        delete builder._body.crystals.tower;
                    if (builder._body.crystals.ganon === Crystals.Seven)
                        delete builder._body.crystals.ganon;
                } else if (k === "item" || k === "item_placement") {
                    if (didItem) continue;

                    const corrections = {
                        pool: data.item?.pool,
                        functionality: data.item?.functionality,
                        placement: data.item_placement,
                    };

                    for (const key of Object.keys(corrections) as Keys<typeof corrections>) {
                        if (typeof corrections[key] !== "string") {
                            delete corrections[key];
                        }
                    }

                    apply.call(builder, corrections);
                    didItem = true;
                } else if (k === "spoilers" || k === "tournament") {
                    if (didSpoil) continue;

                    didSpoil = true;
                } else {
                    apply.call(builder, v);
                }
            }
        }
        return builder;
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

        return this.from({
            accessibility: selected.accessibility,
            crystals: {
                tower: selected.tower_open,
                ganon: selected.ganon_open,
            },
            dungeon_items: selected.dungeon_items,
            enemizer: {
                boss_shuffle: selected.boss_shuffle,
                enemy_damage: selected.enemy_damage,
                enemy_health: selected.enemy_health,
                enemy_shuffle: selected.enemy_shuffle,
            },
            entrances: selected.entrance_shuffle,
            glitches: selected.glitches_required,
            goal: selected.goal,
            hints: selected.hints,
            item: {
                functionality: selected.item_functionality,
                pool: selected.item_pool,
            },
            item_placement: selected.item_placement,
            mode: selected.world_state,
            weapons: selected.weapons,
        });
    }

    get entrances(): Entrances {
        return this._body.entrances;
    }

    setEntrances(shuffle: Entrances): this {
        this._body.entrances = shuffle;
        return this;
    }

    override toJSON(): RandomizerPayload {
        const res: Partial<RandomizerPayload> = super.toJSON();
        if (!("entrances" in res)) {
            res.entrances = Entrances.None;
        }
        return res as RandomizerPayload;
    }

    override toYAML(complete?: boolean): string {
        return yaml.stringify({
            settings: complete ? this.toJSON() : this._body
        });
    }
}

type WebPreset = "beginner" | "default" | "veetorp" | "crosskeys" | "quick" | "nightmare";

interface SeedOptions extends DeepPartial<RandomizerPayload> {}
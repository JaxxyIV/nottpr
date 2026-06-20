import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "yaml";
import BaseSeedBuilder from "./BaseSeedBuilder.js";
import Request from "../util/Request.js";
import { DeepPartial, Keys, RandomizerPayload } from "../../types/structures.js";
import { Crystals, Entrances } from "../../types/enums.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const presetPath = path.resolve(__dirname, "../..", "presets");

/**
 * An instance of this class represents a payload object to be supplied to
 * alttpr.com's randomizer API. By default, all instances are initiated with
 * default settings to mimic an open 7/7 defeat Ganon.
 *
 * Settings can be altered through the use of various setter methods. These
 * methods return a reference to the current object and as such, can be
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

    /**
     * Constructs a SeedBuilder from a partial payload or stringified YAML file.
     *
     * Strings will have their settings constructed via {@link yaml.parse}.
     *
     * @param data The resolvable data to create a new SeedBuilder object.
     * @returns The newly constructed SeedBuilder.
     */
    static from(data: SeedOptions): SeedBuilder;
    static from(data: string): SeedBuilder;
    static from(data: SeedOptions | string): SeedBuilder {
        if (typeof data === "string") { // Assume yaml file
            const preset = yaml.parse(data);

            if ("meta" in preset && preset.meta.branch !== "main") {
                throw new TypeError(`Branch mismatch: expected "main" (found "${preset.meta.branch}")`);
            }
            if (preset.customizer)
                throw new SyntaxError("Attempted to pass customizer preset.");
            if (preset.doors)
                throw new SyntaxError("Door randomizer presets are unsupported.");
            return this.from(preset.settings); // Convert yaml to object, redo the call
        } else if (typeof data !== "object") {
            throw new TypeError("data must be an object literal");
        }

        const builder = new SeedBuilder();
        let didItem = false;
        let didSpoil = false;

        for (const [k, v] of Object.entries(data) as [keyof RandomizerPayload, any][]) {
            if (Object.prototype.hasOwnProperty.call(this.#calls, k)) {
                const apply = this.#calls[k];
                if (k === "crystals") {
                    builder.setCrystals(v.tower ?? 7, v.ganon ?? 7);
                    if (builder._body.crystals?.tower === Crystals.Seven)
                        delete builder._body.crystals.tower;
                    if (builder._body.crystals?.ganon === Crystals.Seven)
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

                    builder.setItem(corrections);
                    didItem = true;
                } else if (k === "spoilers" || k === "tournament") {
                    if (didSpoil) continue;

                    if (typeof data.spoilers === "string")
                        builder.setSpoilers(data.spoilers);

                    // This allows for tournament to be set independent of what
                    // the setSpoilers method usually does.
                    if (typeof data.tournament === "boolean")
                        builder._body.tournament = data.tournament;

                    didSpoil = true;
                } else {
                    apply.call(builder, v);
                }
            }
        }
        return builder;
    }

    static fromNottpr(preset: string): SeedBuilder {
        if (!/^[a-zA-Z0-9_-]+$/.test(preset)) {
            throw new Error('Invalid preset name');
        }
        const filePath = path.join(presetPath, `${preset}.yaml`);
        if (!fs.existsSync(filePath)) {
            throw new ReferenceError(`Preset "${preset}" does not exist.`);
        }
        console.log(`Attempting to load main preset "${preset}"`);
        const yStr = fs.readFileSync(filePath).toString("utf8");
        return SeedBuilder.from(yStr);
    }

    get entrances(): Entrances | undefined {
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
            meta: {
                source: "nottpr",
                branch: "main"
            },
            settings: complete ? this.toJSON() : this._body
        });
    }
}

interface SeedOptions extends DeepPartial<RandomizerPayload> {}
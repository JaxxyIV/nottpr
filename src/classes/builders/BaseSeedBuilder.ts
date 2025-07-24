import BaseBuilder from "./BaseBuilder.js";
import {
    Accessibility,
    Crystals,
    Glitches,
    Goals,
    ItemPlacement,
    Keysanity,
    Language,
    Spoilers,
    Toggle,
    Weapons,
    WorldState,
} from "../../types/enums.js";
import {
    BasePayload,
    CrystalPayloadData,
    EnemizerPayloadData,
    ItemPayloadData,
    Keys,
    StartHashOverride,
} from "../../types/structures.js";
import { baseDefault } from "../../types/symbol/payloads.js";
import { ItemOptions } from "../../types/optionObjs.js";

export default class BaseSeedBuilder<S extends BasePayload = BasePayload>
    extends BaseBuilder<S> {

    get accessibility(): Accessibility {
        return this._body.accessibility;
    }

    get allowQuickswap(): boolean {
        return this._body.allow_quickswap;
    }

    get crystals(): Readonly<CrystalPayloadData> {
        return this._body.crystals;
    }

    get dungeonItems(): Keysanity {
        return this._body.dungeon_items;
    }

    get enemizer(): Readonly<EnemizerPayloadData> {
        return this._body.enemizer;
    }

    get glitches(): Glitches {
        return this._body.glitches;
    }

    get goal(): Goals {
        return this._body.goal;
    }

    get hints(): Toggle {
        return this._body.hints;
    }

    get item(): Readonly<ItemOptions> {
        return {
            pool: this._body.item.pool,
            functionality: this._body.item.functionality,
            placement: this._body.item_placement,
        };
    }

    get lang(): Language {
        return this._body.lang;
    }

    get worldState(): WorldState {
        return this._body.mode;
    }

    get name(): string {
        return this._body.name;
    }

    get notes(): string {
        return this._body.notes;
    }

    get startHashCode(): StartHashOverride {
        return this._body.override_start_screen;
    }

    get pseudoboots(): boolean {
        return this._body.pseudoboots;
    }

    get spoilers(): Spoilers {
        return this._body.spoilers;
    }

    get weapons(): Weapons {
        return this._body.weapons;
    }

    setAccessibility(access: Accessibility): this {
        this._body.accessibility = access;
        return this;
    }

    /**
     * Sets whether or not this seed should be generated with quickswap
     * as a post-generation option.
     *
     * Default behavior: always allow quickswap
     *
     * @param allow Should quickswap be allowed?
     * @returns The current object for chaining.
     */
    setAllowQuickswap(allow: boolean): this {
        this._body.allow_quickswap = allow;
        return this;
    }

    /**
     * Sets the crystal settings for the seed.
     *
     * @param crystals The crystal requirements. Up to two values can be passed.
     * * One value: Sets both tower and Ganon to the given value.
     * * Two values: Sets tower to the first value and Ganon to the second
     * value.
     * @returns The current object for chaining.
     */
    setCrystals(...crystals: Crystals[]): this { // TODO: Allow this method to accept numbers
        const [arg0, arg1] = crystals;
        if (arg0 && arg1) {
            this._body.crystals = {
                ganon: arg0,
                tower: arg1,
            };
        } else {
            this._body.crystals = {
                ganon: arg0 ?? Crystals.Seven,
                tower: arg0 ?? Crystals.Seven,
            };
        }
        return this;
    }

    setDungeonItems(shuffle: Keysanity): this {
        this._body.dungeon_items = shuffle;
        return this;
    }

    /**
     * Sets the enemizer settings for the seed.
     *
     * @param options The new enemizer settings.
     * @returns The current object for chaining.
     */
    setEnemizer(options: Partial<EnemizerPayloadData>): this {
        const settings = super._deepCopy(baseDefault.enemizer);
        const keys = Object.keys(options) as Keys<EnemizerPayloadData>;

        for (const key of keys) {
            settings[key] = options[key] as never; // errors unless asserted as never
        }

        this._body.enemizer = settings;
        return this;
    }

    setGlitches(glitches: Glitches): this {
        this._body.glitches = glitches;
        return this;
    }

    setGoal(goal: Goals): this {
        this._body.goal = goal;
        return this;
    }

    setHints(toggle: boolean): this {
        this._body.hints = toggle ? Toggle.On : Toggle.Off;
        return this;
    }

    /**
     * Sets the item settings for the seed.
     *
     * @param options The new item settings.
     * @returns The current object for chaining.
     * @example
     * ```js
     * import { SeedBuilder, ItemPlacement, ItemPool, ItemFunctionality } from "nottpr";
     * const builder = new SeedBuilder()
     *     .setItem({
     *         placement: ItemPlacement.Basic,
     *         pool: ItemPool.Hard,
     *         functionality: ItemFunctionality.Expert
     *     });
     * ```
     */
    setItem(options: ItemOptions): this {
        const settings = super._deepCopy(baseDefault.item);
        if ("placement" in options) {
            this._body.item_placement = options.placement;
        }
        if ("functionality" in options) {
            settings.functionality = options.functionality;
        }
        if ("pool" in options) {
            settings.pool = options.pool;
        }

        this._body.item = settings;
        return this;
    }

    setLanguage(lang: Language): this {
        this._body.lang = lang;
        return this;
    }

    setWorldState(mode: WorldState): this {
        this._body.mode = mode;
        return this;
    }

    setName(name: string): this {
        this._body.name = name;
        return this;
    }

    setNotes(notes: string): this {
        this._body.notes = notes;
        return this;
    }

    /**
     * Overrides the random start screen hash with a custom input.
     *
     * @param hash A 5-element array of numbers between 0 and 31.
     * @returns The current object for chaining.
     */
    setHashCode(hash: StartHashOverride): this {
        if (!Array.isArray(hash)) {
            throw new TypeError("Parameter hash must be an array.");
        } else if (hash.length < 5) {
            throw new Error("Array must contain 5 elements.");
        }

        // Deep copy to not modify original arg
        this._body.override_start_screen = Array.from(hash) as StartHashOverride;
        return this;
    }

    /**
     * Sets whether this seed is generated with pseudoboots equipped.
     *
     * Default behavior: Seed is generated with pseudoboots disabled.
     *
     * @param enable Should pseudoboots be enabled?
     * @returns The current object for chaining.
     */
    setPseudoboots(enable: boolean): this {
        this._body.pseudoboots = enable;
        return this;
    }

    /**
     * Sets the spoiler settings for this seed.
     *
     * By default, spoilers are set to `Spoilers.Off`. Setting this value to
     * anything other than `Spoilers.Off` will enable tournament mode.
     *
     * @param spoilers The type of spoiler setting for this seed.
     * @returns The current object for chaining.
     */
    setSpoilers(spoilers: Spoilers): this {
        this._body.spoilers = spoilers;
        this._body.tournament = spoilers === Spoilers.Off;
        return this;
    }

    setWeapons(weapons: Weapons): this {
        this._body.weapons = weapons;
        return this;
    }

    toJSON(): S {
        function fill(ret: any, add: any): any {
            for (const key in add) {
                if (typeof ret[key] === "object" &&
                    !Array.isArray(ret[key])) {
                    ret[key] = fill(ret[key], add[key]);
                } else {
                    ret[key] = add[key];
                }
            }
            return ret;
        }
        const payload = super._deepCopy(baseDefault) as S;
        fill(payload, this._body);
        return payload;
    }
}
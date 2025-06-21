import BaseBuilder from "./BaseBuilder";
import * as enums from "../../types/enums";
import * as strings from "../../types/strings";
import * as structs from "../../types/structures";
import { baseDefault } from "../../types/payloads";
import {
    BaseSeedOptions,
    EnemizerOptions,
    ItemOptions
} from "../../types/optionObjs";

export default class BaseSeedBuilder extends BaseBuilder<strings.BaseSettings> {
    static readonly #default: BaseSeedOptions = {
        accessibility: "items",
        crystals: {
            ganon: "7",
            tower: "7",
        },
        dungeon_items: "standard",
        enemizer: {
            boss_shuffle: "none",
            enemy_damage: "default",
            enemy_health: "default",
            enemy_shuffle: "none",
        },
        glitches: "none",
        goal: "ganon",
        hints: "off",
        item: {
            functionality: "normal",
            pool: "normal",
        },
        item_placement: "advanced",
        lang: "en",
        mode: "open",
        spoilers: "on",
        tournament: false,
        weapons: "randomized",
    };

    constructor() {
        super();
    }

    static #fill(passed: any, def: any): any {
        for (const key in def) {
            if (!(key in passed)) {
                passed[key] = def[key];
            } else if (typeof passed[key] === "object" && !Array.isArray(passed[key])) {
                passed[key] = this.#fill(passed[key], def[key]);
            }
        }
        return passed;
    }

    protected static _default(): BaseSeedOptions {
        return this.#default;
    }

    get accessibility(): enums.Accessibility {
        return this._body.accessibility as enums.Accessibility;
    }

    get allowQuickswap(): boolean {
        return this._body.allow_quickswap as boolean;
    }

    get crystals(): structs.CrystalPayloadData {
        return super._deepCopy(this._body.crystals) as structs.CrystalPayloadData;
    }

    get dungeonItems(): enums.Keysanity {
        return this._body.dungeon_items as enums.Keysanity;
    }

    get enemizer(): structs.EnemizerPayloadData {
        return super._deepCopy(this._body.enemizer) as structs.EnemizerPayloadData;
    }

    get glitches(): enums.Glitches {
        return this._body.glitches as enums.Glitches;
    }

    get goal(): enums.Goals {
        return this._body.goal as enums.Goals;
    }

    get hints(): enums.Toggle {
        return this._body.hints as enums.Toggle;
    }

    get item(): structs.ItemPayloadData {
        return super._deepCopy(this._body.item) as structs.ItemPayloadData;
    }

    get itemPlacement(): enums.ItemPlacement {
        return this._body.item_placement as enums.ItemPlacement;
    }

    get lang(): enums.Language {
        return this._body.lang as enums.Language;
    }

    get mode(): enums.WorldState {
        return this._body.mode as enums.WorldState;
    }

    get name(): string {
        return this._body.name as string;
    }

    get notes(): string | undefined {
        return this._body.notes as string;
    }

    get overrideStartScreen(): structs.StartHashOverride | undefined {
        return "override_start_screen" in this._body
            ? super._deepCopy(this._body.override_start_screen) as structs.StartHashOverride
            : undefined;
    }

    get pseudoboots(): boolean | undefined {
        return this._body.pseudoboots as boolean;
    }

    get spoilers(): enums.Spoilers {
        return this._body.spoilers as enums.Spoilers;
    }

    get tournament(): boolean {
        return this._body.tournament as boolean;
    }

    get weapons(): enums.Weapons {
        return this._body.weapons as enums.Weapons;
    }

    setAccessibility(access: enums.Accessibility): this {
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
     * @returns The current object, for chaining.
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
     * @returns The current object, for chaining.
     */
    setCrystals(...crystals: enums.Crystals[]): this {
        const [arg0, arg1] = crystals;
        if (arg0 && arg1) {
            this._body.crystals = {
                ganon: arg0,
                tower: arg1,
            } as structs.CrystalPayloadData;
        } else {
            this._body.crystals = {
                ganon: arg0 ?? enums.Crystals.Seven,
                tower: arg0 ?? enums.Crystals.Seven,
            } as structs.CrystalPayloadData;
        }
        return this;
    }

    setDungeonItems(shuffle: enums.Keysanity): this {
        this._body.dungeon_items = shuffle;
        return this;
    }

    /**
     * Sets the enemizer settings for the seed.
     *
     * @param options The new enemizer settings.
     * @param reset If true, reset any setting unspecified to its default value.
     * Default value is false.
     * @returns The current object, for chaining.
     */
    setEnemizer(options: EnemizerOptions, reset: boolean = false): this {
        const settings: EnemizerOptions = reset === true
            ? super._deepCopy(BaseSeedBuilder.#default.enemizer) as EnemizerOptions
            : this.enemizer;
        const keys: Array<keyof typeof options> = Object.keys(options) as Array<keyof typeof options>;

        for (const key of keys) {
            settings[key] = options[key] as never; // errors unless asserted as never
        }

        return super._setProp("enemizer", settings);
    }

    setGlitches(glitches: enums.Glitches): this {
        this._body.glitches = glitches;
        return this;
    }

    setGoal(goal: enums.Goals): this {
        this._body.goal = goal;
        return this;
    }

    setHints(toggle: enums.Toggle): this {
        this._body.hints = toggle;
        return this;
    }

    /**
     * Sets the item settings for the seed.
     *
     * @param options The new item settings.
     * @param reset If true, reset any setting unspecified to its default value.
     * Default value is false.
     * @returns The current object, for chaining.
     */
    setItem(options: ItemOptions, reset: boolean = false): this {
        const settings: ItemOptions = reset === true
            ? super._deepCopy(BaseSeedBuilder.#default.item) as ItemOptions
            : this.item;

        if ("functionality" in options) {
            ({ functionality: settings.functionality } = options);
        }
        if ("pool" in options) {
            ({ pool: settings.pool } = options);
        }

        return super._setProp("item", settings);
    }

    setItemPlacement(placement: enums.ItemPlacement): this {
        this._body.item_placement = placement;
        return this;
    }

    setLanguage(lang: enums.Language): this {
        this._body.lang = lang;
        return this;
    }

    setMode(mode: strings.WorldState): this {
        return super._setProp("mode", mode);
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
     * @returns The current object, for chaining.
     */
    setOverrideStartScreen(hash: structs.StartHashOverride): this {
        if (!Array.isArray(hash)) {
            throw new Error("Parameter hash must be an array.");
        } else if (hash.length < 5) {
            throw new Error("Array must contain 5 elements.");
        }

        const copy = Array.from(hash); // deep copy to not modify original arg
        copy.length = 5;

        this._body.override_start_screen = copy;
        return this;
    }

    /**
     * Sets whether or not this seed is generated with pseudoboots equipped.
     *
     * Default behavior: seed is generated with pseudoboots disabled
     *
     * @param enable Should pseudoboots be enabled?
     * @returns The current object, for chaining.
     */
    setPseudoboots(enable: boolean): this {
        this._body.pseudoboots = enable;
        return this;
    }

    setSpoilers(spoilers: enums.Spoilers): this {
        this._body.spoilers = spoilers;
        return this;
    }

    setTournament(tournament: boolean): this {
        this._body.tournament = tournament;
        return this;
    }

    setWeapons(weapons: enums.Weapons): this {
        this._body.weapons = weapons;
        return this;
    }

    toJSON(): structs.BasePayload {
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
        const payload = super._deepCopy(baseDefault) as structs.BasePayload;
        fill(payload, this._body);
        return payload;
    }
}
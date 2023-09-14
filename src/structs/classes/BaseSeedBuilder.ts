import BaseBuilder from "./BaseBuilder";
import * as types from "../../types/types";
import * as structs from "../../types/apiStructs";

export default class BaseSeedBuilder<T extends string> extends BaseBuilder<T | types.BaseSettings, any> {
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

    constructor(data?: BaseSeedOptions) {
        super();
        if (typeof data === "undefined") {
            this._body = BaseSeedBuilder.#default;
        } else {
            this._body = BaseSeedBuilder.#fill(data, BaseSeedBuilder.#default);
        }
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

    get accessibility(): types.ItemAccessibility {
        return super._getProp("accessibility") as types.ItemAccessibility;
    }

    get allowQuickswap(): boolean | undefined {
        return super._getProp("allow_quickswap");
    }

    get crystals(): structs.CrystalPayloadData {
        return super._getProp("crystals") as structs.CrystalPayloadData;
    }

    get dungeonItems(): types.DungeonItems {
        return super._getProp("dungeon_items") as types.DungeonItems;
    }

    get enemizer(): structs.EnemizerPayloadData {
        return super._getProp("enemizer") as structs.EnemizerPayloadData;
    }

    get glitches(): types.GlitchesRequired {
        return super._getProp("glitches") as types.GlitchesRequired;
    }

    get goal(): types.Goal {
        return super._getProp("goal") as types.Goal;
    }

    get hints(): types.OptionToggle {
        return super._getProp("hints") as types.OptionToggle;
    }

    get item(): structs.ItemPayloadData {
        return super._getProp("item") as structs.ItemPayloadData;
    }

    get itemPlacement(): types.ItemPlacement {
        return super._getProp("item_placement") as types.ItemPlacement;
    }

    get lang(): types.Lang {
        return super._getProp("lang") as types.Lang;
    }

    get mode(): types.WorldState {
        return super._getProp("mode") as types.WorldState;
    }

    get name(): string | undefined {
        return super._getProp("name");
    }

    get notes(): string | undefined {
        return super._getProp("notes");
    }

    get overrideStartScreen(): structs.StartHashOverride | undefined {
        return super._getProp("override_start_screen");
    }

    get pseudoboots(): boolean | undefined {
        return super._getProp("pseudoboots");
    }

    get spoilers(): types.SpoilerSetting {
        return super._getProp("spoilers") as types.SpoilerSetting;
    }

    get tournament(): boolean {
        return super._getProp("tournament");
    }

    get weapons(): types.Weapons {
        return super._getProp("weapons") as types.Weapons;
    }

    setAccessibility(access: types.ItemAccessibility): this {
        return super._setProp("accessibility", access);
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
        return super._setProp("allow_quickswap", allow);
    }

    setCrystals(options: CrystalOptions): this {
        const current: structs.CrystalPayloadData = this.crystals;

        if ("ganon" in options) {
            ({ ganon: current.ganon } = options);
        }
        if ("tower" in options) {
            ({ tower: current.tower } = options);
        }

        return super._setProp("crystals", current);
    }

    setDungeonItems(shufle: types.DungeonItems): this {
        return super._setProp("dungeon_items", shufle);
    }

    setEnemizer(options: EnemizerOptions): this {
        const current: structs.EnemizerPayloadData = this.enemizer;

        if ("boss_shuffle" in options) {
            ({ boss_shuffle: current.boss_shuffle } = options);
        }
        if ("enemy_damage" in options) {
            ({ enemy_damage: current.enemy_damage } = options);
        }
        if ("enemy_health" in options) {
            ({ enemy_health: current.enemy_health } = options);
        }
        if ("enemy_shuffle" in options) {
            ({ enemy_shuffle: current.enemy_shuffle } = options);
        }
        if ("pot_shuffle" in options) {
            ({ pot_shuffle: current.pot_shuffle } = options);
        }

        return super._setProp("enemizer", current);
    }

    setGlitches(glitches: types.GlitchesRequired): this {
        return super._setProp("glitches", glitches);
    }

    setGoal(goal: types.Goal): this {
        return super._setProp("goal", goal);
    }

    setHints(toggle: types.OptionToggle): this {
        return super._setProp("hints", toggle);
    }

    setItem(options: ItemOptions): this {
        const current: structs.ItemPayloadData = this.item;

        if ("functionality" in options) {
            ({ functionality: current.functionality } = options);
        }
        if ("pool" in options) {
            ({ pool: current.pool } = options);
        }

        return super._setProp("item", current);
    }

    setItemPlacement(placement: types.ItemPlacement): this {
        return super._setProp("item_placement", placement);
    }

    setLanguage(lang: types.Lang): this {
        return super._setProp("lang", lang);
    }

    setMode(mode: types.WorldState): this {
        return super._setProp("mode", mode);
    }

    setName(name?: string): this {
        if (typeof name === "undefined") {
            delete super._body.name;
            return this;
        }

        return super._setProp("name", name);
    }

    setNotes(notes?: string): this {
        if (typeof notes === "undefined") {
            delete super._body.notes;
            return this;
        }

        return super._setProp("notes", notes);
    }

    /**
     * Overrides the random start screen hash with a custom input.
     *
     * @param hash A 5-element array of numbers between 0 and 31.
     * @returns The current object, for chaining.
     */
    setOverrideStartScreen(hash?: structs.StartHashOverride): this {
        if (typeof hash === "undefined") {
            delete this._body.override_start_screen;
            return this;
        } else if (!Array.isArray(hash)) {
            throw new Error("Parameter hash must be an array.");
        } else if (hash.length < 5) {
            throw new Error("Array must contain 5 elements.");
        }

        const copy = Array.from(hash); // deep copy to not modify original arg
        copy.length = 5;

        return super._setProp("override_start_screen", copy);
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
        return super._setProp("pseudoboots", enable);
    }

    setSpoilers(spoilers: types.SpoilerSetting): this {
        return super._setProp("spoilers", spoilers);
    }

    setTournament(tournament: boolean): this {
        return super._setProp("tournament", tournament);
    }

    setWeapons(weapons: types.Weapons): this {
        return super._setProp("weapons", weapons);
    }
}

export type BaseSeedOptions = {
    accessibility?: types.ItemAccessibility
    allow_quickswap?: boolean
    crystals?: CrystalOptions
    dungeon_items?: types.DungeonItems
    enemizer?: EnemizerOptions
    glitches?: types.GlitchesRequired
    goal?: types.Goal
    hints?: types.OptionToggle
    item?: ItemOptions
    item_placement?: types.ItemPlacement
    lang?: types.Lang
    mode?: types.WorldState
    name?: string
    notes?: string
    override_start_screen?: structs.StartHashOverride
    pseudoboots?: boolean
    spoilers?: types.SpoilerSetting
    tournament?: boolean
    weapons?: types.Weapons
};

type CrystalOptions = {
    ganon?: types.CrystalRequirement
    tower?: types.CrystalRequirement
};

type EnemizerOptions = {
    boss_shuffle?: types.BossShuffle
    enemy_damage?: types.EnemyDamage
    enemy_health?: types.EnemyHealth
    enemy_shuffle?: types.EnemyShuffle
    pot_shuffle?: types.OptionToggle
};

type ItemOptions = {
    functionality?: types.ItemFunctionality
    pool?: types.ItemPool
};
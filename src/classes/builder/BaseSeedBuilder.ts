import {
    BasePayload,
    CrystalPayloadData,
    EnemizerPayloadData,
    ItemPayloadData,
    StartHashOverride
} from "../../types/apiStructs";
import {
    DungeonItems,
    GlitchesRequired,
    Goal,
    ItemAccessibility,
    ItemPlacement,
    Lang,
    OptionToggle,
    SpoilerSetting,
    Weapons,
    WorldState
} from "../../types/types";
import BaseSeed from "../interfaces/BaseSeed";
import JSONTranslatable from "../interfaces/JSONTranslatable";

export default class BaseSeedBuilder implements BaseSeed, JSONTranslatable {
    #accessibility?: ItemAccessibility;
    #allowQuickswap?: boolean;
    #crystals?: Partial<CrystalPayloadData>;
    #dungeonItems?: DungeonItems;
    #enemizer?: Partial<EnemizerPayloadData>;
    #glitches?: GlitchesRequired;
    #goal?: Goal;
    #hints?: OptionToggle;
    #item?: Partial<ItemPayloadData>;
    #itemPlacement?: ItemPlacement;
    #lang?: Lang;
    #mode?: WorldState;
    #name?: string;
    #notes?: string;
    #overrideStartScreen?: StartHashOverride;
    #pseudoboots?: boolean;
    #spoilers?: SpoilerSetting;
    #tournament?: boolean;
    #weapons?: Weapons;

    constructor() { }

    get accessibility(): ItemAccessibility {
        return this.#accessibility;
    }
    get allowQuickswap(): boolean {
        return this.#allowQuickswap;
    }
    get crystals(): CrystalPayloadData {
        return {
            ganon: this.#crystals.ganon ?? "7",
            tower: this.#crystals.tower ?? "7",
        };
    }
    get dungeonItems(): DungeonItems {
        return this.#dungeonItems;
    }
    get enemizer(): EnemizerPayloadData {
        return {
            boss_shuffle: this.#enemizer.boss_shuffle ?? "none",
            enemy_damage: this.#enemizer.enemy_damage ?? "default",
            enemy_health: this.#enemizer.enemy_health ?? "default",
            enemy_shuffle: this.#enemizer.enemy_shuffle ?? "none",
            pot_shuffle: this.#enemizer.pot_shuffle ?? "off",
        };
    }
    get glitches(): GlitchesRequired {
        return this.#glitches;
    }
    get goal(): Goal {
        return this.#goal;
    }
    get hints(): OptionToggle {
        return this.#hints;
    }
    get item(): ItemPayloadData {
        return {
            functionality: this.#item.functionality ?? "normal",
            pool: this.#item.pool ?? "normal",
        };
    }
    get itemPlacement(): ItemPlacement {
        return this.#itemPlacement;
    }
    get lang(): Lang {
        return this.#lang;
    }
    get mode(): WorldState {
        return this.#mode;
    }
    get name(): string {
        return this.#name;
    }
    get notes(): string {
        return this.#notes;
    }
    get overrideStartScreen(): StartHashOverride {
        return Array.isArray(this.#overrideStartScreen)
            ? JSON.parse(JSON.stringify(this.#overrideStartScreen))
            : undefined;
    }
    get pseudoboots(): boolean {
        return this.#pseudoboots;
    }
    get spoilers(): SpoilerSetting {
        return this.#spoilers;
    }
    get tournament(): boolean {
        return this.#tournament;
    }
    get weapons(): Weapons {
        return this.#weapons;
    }

    setAccessibility(access: ItemAccessibility): this {
        this.#accessibility = access;
        return this;
    }
    setAllowQuickswap(allow: boolean): this {
        this.#allowQuickswap = allow;
        return this;
    }
    setCrystals(options: Partial<CrystalPayloadData>): this {
        this.#crystals = {
            ganon: options.ganon ?? "7",
            tower: options.tower ?? "7",
        };
        return this;
    }
    setDungeonItems(shuffle: DungeonItems): this {
        this.#dungeonItems = shuffle;
        return this;
    }
    setEnemizer(options: Partial<EnemizerPayloadData>): this {
        this.#enemizer = {
            boss_shuffle: options.boss_shuffle ?? "none",
            enemy_damage: options.enemy_damage ?? "default",
            enemy_health: options.enemy_health ?? "default",
            enemy_shuffle: options.enemy_shuffle ?? "none",
            pot_shuffle: options.pot_shuffle,
        };
        return this;
    }
    setGlitches(glitches: GlitchesRequired): this {
        this.#glitches = glitches;
        return this;
    }
    setGoal(goal: Goal): this {
        this.#goal = goal;
        return this;
    }
    setHints(toggle: OptionToggle): this {
        this.#hints = toggle;
        return this;
    }
    setItem(options: Partial<ItemPayloadData>): this {
        this.#item = {
            functionality: options.functionality ?? "normal",
            pool: options.pool ?? "normal",
        };
        return this;
    }
    setItemPlacement(placement: ItemPlacement): this {
        this.#itemPlacement = placement;
        return this;
    }
    setLang(lang: Lang): this {
        this.#lang = lang;
        return this;
    }
    setMode(mode: WorldState): this {
        this.#mode = mode;
        return this;
    }
    setName(name: string): this {
        this.#name = name;
        return this;
    }
    setNotes(notes: string): this {
        this.#notes = notes;
        return this;
    }
    setOverrideStartScreen(hash: StartHashOverride): this {
        if (hash.length !== 5) {
            throw new TypeError("Array provided for hash must contain five numbers between 0-31.");
        }
        this.#overrideStartScreen = hash;
        return this;
    }
    setPseudoboots(enable: boolean): this {
        this.#pseudoboots = enable;
        return this;
    }
    setSpoilers(spoilers: SpoilerSetting): this {
        this.#spoilers = spoilers;
        return this;
    }
    setTournament(tournament: boolean): this {
        this.#tournament = tournament;
        return this;
    }
    setWeapons(weapons: Weapons): this {
        this.#weapons = weapons;
        return this;
    }

    toJSON(): unknown {
        const payload: BasePayload = {
            accessibility: this.accessibility ?? "items",
            crystals: this.crystals,
            dungeon_items: this.dungeonItems ?? "standard",
            enemizer: this.enemizer,
            glitches: this.glitches ?? "none",
            goal: this.goal ?? "ganon",
            hints: this.hints ?? "off",
            item: this.item,
            item_placement: this.itemPlacement ?? "advanced",
            lang: this.lang ?? "en",
            mode: this.mode ?? "open",
            spoilers: this.spoilers ?? "on",
            tournament: this.tournament ?? false,
            weapons: this.weapons ?? "randomized",
        };

        if (typeof this.allowQuickswap === "boolean")
            payload.allow_quickswap = this.allowQuickswap;
        if (typeof this.name === "string")
            payload.name = this.name;
        if (typeof this.notes === "string")
            payload.notes = this.notes;
        if (Array.isArray(this.overrideStartScreen))
            payload.override_start_screen = this.overrideStartScreen;
        if (typeof this.pseudoboots === "boolean")
            payload.pseudoboots = this.pseudoboots;

        return payload;
    }
}
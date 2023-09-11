import BaseBuilder from "./BaseBuilder.js";
export default class BaseSeedBuilder extends BaseBuilder {
    static #default = {
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
    constructor(data) {
        super();
        if (typeof data === "undefined") {
            this._body = BaseSeedBuilder.#default;
        }
        else {
            this._body = BaseSeedBuilder.#fill(data, BaseSeedBuilder.#default);
        }
    }
    static #fill(passed, def) {
        for (const key in def) {
            if (!(key in passed)) {
                passed[key] = def[key];
            }
            else if (typeof passed[key] === "object" && !Array.isArray(passed[key])) {
                passed[key] = this.#fill(passed[key], def[key]);
            }
        }
        return passed;
    }
    static _default() {
        return this.#default;
    }
    get accessibility() {
        return super._getProp("accessibility");
    }
    get allowQuickswap() {
        return super._getProp("allow_quickswap");
    }
    get crystals() {
        return super._getProp("crystals");
    }
    get dungeonItems() {
        return super._getProp("dungeon_items");
    }
    get enemizer() {
        return super._getProp("enemizer");
    }
    get glitches() {
        return super._getProp("glitches");
    }
    get goal() {
        return super._getProp("goal");
    }
    get hints() {
        return super._getProp("hints");
    }
    get item() {
        return super._getProp("item");
    }
    get itemPlacement() {
        return super._getProp("item_placement");
    }
    get lang() {
        return super._getProp("lang");
    }
    get mode() {
        return super._getProp("mode");
    }
    get name() {
        return super._getProp("name");
    }
    get notes() {
        return super._getProp("notes");
    }
    get overrideStartScreen() {
        return super._getProp("override_start_screen");
    }
    get pseudoboots() {
        return super._getProp("pseudoboots");
    }
    get spoilers() {
        return super._getProp("spoilers");
    }
    get tournament() {
        return super._getProp("tournament");
    }
    get weapons() {
        return super._getProp("weapons");
    }
    setAccessibility(access) {
        return super._setProp("accessibility", access);
    }
    setAllowQuickswap(allow) {
        if (typeof allow === "undefined") {
            delete super._body.allow_quickswap;
            return this;
        }
        return super._setProp("allow_quickswap", allow);
    }
    setCrystals(options) {
        const current = this.crystals;
        if ("ganon" in options) {
            ({ ganon: current.ganon } = options);
        }
        if ("tower" in options) {
            ({ tower: current.tower } = options);
        }
        return super._setProp("crystals", current);
    }
    setDungeonItems(shufle) {
        return super._setProp("dungeon_items", shufle);
    }
    setEnemizer(options) {
        const current = this.enemizer;
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
    setGlitches(glitches) {
        return super._setProp("glitches", glitches);
    }
    setGoal(goal) {
        return super._setProp("goal", goal);
    }
    setHints(toggle) {
        return super._setProp("hints", toggle);
    }
    setItem(options) {
        const current = this.item;
        if ("functionality" in options) {
            ({ functionality: current.functionality } = options);
        }
        if ("pool" in options) {
            ({ pool: current.pool } = options);
        }
        return super._setProp("item", current);
    }
    setItemPlacement(placement) {
        return super._setProp("item_placement", placement);
    }
    setLanguage(lang) {
        return super._setProp("lang", lang);
    }
    setMode(mode) {
        return super._setProp("mode", mode);
    }
    setName(name) {
        if (typeof name === "undefined") {
            delete super._body.name;
            return this;
        }
        return super._setProp("name", name);
    }
    setNotes(notes) {
        if (typeof notes === "undefined") {
            delete super._body.notes;
            return this;
        }
        return super._setProp("notes", notes);
    }
    setOverrideStartScreen(array) {
        if (typeof array === "undefined") {
            delete this._body.override_start_screen;
            return this;
        }
        if (array.length < 5) {
            throw new Error("Array must contain 5 elements.");
        }
        const copy = Array.from(array);
        copy.length = 5;
        return super._setProp("override_start_screen", copy);
    }
    setPseudoboots(enable) {
        if (typeof enable === "undefined") {
            delete super._body.pseudoboots;
            return this;
        }
        return super._setProp("pseudoboots", enable);
    }
    setSpoilers(spoilers) {
        return super._setProp("spoilers", spoilers);
    }
    setTournament(tournament) {
        return super._setProp("tournament", tournament);
    }
    setWeapons(weapons) {
        return super._setProp("weapons", weapons);
    }
}

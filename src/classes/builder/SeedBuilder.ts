import { RandomizerPayload } from "../../types/apiStructs";
import { EntranceShuffle } from "../../types/types";
import JSONTranslatable from "../interfaces/JSONTranslatable";
import BaseSeedBuilder from "./BaseSeedBuilder";

export default class SeedBuilder extends BaseSeedBuilder implements JSONTranslatable {
    #entrances?: EntranceShuffle;

    constructor() {
        super();
    }

    get entrances(): EntranceShuffle {
        return this.#entrances;
    }

    setEntrances(shuffle: EntranceShuffle): this {
        this.#entrances = shuffle;
        return this;
    }

    toJSON(): unknown {
        const payload: RandomizerPayload = {
            accessibility: super.accessibility ?? "items",
            crystals: super.crystals,
            dungeon_items: super.dungeonItems ?? "standard",
            enemizer: super.enemizer,
            entrances: this.entrances ?? "none",
            glitches: super.glitches ?? "none",
            goal: super.goal ?? "ganon",
            hints: super.hints ?? "off",
            item: super.item,
            item_placement: super.itemPlacement ?? "advanced",
            lang: super.lang ?? "en",
            mode: super.mode ?? "open",
            spoilers: super.spoilers ?? "on",
            tournament: super.tournament ?? false,
            weapons: super.weapons ?? "randomized",
        };

        if (typeof super.allowQuickswap === "boolean")
            payload.allow_quickswap = super.allowQuickswap;
        if (typeof super.name === "string")
            payload.name = super.name;
        if (typeof super.notes === "string")
            payload.notes = super.notes;
        if (Array.isArray(super.overrideStartScreen))
            payload.override_start_screen = super.overrideStartScreen;
        if (typeof super.pseudoboots === "boolean")
            payload.pseudoboots = super.pseudoboots;

        return payload;
    }
}
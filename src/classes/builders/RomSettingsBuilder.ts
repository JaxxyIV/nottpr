import BaseBuilder from "./BaseBuilder.js";
import { CustomizerRomOptions, Pairs } from "../../types/structures.js";
import { ClockMode, CompassMode } from "../../types/enums.js";

export default class RomSettingsBuilder
    extends BaseBuilder<CustomizerRomOptions> {
    constructor(options?: Partial<CustomizerRomOptions>) {
        super();
        if (!options) return;
        this._body = { ...options };
    }

    get freeItemText(): boolean {
        return this._body.freeItemText ?? false;
    }

    get freeItemMenu(): boolean {
        return this._body.freeItemMenu ?? false;
    }

    get mapOnPickup(): boolean {
        return this._body.mapOnPickup ?? false;
    }

    get rupeeBow(): boolean {
        return this._body.rupeeBow ?? false;
    }

    get genericKeys(): boolean {
        return this._body.genericKeys ?? false;
    }

    get timerMode(): ClockMode {
        return this._body.timerMode ?? ClockMode.Off;
    }

    get timerStart(): number | string {
        return this._body.timerStart ?? "";
    }

    get dungeonCount(): CompassMode {
        return this._body.dungeonCount ?? CompassMode.Off;
    }

    get ganonAgRNG(): "none" | "table" {
        return this._body.GanonAgRNG ?? "table";
    }

    setFreeItemText(enable: boolean): this {
        this._body.freeItemText = enable;
        return this;
    }

    setFreeItemMenu(enable: boolean): this {
        this._body.freeItemMenu = enable;
        return this;
    }

    setMapOnPickup(enable: boolean): this {
        this._body.mapOnPickup = enable;
        return this;
    }

    setRupeeBow(enable: boolean): this {
        this._body.rupeeBow = enable;
        return this;
    }

    setGenericKeys(enable: boolean): this {
        this._body.genericKeys = enable;
        return this;
    }

    setTimerMode(mode: ClockMode): this {
        this._body.timerMode = mode;
        return this;
    }

    setTimerStart(start: number): this {
        this._body.timerStart = start;
        return this;
    }

    setDungeonCount(count: CompassMode): this {
        this._body.dungeonCount = count;
        return this;
    }

    /**
     * Sets whether the Aga 1 patterns and Ganon warps are normalized.
     *
     * Setting normal to `true` disables the RNG: Aga 1 will only throw energy
     * balls and Ganon will never fake-out warp in phase 3.
     *
     * Setting normal to `false` is default behavior.
     *
     * @param normal Should Ganon/Aga 1 RNG be normalized?
     * @returns The current object for chaining.
     */
    setGanonAgaRNG(normal: boolean): this {
        this._body.GanonAgRNG = normal ? "none" : "table";
        return this;
    }
}
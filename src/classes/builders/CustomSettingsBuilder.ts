import BaseBuilder from "./BaseBuilder.js";
import RegionSettingsBuilder from "./RegionSettingsBuilder.js";
import ItemSettingsBuilder from "./ItemSettingsBuilder.js";
import RomSettingsBuilder from "./RomSettingsBuilder.js";
import { customizerDefault } from "../../types/symbol/payloads.js";
import {
    AllowedGlitches,
    CustomDropCounts,
    CustomizerItemOptions,
    CustomizerPrizeOptions,
    CustomizerRegionOptions,
    CustomizerRomOptions,
    CustomOptions,
} from "../../types/structures.js";

export default class CustomSettingsBuilder
    extends BaseBuilder<CustomOptions> {
    static readonly #default = customizerDefault.custom;
    static readonly #defGlit: AllowedGlitches = {
        canBombJump: false,
        canBootsClip: false,
        canBunnyRevive: false,
        canBunnySurf: false,
        canDungeonRevive: false,
        canFakeFlipper: false,
        canMirrorClip: false,
        canMirrorWrap: false,
        canTransitionWrapped: false,
        canOneFrameClipOW: false,
        canOneFrameClipUW: false,
        canOWYBA: false,
        canSuperBunny: false,
        canSuperSpeed: false,
        canWaterWalk: false,
        canWaterFairyRevive: false,
    };

    constructor() {
        super();
        this._body = super._deepCopy(CustomSettingsBuilder.#default);
    }

    get customPrizePacks(): boolean {
        return this._body.customPrizePacks;
    }

    get item(): Readonly<CustomizerItemOptions> {
        return this._body.item;
    }

    get prize(): Readonly<CustomizerPrizeOptions> {
        return this._body.prize;
    }

    get region(): Readonly<CustomizerRegionOptions> {
        return this._body.region;
    }

    get rom(): Readonly<CustomizerRomOptions> {
        return this._body.rom;
    }

    get drop(): Readonly<CustomDropCounts> {
        return this._body.drop.count;
    }

    get spoilBootsLocation(): boolean {
        return this._body.spoil.BootsLocation;
    }

    /**
     * Sets the independent glitch rules for this CustomSettingsBuilder.
     *
     * @param options A partial object literal containing the new glitch rules.
     * @returns The current object for chaining.
     */
    setAllowedGlitches(options: Partial<AllowedGlitches>): this {
        for (const key of Object.keys(CustomSettingsBuilder.#defGlit) as (keyof AllowedGlitches)[]) {
            this._body[key] = options[key] ?? CustomSettingsBuilder.#defGlit[key];
        }
        return this;
    }

    /**
     * Sets whether the prize packs generated are completely random or conform
     * to v31.
     *
     * @param enable Whether non-v31 prize packs should be enabled.
     * @returns The current object for chaining.
     */
    setCustomPrizePacks(enable: boolean): this {
        this._body.customPrizePacks = enable;
        return this;
    }

    /**
     * Sets whether the boots location is spoiled by the uncle/the sign in front
     * of Link's house.
     *
     * @param spoil Should the boots location be spoiled?
     * @returns The current object for chaining.
     */
    setSpoilBoots(spoil: boolean): this {
        this._body.spoil.BootsLocation = spoil;
        return this;
    }

    setRegion(region: RegionSettingsBuilder): this
    setRegion(region: (builder: RegionSettingsBuilder) => RegionSettingsBuilder): this
    setRegion(region: RegionSettingsBuilder | Partial<CustomizerRegionOptions> | ((builder: RegionSettingsBuilder) => RegionSettingsBuilder)): this {
        if (typeof region === "function") {
            region = region(new RegionSettingsBuilder()).toJSON();
        } else if (region instanceof RegionSettingsBuilder) {
            region = region.toJSON();
        } else {
            region = new RegionSettingsBuilder(region).toJSON();
        }
        this._body.region = region as CustomizerRegionOptions;
        return this;
    }

    setItemSettings(item: ItemSettingsBuilder): this;
    setItemSettings(item: CustomizerItemOptions): this;
    setItemSettings(item: ((builder: ItemSettingsBuilder) => ItemSettingsBuilder)): this;
    setItemSettings(item: CustomizerItemOptions | ItemSettingsBuilder | ((builder: ItemSettingsBuilder) => ItemSettingsBuilder)): this {
        if (typeof item === "function") {
            this._body.item = item(new ItemSettingsBuilder()).toJSON();
        } else if (item instanceof ItemSettingsBuilder) {
            this._body.item = item.toJSON();
        } else {
            this._body.item = item;
        }
        return this;
    }

    setRomSettings(rom: RomSettingsBuilder): this;
    setRomSettings(rom: CustomizerRomOptions): this;
    setRomSettings(rom: ((builder: RomSettingsBuilder) => RomSettingsBuilder)): this;
    setRomSettings(rom: CustomizerRomOptions | RomSettingsBuilder | ((builder: RomSettingsBuilder) => RomSettingsBuilder)): this {
        if (typeof rom === "function") {
            this._body.rom = rom(new RomSettingsBuilder()).toJSON();
        } else if (rom instanceof RomSettingsBuilder) {
            this._body.rom = rom.toJSON();
        } else {
            this._body.rom = rom;
        }
        return this;
    }

    setPrize(prize: Partial<CustomizerPrizeOptions>): this {
        const { prize: def } = CustomSettingsBuilder.#default;
        for (const key of Object.keys(def) as (keyof CustomizerPrizeOptions)[]) {
            this._body.prize[key] = prize[key] ?? def[key];
        }
        return this;
    }

    setDrop(drop: Partial<CustomDropCounts>): this {
        const rep = super._deepCopy(CustomSettingsBuilder.#default.drop.count);
        for (const key of Object.keys(drop) as (keyof typeof drop)[]) {
            rep[key] = drop[key];
        }
        this._body.drop.count = rep;
        return this;
    }
}
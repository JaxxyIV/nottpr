import BaseBuilder from "./BaseBuilder.js";
import RegionSettingsBuilder from "./RegionSettingsBuilder.js";
import ItemSettingsBuilder from "./ItemSettingsBuilder.js";
import RomSettingsBuilder from "./RomSettingsBuilder.js";
import { customizerDefault } from "../../types/symbol/payloads.js";
import {
    AllowedGlitches,
    BuilderCallback,
    CustomDropCounts,
    CustomizerItemOptions,
    CustomizerPrizeOptions,
    CustomizerRegionOptions,
    CustomizerRomOptions,
    CustomOptions,
    Keys,
} from "../../types/structures.js";

/**
 * An instance of this class represents a custom settings payload supplied to
 * alttpr.com's customizer API.
 *
 * This class is not useful on its own. It is intended to be used in tandem
 * with a CustomizerBuilder.
 */
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
        for (const key of Object.keys(CustomSettingsBuilder.#defGlit) as Keys<AllowedGlitches>) {
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

    /**
     * Sets the region settings for this CustomSettingsBuilder.
     *
     * Refer to {@link RegionSettingsBuilder} for more comprehensive
     * documation on valid settings.
     *
     * @param region The region options. This argument can be passed as an
     * object literal, a RegionSettingsBuilder, or a callback function.
     * @returns The current object for chaining.
     */
    setRegion(region: RegionSettingsBuilder): this
    setRegion(region: (builder: RegionSettingsBuilder) => RegionSettingsBuilder): this
    setRegion(region: RegionSettingsBuilder | Partial<CustomizerRegionOptions> | BuilderCallback<RegionSettingsBuilder>): this {
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

    /**
     * Sets the custom item settings for this CustomSettingsBuilder.
     *
     * Refer to {@link ItemSettingsBuilder} for more comprehensive
     * documentation on valid settings.
     *
     * @param item The item options. This argument can be passed as an object
     * literal, an ItemSettingsBuilder, or a callback function.
     * @returns The current object for chaining.
     */
    setItemSettings(item: ItemSettingsBuilder): this;
    setItemSettings(item: CustomizerItemOptions): this;
    setItemSettings(item: (builder: ItemSettingsBuilder) => ItemSettingsBuilder): this;
    setItemSettings(item: CustomizerItemOptions | ItemSettingsBuilder | BuilderCallback<ItemSettingsBuilder>): this {
        if (typeof item === "function") {
            this._body.item = item(new ItemSettingsBuilder()).toJSON();
        } else if (item instanceof ItemSettingsBuilder) {
            this._body.item = item.toJSON();
        } else {
            this._body.item = item;
        }
        return this;
    }

    /**
     * Sets the custom ROM settings for this CustomSettingsBuilder.
     *
     * Refer to {@link RomSettingsBuilder} for more comprehensive documentation
     * on valid settings.
     *
     * @param rom The ROM options. This argument can be passed as an object
     * literal, a RomSettingsBuilder, or a callback function.
     * @returns The current object for chaining.
     */
    setRomSettings(rom: RomSettingsBuilder): this;
    setRomSettings(rom: CustomizerRomOptions): this;
    setRomSettings(rom: (builder: RomSettingsBuilder) => RomSettingsBuilder): this;
    setRomSettings(rom: CustomizerRomOptions | RomSettingsBuilder | BuilderCallback<RomSettingsBuilder>): this {
        if (typeof rom === "function") {
            this._body.rom = rom(new RomSettingsBuilder()).toJSON();
        } else if (rom instanceof RomSettingsBuilder) {
            this._body.rom = rom.toJSON();
        } else {
            this._body.rom = rom;
        }
        return this;
    }

    /**
     * Sets the prize options for this CustomSettingsBuilder.
     *
     * @param prize A partial object literal of options to set.
     * @returns The current object for chaining.
     */
    setPrize(prize: Partial<CustomizerPrizeOptions>): this {
        const { prize: def } = CustomSettingsBuilder.#default;
        for (const key of Object.keys(def) as Keys<typeof def>) {
            this._body.prize[key] = prize[key] ?? def[key];
        }
        return this;
    }

    /**
     * Sets the drop pool counts for this CustomSettingsBuilder.
     *
     * Has no effect if `this.customPrizePacks` is `false`.
     *
     * @param drop A partial object literal of drop pool modifications.
     * @returns The current object for chaining.
     */
    setDrop(drop: Partial<CustomDropCounts>): this {
        const rep = super._deepCopy(CustomSettingsBuilder.#default.drop.count);
        for (const key of Object.keys(drop) as Keys<typeof drop>) {
            rep[key] = drop[key];
        }
        this._body.drop.count = rep;
        return this;
    }
}
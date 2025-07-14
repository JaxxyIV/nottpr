import BaseBuilder from "./BaseBuilder.js";
import RegionSettingsBuilder from "./RegionSettingsBuilder.js";
import ItemSettingsBuilder from "./ItemSettingsBuilder.js";
import RomSettingsBuilder from "./RomSettingsBuilder.js";
import { customizerDefault } from "../../types/payloads.js";
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

    setAllowedGlitches(options: AllowGlitchOptions): this {
        for (const key of Object.keys(CustomSettingsBuilder.#defGlit)) {
            this._body[key as keyof AllowedGlitches] = options[key as keyof typeof options] ??
                CustomSettingsBuilder.#defGlit[key as keyof AllowedGlitches];
        }
        return this;
    }

    setCustomPrizePacks(enable: boolean): this {
        this._body.customPrizePacks = enable;
        return this;
    }

    setSpoilBoots(spoil: boolean): this {
        this._body.spoil.BootsLocation = spoil;
        return this;
    }

    setRegion(region: RegionSettingsBuilder): this
    setRegion(region: (builder: RegionSettingsBuilder) => RegionSettingsBuilder): this
    setRegion(region: RegionSettingsBuilder |
        ((builder: RegionSettingsBuilder) => RegionSettingsBuilder)): this {
        if (typeof region === "function") {
            this._body.region = region(new RegionSettingsBuilder()).toJSON();
            return this;
        } else if (region instanceof RegionSettingsBuilder) {
            this._body.region = region.toJSON();
        }
        throw new TypeError("region must be a function or RegionSettingsBuilder");
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
        for (const key of Object.keys(def)) {
            this._body.prize[key as keyof CustomizerPrizeOptions] = prize[key as keyof typeof prize] ?? def[key as keyof typeof def];
        }
        return this;
    }
}

type AllowGlitchOptions = Record<keyof AllowedGlitches, boolean>;
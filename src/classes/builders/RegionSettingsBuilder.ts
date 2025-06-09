import { CustomizerRegionOptions } from "../../types/structures";
import { RegionSettings } from "../../types/strings";
import BaseBuilder from "./BaseBuilder";

export default class RegionSettingsBuilder extends BaseBuilder<keyof CustomizerRegionOptions, boolean> {
    static readonly #default: CustomizerRegionOptions = {
        bossNormalLocation: true,
        wildBigKeys: false,
        wildCompasses: false,
        wildKeys: false,
        wildMaps: false,
    };

    constructor(data?: RegionOptions) {
        super();
        if (typeof data !== "object") {
            this._body = RegionSettingsBuilder.#default;
        } else {
            this._body = RegionSettingsBuilder.#fill(data, RegionSettingsBuilder.#default);
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

    get bossHeartsInPool(): boolean | undefined {
        return super._getProp("bossHeartsInPool");
    }

    get bossNormalLocation(): boolean {
        return super._getProp("bossNormalLocation");
    }

    get bossesHaveItem(): boolean | undefined {
        return super._getProp("bossesHaveItem");
    }

    get forceSkullWoodsKey(): boolean | undefined {
        return super._getProp("forceSkullWoodsKey");
    }

    get requireBetterBow(): boolean | undefined {
        return super._getProp("requireBetterBow");
    }

    get requireBetterSword(): boolean | undefined {
        return super._getProp("requireBetterSword");
    }

    get swordsInPool(): boolean | undefined {
        return super._getProp("swordsInPool");
    }

    get takeAnys(): boolean | undefined {
        return super._getProp("takeAnys");
    }

    get wildBigKeys(): boolean {
        return super._getProp("wildBigKeys");
    }

    get wildCompasses(): boolean {
        return super._getProp("wildCompasses");
    }

    get wildKeys(): boolean {
        return super._getProp("wildKeys");
    }

    get wildMaps(): boolean {
        return super._getProp("wildMaps");
    }

    setBossHeartsInPool(bool: boolean): this {
        return super._setProp("bossHeartsInPool", bool);
    }

    setBossNormalLocation(bool: boolean): this {
        return super._setProp("bossNormalLocation", bool);
    }

    setBossesHaveItem(bool: boolean): this {
        return super._setProp("bossesHaveItem", bool);
    }

    setForceSkullWoodsKey(bool: boolean): this {
        return super._setProp("forceSkullWoodsKey", bool);
    }

    setRequireBetterBow(bool: boolean): this {
        return super._setProp("requireBetterBow", bool);
    }

    setRequireBetterSword(bool: boolean): this {
        return super._setProp("requireBetterSword", bool);
    }

    setSwordsInPool(bool: boolean): this {
        return super._setProp("swordsInPool", bool);
    }

    setTakeAnys(bool: boolean): this {
        return super._setProp("takeAnys", bool);
    }

    setWildBigKeys(bool: boolean): this {
        return super._setProp("wildBigKeys", bool);
    }

    setWildCompasses(bool: boolean): this {
        return super._setProp("wildCompasses", bool);
    }

    setWildKeys(bool: boolean): this {
        return super._setProp("wildKeys", bool);
    }

    setWildMaps(bool: boolean): this {
        return super._setProp("wildMaps", bool);
    }
}

type RegionOptions = {
    [x in RegionSettings]?: boolean;
};
import BaseBuilder from "./BaseBuilder.js";
import { CustomizerRegionOptions } from "../../types/structures.js";
import { customizerDefault } from "../../types/payloads.js";

export default class RegionSettingsBuilder
    extends BaseBuilder<CustomizerRegionOptions> {
    static readonly #default: CustomizerRegionOptions = customizerDefault.custom.region;

    constructor(data?: Partial<CustomizerRegionOptions>) {
        super();
        this._body = super._deepCopy(RegionSettingsBuilder.#default);
        if (data) {
            for (const key in data) {
                this._body[key as keyof typeof data] = data[key as keyof typeof data];
            }
        }
    }

    get bossHeartsInPool(): boolean {
        return this._body.bossHeartsInPool;
    }

    get bossNormalLocation(): boolean {
        return this._body.bossNormalLocation;
    }

    get bossesHaveItem(): boolean {
        return this._body.bossesHaveItem;
    }

    get forceSkullWoodsKey(): boolean {
        return this._body.forceSkullWoodsKey;
    }

    get swordsInPool(): boolean {
        return this._body.swordsInPool;
    }

    get takeAnys(): boolean {
        return this._body.takeAnys;
    }

    get wildBigKeys(): boolean {
        return this._body.wildBigKeys;
    }

    get wildCompasses(): boolean {
        return this._body.wildCompasses;
    }

    get wildKeys(): boolean {
        return this._body.wildKeys;
    }

    get wildMaps(): boolean {
        return this._body.wildMaps;
    }

    setBossHeartsInPool(bool: boolean): this {
        this._body.bossHeartsInPool = bool;
        return this;
    }

    setBossNormalLocation(bool: boolean): this {
        this._body.bossNormalLocation = bool;
        return this;
    }

    setBossesHaveItem(bool: boolean): this {
        this._body.bossesHaveItem = bool;
        return this;
    }

    setForceSkullWoodsKey(bool: boolean): this {
        this._body.forceSkullWoodsKey = bool;
        return this;
    }

    setSwordsInPool(bool: boolean): this {
        this._body.swordsInPool = bool;
        return this;
    }

    setTakeAnys(bool: boolean): this {
        this._body.takeAnys = bool;
        return this;
    }

    setWildBigKeys(bool: boolean): this {
        this._body.wildBigKeys = bool;
        return this;
    }

    setWildCompasses(bool: boolean): this {
        this._body.wildCompasses = bool;
        return this;
    }

    setWildKeys(bool: boolean): this {
        this._body.wildKeys = bool;
        return this;
    }

    setWildMaps(bool: boolean): this {
        this._body.wildMaps = bool;
        return this;
    }
}
import BaseBuilder from "./BaseBuilder.js";
import { CustomizerRegionOptions, Keys } from "../../types/structures.js";
import { customizerDefault } from "../../types/symbol/payloads.js";

/**
 * An instance of this class represents a region settings payload supplied to
 * alttpr.com's customizer API.
 *
 * This class is not useful on its own. It is intended to be used in tandem
 * with a CustomSettingsBuilder.
 */
export default class RegionSettingsBuilder
    extends BaseBuilder<CustomizerRegionOptions> {
    static readonly #default: CustomizerRegionOptions = customizerDefault.custom.region;

    constructor(data?: Partial<CustomizerRegionOptions>) {
        super();
        this._body = super._deepCopy(RegionSettingsBuilder.#default);
        if (data) {
            for (const key of Object.keys(data) as Keys<CustomizerRegionOptions>) {
                this._body[key] = data[key];
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

    /**
     * Sets whether heart containers normally dropped from bosses should be
     * forced vanilla. (Not including the Sanctuary heart container)
     *
     * @param force Should heart containers be forced vanilla?
     * @returns The current object for chaining.
     */
    setBossHeartsInPool(force: boolean): this {
        this._body.bossHeartsInPool = force;
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

    /**
     * Sets whether pinball chest in SW is forced as a SW small key.
     *
     * @param force Should pinball chest be forced as a SW small key?
     * @returns The current object for chaining.
     */
    setForceSkullWoodsKey(force: boolean): this {
        this._body.forceSkullWoodsKey = force;
        return this;
    }

    /**
     * Sets whether take any caves will be enabled for the seed.
     *
     * @param enable
     * @returns The current object for chaining.
     */
    setTakeAnys(enable: boolean): this {
        this._body.takeAnys = enable;
        return this;
    }

    /**
     * Sets whether big keys can be shuffled outside their vanilla dungeons.
     *
     * @param shuffle Should big key shuffle be enabled?
     * @returns The current object for chaining.
     */
    setWildBigKeys(shuffle: boolean): this {
        this._body.wildBigKeys = shuffle;
        return this;
    }

    /**
     * Sets whether compasses can be shuffled outside their vanilla dungeons.
     *
     * @param shuffle Should compass shuffle be enabled?
     * @returns The current object for chaining.
     */
    setWildCompasses(shuffle: boolean): this {
        this._body.wildCompasses = shuffle;
        return this;
    }

    /**
     *
     * @param shuffle
     * @returns The current object for chaining.
     */
    setWildKeys(shuffle: boolean): this {
        this._body.wildKeys = shuffle;
        return this;
    }

    /**
     *
     * @param shuffle
     * @returns The current object for chaining.
     */
    setWildMaps(shuffle: boolean): this {
        this._body.wildMaps = shuffle;
        return this;
    }
}
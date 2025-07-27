import BaseBuilder from "./BaseBuilder.js";
import OverflowBuilder from "./OverflowBuilder.js";
import {
    BuilderCallback,
    CustomItemCounts,
    CustomItemValues,
    CustomizerItemOptions,
    ItemOverflowSettings,
    Keys,
} from "../../types/structures.js";
import { customizerDefault } from "../../types/symbol/payloads.js";

/**
 * An instance of this class represents an item settings payload supplied to
 * alttpr.com's customizer API.
 *
 * The class is not useful on its own. It is intended to be used in tandem
 * with a CustomSettingsBuilder.
 */
export default class ItemSettingsBuilder
    extends BaseBuilder<CustomizerItemOptions> {
    static readonly #default = customizerDefault.custom.item;

    get allowDarkRoomNav(): boolean {
        return this._body.require?.Lamp;
    }

    get requiredGoalCount(): number | "" {
        return this._body.Goal?.Required;
    }

    get itemValue(): Readonly<Partial<CustomItemValues>> {
        return this._body.value;
    }

    get overflow(): Readonly<Partial<ItemOverflowSettings>> {
        return this._body.overflow;
    }

    /**
     * Sets whether dark room navigation is considered in logic.
     *
     * @param allow Should dark room naviagation be in logic?
     * @returns The current object for chaining.
     */
    setAllowDarkRoomNav(allow: boolean): this {
        if (typeof this._body.require !== "object") {
            this._body.require = {};
        }
        this._body.require.Lamp = allow;
        return this;
    }

    /**
     * Sets the required number of Triforce pieces needed to complete the seed.
     *
     * @param count The number of Triforce pieces.
     * @returns The current object for chaining.
     */
    setRequiredGoalCount(count: number): this {
        if (count < 0) {
            throw new Error("count must be positive.");
        }
        if (typeof this._body.Goal !== "object") {
            this._body.Goal = {};
        }
        this._body.Goal.Required = count;
        return this;
    }

    /**
     * Sets the maximum upgrades the player can pick up in a seed and their
     * replacement items.
     *
     * @param overflow The overflow options. This argument can be passed as an
     * object literal, an OverflowBuilder, or a callback function.
     * @returns The current object for chaining.
     */
    setOverflow(overflow: OverflowBuilder): this;
    setOverflow(overflow: (builder: OverflowBuilder) => OverflowBuilder): this;
    setOverflow(overflow: ItemOverflowSettings): this;
    setOverflow(overflow: OverflowBuilder | BuilderCallback<OverflowBuilder> | ItemOverflowSettings): this {
        if (typeof overflow === "function") {
            overflow = overflow(new OverflowBuilder()).toJSON();
        } else if (overflow instanceof OverflowBuilder) {
            overflow = overflow.toJSON();
        }
        this._body.overflow = super._deepCopy(overflow);
        return this;
    }

    /**
     * Sets the value of items like clocks and rupoors.
     *
     * @param value A partial object literal of new item values.
     * @returns The current object for chaining.
     * @example
     * ```js
     * // Setting clock time values:
     * import { ItemSettingsBuilder } from "nottpr";
     * const item = new ItemSettingsBuilder()
     *     .setItemValue({
     *         RedClock: -200,
     *         GreenClock: 400,
     *         BlueClock: 100
     *     });
     * ```
     */
    setItemValue(value: Partial<CustomItemValues>): this {
        this._body.value = { ...value };
        return this;
    }

    /**
     * Sets the quantity of the items in the item pool according to the passed
     * object literal.
     *
     * This method accepts an optional boolean, `zero`, to change its behavior.
     * * If `false`, unspecified items will default to their default item pool
     * counts.
     * * If `true`, unspecified items will default to 0.
     *
     * @param counts The item count changes.
     * @param [zero=false] Whether unspecified items should have their counts
     * defaulted to 0. (Default: `false`)
     * @returns The current object for chaining.
     */
    setItemCounts(counts: Partial<CustomItemCounts>, zero = false): this {
        if (zero) {
            const res = super._deepCopy(ItemSettingsBuilder.#default.count);
            for (const key of Object.keys(res) as Keys<typeof res>) {
                res[key] = counts[key] ?? 0;
            }
            this._body.count = res;
        } else {
            this._body.count = { ...counts };
        }
        return this;
    }
}
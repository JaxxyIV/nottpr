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

export default class ItemSettingsBuilder
    extends BaseBuilder<CustomizerItemOptions> {
    static readonly #default = customizerDefault.custom.item;

    constructor() {
        super();
        this._body = super._deepCopy(ItemSettingsBuilder.#default);
    }

    get allowDarkRoomNav(): boolean {
        return this._body.require.Lamp;
    }

    get requiredGoalCount(): number | "" {
        return this._body.Goal.Required;
    }

    get itemValue(): Readonly<CustomItemValues> {
        return this._body.value;
    }

    get overflow(): Readonly<ItemOverflowSettings> {
        return this._body.overflow;
    }

    /**
     * Sets whether dark room navigation is considered in logic.
     *
     * @param allow Should dark room naviagation be in logic?
     * @returns The current object for chaining.
     */
    setAllowDarkRoomNav(allow: boolean): this {
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
        this._body.Goal.Required = count;
        return this;
    }

    /**
     * Sets the maximum upgrades the player can pick up in a seed and their
     * replacement items.
     *
     * @param overflow The overflow options.
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

    setItemValue(value: Partial<CustomItemValues>): this {
        const vDefs = super._deepCopy(ItemSettingsBuilder.#default.value);
        for (const key of Object.keys(vDefs) as Keys<typeof vDefs>) {
            if (!(key in value)) {
                if (key.startsWith("Bomb") || key.startsWith("Arrow")) {
                    continue;
                }
                value[key] = "" as never;
            }
        }
        this._body.value = value as CustomItemValues;
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
        const res = super._deepCopy(ItemSettingsBuilder.#default.count);
        if (!zero) {
            for (const key of Object.keys(counts) as Keys<typeof counts>) {
                res[key] = counts[key];
            }
        } else {
            for (const key of Object.keys(res) as Keys<typeof res>) {
                res[key] = counts[key] ?? 0;
            }
        }
        this._body.count = res;
        return this;
    }
}
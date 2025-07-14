import BaseBuilder from "./BaseBuilder.js";
import { CustomItemCounts, CustomItemValues, CustomizerItemOptions } from "../../types/structures.js";
import { OverflowOptions } from "../../types/optionObjs.js";
import { customizerDefault } from "../../types/payloads.js";

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

    get overflow(): Readonly<OverflowOptions> {
        return this._body.overflow;
    }

    setAllowDarkRoomNav(allow: boolean): this {
        this._body.require.Lamp = allow;
        return this;
    }

    setRequiredGoalCount(count: number): this {
        if (count < 0) {
            throw new Error("count must be positive.");
        }
        this._body.Goal.Required = count;
        return this;
    }

    setOverflow(opts: OverflowOptions): this {
        this._body.overflow = super._deepCopy(opts) as OverflowOptions;
        return this;
    }

    setItemValue(value: Partial<CustomItemValues>): this {
        const { value: vDefs } = ItemSettingsBuilder.#default;
        for (const key in vDefs) {
            if (!(key in value)) {
                value[key as keyof CustomItemValues] = "";
            }
        }
        this._body.value = super._deepCopy(value) as CustomItemValues;
        return this;
    }

    setItemCounts(counts: Partial<CustomItemCounts>): this {
        const res = super._deepCopy(ItemSettingsBuilder.#default.count) as CustomItemCounts;
        for (const key in counts) {
            res[key as keyof typeof counts] = counts[key as keyof typeof counts];
        }
        this._body.count = res;
        return this;
    }
}
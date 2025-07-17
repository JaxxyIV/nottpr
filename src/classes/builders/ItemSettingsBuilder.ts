import BaseBuilder from "./BaseBuilder.js";
import { CustomItemCounts, CustomItemValues, CustomizerItemOptions, ItemOverflowSettings } from "../../types/structures.js";
import { OverflowOptions } from "../../types/optionObjs.js";
import { customizerDefault } from "../../types/symbol/payloads.js";
import { Icon } from "../../types/enums.js";

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

    get goalIcon(): Icon {
        return this._body.Goal.Icon;
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

    setOverflow(opts: ItemOverflowSettings): this {
        this._body.overflow = super._deepCopy(opts);
        return this;
    }

    setGoalIcon(icon: Icon): this {
        this._body.Goal.Icon = icon;
        return this;
    }

    setItemValue(value: Partial<CustomItemValues>): this {
        const { value: vDefs } = ItemSettingsBuilder.#default;
        for (const key of Object.keys(vDefs) as (keyof CustomItemValues)[]) {
            if (!(key in value)) {
                if (key.startsWith("Bomb") || key.startsWith("Arrow")) {
                    continue;
                }
                value[key] = "" as never;
            }
        }
        this._body.value = super._deepCopy(value) as CustomItemValues;
        return this;
    }

    setItemCounts(counts: Partial<CustomItemCounts>): this {
        const res = super._deepCopy(ItemSettingsBuilder.#default.count);
        for (const key of Object.keys(counts) as (keyof CustomItemCounts)[]) {
            res[key] = counts[key];
        }
        this._body.count = res;
        return this;
    }
}
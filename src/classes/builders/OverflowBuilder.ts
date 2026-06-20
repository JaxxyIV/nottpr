import BaseBuilder from "./BaseBuilder.js";
import { Restrictable } from "../../types/strings.js";
import { ItemOverflowSettings, PartialRecord } from "../../types/structures.js";
import { Item } from "../../types/enums.js";

export default class OverflowBuilder
    extends BaseBuilder<ItemOverflowSettings> {
    constructor(data?: Partial<ItemOverflowSettings>) {
        super();
        if (!data) return;
        this._body = super._deepCopy(data);
    }

    get limits(): Readonly<PartialRecord<Restrictable, number>> {
        return super._deepCopy(this._body.count) as PartialRecord<Restrictable, number>;
    }

    get replacements(): Readonly<PartialRecord<Restrictable, Item>> {
        return super._deepCopy(this._body.replacement) as PartialRecord<Restrictable, Item>;
    }

    setLimits(limits: PartialRecord<Restrictable, number>): this {
        this._body.count = super._deepCopy(limits);
        return this;
    }

    setReplacements(replacements: PartialRecord<Restrictable, Item>): this {
        this._body.replacement = super._deepCopy(replacements);
        return this;
    }
}
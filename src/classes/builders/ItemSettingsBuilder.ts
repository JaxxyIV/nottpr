import { CustomizerItemOptions } from "../../types/apiStructs";
import BaseBuilder from "./BaseBuilder";
import { OverflowOptions } from "../../types/optionObjs";

export default class ItemSettingsBuilder extends BaseBuilder<keyof CustomizerItemOptions, any> {
    constructor() {
        super();
    }

    get allowDarkRoomNav(): boolean {
        return super._getProp("require").Lamp;
    }

    get requiredGoalCount(): number {
        const val: number | string = super._getProp("Goal").Required;
        return typeof val === "string" ? undefined : val;
    }

    get blueClockValue(): number {
        const val: number | string = super._getProp("value").BlueClock;
        return typeof val === "string" ? undefined : val;
    }

    get greenClockValue(): number {
        const val: number | string = super._getProp("value").GreenClock;
        return typeof val === "string" ? undefined : val;
    }

    get redClockValue(): number {
        const val: number | string = super._getProp("value").RedClock;
        return typeof val === "string" ? undefined : val;
    }

    get rupoorValue(): number {
        const val: number | string = super._getProp("value").Rupoor;
        return typeof val === "string" ? undefined : val;
    }

    // get swordOverflowCount(): number {
    //     return super._getProp("overflow")?.count?.Sword;
    // }

    // get shieldOverflowCount(): number {
    //     return super._getProp("overflow")?.count?.Shield;
    // }

    setAllowDarkRoomNav(allow: boolean): this {
        super._getProp("require").Lamp = allow;
        return this;
    }

    setRequiredGoalCount(count: number): this {
        if (count < 0) {
            throw new Error("count must be positive.");
        }
        super._getProp("Goal").required = count;
        return this;
    }

    setOverflow(opts: OverflowOptions): this {
        return super._setProp("overflow", opts);
    }
}
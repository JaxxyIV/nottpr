import { CustomizerItemOptions } from "../../types/apiStructs";
import BaseBuilder from "./BaseBuilder";

export default class ItemSettingsBuilder extends BaseBuilder<keyof CustomizerItemOptions, any> {
    constructor() {
        super();
    }

    get allowDarkRoomNav(): boolean {
        return super._getProp("require").Lamp;
    }

    get requiredGoalCount(): number | undefined {
        const val: number | string = super._getProp("Goal").Required;
        return typeof val === "string" ? undefined : val;
    }

    get blueClockValue(): number | undefined {
        const val: number | string = super._getProp("value").BlueClock;
        return typeof val === "string" ? undefined : val;
    }

    get greenClockValue(): number | undefined {
        const val: number | string = super._getProp("value").GreenClock;
        return typeof val === "string" ? undefined : val;
    }

    get redClockValue(): number | undefined {
        const val: number | string = super._getProp("value").RedClock;
        return typeof val === "string" ? undefined : val;
    }

    get rupoorValue(): number | undefined {
        const val: number | string = super._getProp("value").Rupoor;
        return typeof val === "string" ? undefined : val;
    }

    get swordOverflowCount(): number | undefined {
        return super._getProp("overflow")?.count?.Sword;
    }

    get shieldOverflowCount(): number | undefined {
        return super._getProp("overflow")?.count?.Shield;
    }

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
}
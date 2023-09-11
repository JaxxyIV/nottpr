import BaseSeedBuilder, { BaseSeedOptions } from "./BaseSeedBuilder";
import { EntranceShuffle } from "../../types/types";

export default class SeedBuilder extends BaseSeedBuilder {
    constructor(data?: SeedOptions) {
        if (typeof data === "undefined") {
            super();
            super._setProp("entrances", "none");
        } else {
            if ("entrances" in data) {
                const { entrances } = data;
                delete data.entrances;
                super(data);
                super._setProp("entrances", entrances);
            } else {
                super(data);
                super._setProp("entrances", "none");
            }
        }
    }

    get entrances(): EntranceShuffle {
        return super._getProp("entrances") as EntranceShuffle;
    }

    setEntrances(shuffle: EntranceShuffle): this {
        return super._setProp("entrances", shuffle);
    }
}

export type SeedOptions = BaseSeedOptions & {
    entrances?: EntranceShuffle
};
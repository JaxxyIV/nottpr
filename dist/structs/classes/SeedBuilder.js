import BaseSeedBuilder from "./BaseSeedBuilder.js";
export default class SeedBuilder extends BaseSeedBuilder {
    constructor(data) {
        if (typeof data === "undefined") {
            super();
            super._setProp("entrances", "none");
        }
        else {
            if ("entrances" in data) {
                const { entrances } = data;
                delete data.entrances;
                super(data);
                super._setProp("entrances", entrances);
            }
            else {
                super(data);
                super._setProp("entrances", "none");
            }
        }
    }
    get entrances() {
        return super._getProp("entrances");
    }
    setEntrances(shuffle) {
        return super._setProp("entrances", shuffle);
    }
}

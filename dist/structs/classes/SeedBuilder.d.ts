import BaseSeedBuilder, { BaseSeedOptions } from "./BaseSeedBuilder";
import { EntranceShuffle } from "../../types/types";
export default class SeedBuilder extends BaseSeedBuilder {
    constructor(data?: SeedOptions);
    get entrances(): EntranceShuffle;
    setEntrances(shuffle: EntranceShuffle): this;
}
export type SeedOptions = BaseSeedOptions & {
    entrances?: EntranceShuffle;
};

/// <reference types="node" />
import * as types from "../../types/types";
import * as structs from "../../types/apiStructs";
type SeedData = structs.SeedAPIData | structs.GenerateSeedAPIData;
type PostGenOptions = {
    heartSpeed?: types.HeartSpeed;
    heartColor?: types.HeartColor;
    menuSpeed?: types.MenuSpeed;
    quickswap?: boolean;
    backgroundMusic?: boolean;
    msu1Resume?: boolean;
    sprite?: string;
    reduceFlash?: boolean;
};
export default class Seed {
    #private;
    constructor(json: SeedData);
    get logic(): string;
    get spoiler(): structs.SpoilerAPIData;
    get hash(): string;
    get generated(): Date;
    get generatedTimestamp(): string;
    get size(): number;
    get currentRomHash(): string | undefined;
    get hashCode(): Array<string>;
    get permalink(): string;
    patchRom(base: string, options?: PostGenOptions): Promise<Buffer>;
    get [Symbol.toStringTag](): string;
}
export {};

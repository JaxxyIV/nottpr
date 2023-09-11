/// <reference types="node" />
import { SpriteAPIData } from "../../types/apiStructs";
export default class Sprite {
    #private;
    constructor(json: SpriteAPIData);
    get name(): string;
    get author(): string;
    get version(): number;
    get fileUrl(): string;
    get tags(): Array<string>;
    get usage(): Array<string>;
    fetch(): Promise<Buffer>;
    get [Symbol.toStringTag](): string;
}

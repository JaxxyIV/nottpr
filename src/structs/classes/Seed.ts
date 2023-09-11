import * as types from "../../types/types";
import * as structs from "../../types/apiStructs";
import * as enums from "../../types/enums";
import Request from "../util/Request";
import * as fs from "node:fs/promises";
import { SnesRom } from "rommage/SnesRom";
import { BpsPatch } from "rommage/BpsPatch";

type SeedData = structs.SeedAPIData | structs.GenerateSeedAPIData;
type PostGenOptions = {
    heartSpeed?: types.HeartSpeed
    heartColor?: types.HeartColor
    menuSpeed?: types.MenuSpeed
    quickswap?: boolean
    backgroundMusic?: boolean
    msu1Resume?: boolean
    sprite?: string
    reduceFlash?: boolean
};

export default class Seed {
    #logic: string;
    #patch: Array<structs.PatchElement>;
    #spoiler: structs.SpoilerAPIData;
    #hash: string;
    #generated: string;
    #size: number;
    #current_rom_hash?: string;

    constructor(json: SeedData) {
        ({
            logic: this.#logic,
            patch: this.#patch,
            spoiler: this.#spoiler,
            hash: this.#hash,
            generated: this.#generated,
            size: this.#size,
        } = json);

        if ("current_rom_hash" in json) {
            ({ current_rom_hash: this.#current_rom_hash } = json);
        } else {
            this.#current_rom_hash = undefined;
        }
    }

    get logic(): string {
        return this.#logic;
    }

    // get patch(): Array<structs.PatchElement> {
    //     return Array.from(this.#patch);
    // }

    get spoiler(): structs.SpoilerAPIData {
        return this.#spoiler;
    }

    get hash(): string {
        return this.#hash;
    }

    /**
     * Returns a Date object of when this Seed was generated.
     */
    get generated(): Date {
        return new Date(this.#generated);
    }

    /**
     * Returns when this Seed was generated as an ISO timestamp.
     */
    get generatedTimestamp(): string {
        return this.#generated;
    }

    get size(): number {
        return this.#size;
    }

    get currentRomHash(): string | undefined {
        return this.#current_rom_hash;
    }

    /**
     * Returns the start screen hash of this Seed as a string array.
     */
    get hashCode(): Array<string> {
        const codeLoc = this.#patch.find(e => parseInt(Object.keys(e)[0]) === 1573397);

        if (typeof codeLoc === "undefined") {
            throw new TypeError("Expected number[] but returned undefined");
        }

        const [bytes]: Array<Array<number>> = Object.values(codeLoc as object);
        return bytes.map(b => enums.Hash[b]);
    }

    /**
     * Returns this Seed's permalink.
     */
    get permalink(): string {
        return `https://alttpr.com/h/${this.#hash}`;
    }

    /**
     * Patches a base ALTTP ROM with this Seed's bps patch and returns the
     * patched ROM as a buffer.
     *
     * @param base The path to the base ROM
     * @param options Post-generation options
     */
    async patchRom(base: string, options: PostGenOptions = {
        heartSpeed: "normal",
        heartColor: "red",
        menuSpeed: "normal",
        quickswap: true,
        backgroundMusic: true,
        msu1Resume: true,
        sprite: "Link",
        reduceFlash: false
    }): Promise<Buffer> {
        // Set defaults
        if (!options.heartSpeed) options.heartSpeed = "normal";
        if (!options.heartColor) options.heartColor = "red";
        if (!options.menuSpeed) options.menuSpeed = "normal";
        if (options.quickswap === undefined) options.quickswap = true;
        if (options.backgroundMusic === undefined) options.backgroundMusic = true;
        if (options.msu1Resume === undefined) options.msu1Resume = true;
        if (!options.sprite) options.sprite = "Link";
        if (options.reduceFlash === undefined) options.reduceFlash = false;

        if (this.#current_rom_hash === undefined) {
            await this.#setRomHash();
        }

        const romBuffer: Buffer = await fs.readFile(base);

        const basePatch: ArrayBuffer = await new Request(`/bps/${this.#current_rom_hash}.bps`).get("buffer");
        const patchBuffer: Buffer = Buffer.from(basePatch);

        const bpsPatch: BpsPatch = new BpsPatch(patchBuffer);

        const patched: Buffer = bpsPatch.applyTo(romBuffer);
        const rom: SnesRom = SnesRom.fromBuffer(patched);

        return patched;
    }

    async #setRomHash(): Promise<void> {
        const response: structs.PatchAPIData = await new Request(`/api/h/${this.#hash}`).get("json");
        ({ md5: this.#current_rom_hash } = response);
    }

    get [Symbol.toStringTag](): string {
        return "Seed";
    }
}
import * as types from "../../types/types";
import * as structs from "../../types/apiStructs";
import Request from "../util/Request";
import Patcher from "../util/Patcher";
import Sprite from "./Sprite";
import * as fs from "node:fs/promises";
import { BpsPatch } from "rommage/BpsPatch";
import ALTTPR from "../util/ALTTPR";

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
        const hashStrings: Array<string> = [
            "Bow", "Boomerang", "Hookshot", "Bomb", "Mushroom",
            "Powder", "Ice Rod", "Pendant", "Bombos", "Ether",
            "Quake", "Lantern", "Hammer", "Shovel", "Ocarina",
            "Bug Net", "Book", "Bottle", "Green Potion", "Somaria",
            "Cape", "Mirror", "Boots", "Glove", "Flippers",
            "Moon Pearl", "Shield", "Mail", "Heart", "Map",
            "Compass", "Big Key",
        ];
        return bytes.map(b => hashStrings[b]);
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
        if (!options.sprite) {
            options.sprite = await (await ALTTPR.fetchSprite("Link")).fetch();
        } else if (typeof options.sprite === "string") {
            options.sprite = await (await ALTTPR.fetchSprite(options.sprite)).fetch();
        } else if (options.sprite instanceof Sprite) {
            options.sprite = await options.sprite.fetch();
        } else if (!(options.sprite instanceof Buffer)) {
            throw new TypeError("Invalid argument for sprite.");
        }

        const romBuffer: Buffer = await fs.readFile(base);

        // Base patch is applied first.
        const basePatch: Buffer = await this.fetchBasePatch();
        const bpsPatch: BpsPatch = new BpsPatch(basePatch);
        const patched: Buffer = bpsPatch.applyTo(romBuffer);

        // Then the seed-specific stuff is applied.
        const patcher: Patcher = new Patcher(patched);
        patcher.seedPatches = this.#patch;
        patcher.backgroundMusic = options.backgroundMusic ?? true;
        patcher.heartColor = options.heartColor ?? "red";
        patcher.heartSpeed = options.heartSpeed ?? "normal";
        patcher.menuSpeed = options.menuSpeed ?? "normal";
        patcher.msu1Resume = options.msu1Resume ?? true;
        patcher.quickswap = options.quickswap ?? true;
        patcher.reduceFlashing = options.reduceFlash ?? true;
        patcher.sprite = options.sprite;

        return patcher.buffer;
    }

    async fetchBasePatch(): Promise<Buffer> {
        if (typeof this.#current_rom_hash === "undefined") {
            await this.#setRomHash();
        }

        const response: ArrayBuffer = await new Request(`/bps/${this.#current_rom_hash}.bps`).get("buffer");
        return Buffer.from(response);
    }

    async #setRomHash(): Promise<void> {
        const response: structs.PatchAPIData = await new Request(`/api/h/${this.#hash}`).get("json");
        ({ md5: this.#current_rom_hash } = response);
    }

    get [Symbol.toStringTag](): string {
        return "Seed";
    }
}

type SeedData = structs.SeedAPIData | structs.GenerateSeedAPIData;
type PostGenOptions = {
    heartSpeed?: types.HeartSpeed
    heartColor?: types.HeartColor
    menuSpeed?: types.MenuSpeed
    quickswap?: boolean
    backgroundMusic?: boolean
    msu1Resume?: boolean
    sprite?: string | Sprite | Buffer
    reduceFlash?: boolean
};
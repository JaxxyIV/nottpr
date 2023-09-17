import * as fs from "node:fs/promises";
import { BpsPatch } from "rommage/BpsPatch";
import * as structs from "../../types/apiStructs";
import * as types from "../../types/types";
import ALTTPR from "./ALTTPR";
import Patcher from "./Patcher";
import Request from "./Request";
import Sprite from "./Sprite";

export default class Seed {
    readonly #logic: string;
    readonly #spoiler: structs.SpoilerAPIData;
    readonly #hash: string;
    readonly #generated: string;
    readonly #size: number;
    #current_rom_hash?: string;
    readonly #patchMap: Map<number, Array<number>>;

    static readonly #hashStrings: Array<string> = [
        "Bow", "Boomerang", "Hookshot", "Bomb", "Mushroom",
        "Powder", "Ice Rod", "Pendant", "Bombos", "Ether",
        "Quake", "Lantern", "Hammer", "Shovel", "Ocarina",
        "Bug Net", "Book", "Bottle", "Green Potion", "Somaria",
        "Cape", "Mirror", "Boots", "Glove", "Flippers",
        "Moon Pearl", "Shield", "Mail", "Heart", "Map",
        "Compass", "Big Key",
    ];

    constructor(json: SeedData) {
        ({
            logic: this.#logic,
            spoiler: this.#spoiler,
            hash: this.#hash,
            generated: this.#generated,
            size: this.#size,
        } = json);

        // By converting the patch data in the JSON to a Map, operations like
        // obtaining the file select hash will be much easier.
        this.#patchMap = new Map<number, Array<number>>(json.patch.map(o => {
            const [[key, values]] = Object.entries(o);
            return [parseInt(key), values];
        }));

        if ("current_rom_hash" in json) {
            ({ current_rom_hash: this.#current_rom_hash } = json);
        } else {
            this.#current_rom_hash = undefined;
        }
    }

    get logic(): string {
        return this.#logic;
    }

    /**
     * Returns this Seed's JSON patch data as a Map object. Elements in the Map
     * are keyed by their offsets.
     */
    get patchAsMap(): Map<number, Array<number>> {
        return this.#patchMap;
    }

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
        const loc: Array<number> | undefined = this.#patchMap.get(1573397);

        if (typeof loc === "undefined") {
            throw new TypeError("Expected number[] but returned undefined.");
        }

        return loc.map(b => Seed.#hashStrings[b]);
    }

    /**
     * Returns this Seed's permalink.
     */
    get permalink(): string {
        return `https://alttpr.com/h/${this.#hash}`;
    }

    /**
     * Patches a base ALTTP ROM with this Seed's JSON data and bps patch and
     * returns the result as a buffer.
     *
     * @param base The path to the base ROM.
     * @param options The post-generation options.
     * @returns The patched ROM as a buffer.
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
        patcher.seedPatches = this.#patchMap;
        patcher.backgroundMusic = options.backgroundMusic ?? true;
        patcher.heartColor = options.heartColor ?? "red";
        patcher.heartSpeed = options.heartSpeed ?? "normal";
        patcher.menuSpeed = options.menuSpeed ?? "normal";
        patcher.msu1Resume = options.msu1Resume ?? true;
        patcher.quickswap = options.quickswap ?? true;
        patcher.reduceFlashing = options.reduceFlash ?? true;
        patcher.sprite = options.sprite;

        // Finally, correct the buffer's checksum.
        patcher.fixChecksum();

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
        return `Seed-${this.#hash}`;
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
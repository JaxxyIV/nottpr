import * as enums from "../../types/enums.js";
import Request from "../util/Request.js";
import * as fs from "node:fs/promises";
import { SnesRom } from "rommage/SnesRom";
import { BpsPatch } from "rommage/BpsPatch";
export default class Seed {
    #logic;
    #patch;
    #spoiler;
    #hash;
    #generated;
    #size;
    #current_rom_hash;
    constructor(json) {
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
        }
        else {
            this.#current_rom_hash = undefined;
        }
    }
    get logic() {
        return this.#logic;
    }
    get spoiler() {
        return this.#spoiler;
    }
    get hash() {
        return this.#hash;
    }
    get generated() {
        return new Date(this.#generated);
    }
    get generatedTimestamp() {
        return this.#generated;
    }
    get size() {
        return this.#size;
    }
    get currentRomHash() {
        return this.#current_rom_hash;
    }
    get hashCode() {
        const codeLoc = this.#patch.find(e => parseInt(Object.keys(e)[0]) === 1573397);
        if (typeof codeLoc === "undefined") {
            throw new TypeError("Expected number[] but returned undefined");
        }
        const [bytes] = Object.values(codeLoc);
        return bytes.map(b => enums.Hash[b]);
    }
    get permalink() {
        return `https://alttpr.com/h/${this.#hash}`;
    }
    async patchRom(base, options = {
        heartSpeed: "normal",
        heartColor: "red",
        menuSpeed: "normal",
        quickswap: true,
        backgroundMusic: true,
        msu1Resume: true,
        sprite: "Link",
        reduceFlash: false
    }) {
        if (!options.heartSpeed)
            options.heartSpeed = "normal";
        if (!options.heartColor)
            options.heartColor = "red";
        if (!options.menuSpeed)
            options.menuSpeed = "normal";
        if (options.quickswap === undefined)
            options.quickswap = true;
        if (options.backgroundMusic === undefined)
            options.backgroundMusic = true;
        if (options.msu1Resume === undefined)
            options.msu1Resume = true;
        if (!options.sprite)
            options.sprite = "Link";
        if (options.reduceFlash === undefined)
            options.reduceFlash = false;
        if (this.#current_rom_hash === undefined) {
            await this.#setRomHash();
        }
        const romBuffer = await fs.readFile(base);
        const basePatch = await new Request(`/bps/${this.#current_rom_hash}.bps`).get("buffer");
        const patchBuffer = Buffer.from(basePatch);
        const bpsPatch = new BpsPatch(patchBuffer);
        const patched = bpsPatch.applyTo(romBuffer);
        const rom = SnesRom.fromBuffer(patched);
        return patched;
    }
    async #setRomHash() {
        const response = await new Request(`/api/h/${this.#hash}`).get("json");
        ({ md5: this.#current_rom_hash } = response);
    }
    get [Symbol.toStringTag]() {
        return "Seed";
    }
}

import center from "center-align";
import * as z3pr from "@maseya/z3pr";
import { HeartColor, HeartSpeed, MenuSpeed } from "../../types/strings";

export default class Patcher {
    // Symbolic Records
    /** Sprite author char bytes */
    static readonly #CHAR_REC: Record<string, [number, number]> = {
        " ": [0x9F, 0x9F], "0": [0x53, 0x79], "1": [0x54, 0x7A],
        "2": [0x55, 0x7B], "3": [0x56, 0x7C], "4": [0x57, 0x7D],
        "5": [0x58, 0x7E], "6": [0x59, 0x7F], "7": [0x5A, 0x80],
        "8": [0x5B, 0x81], "9": [0x5C, 0x82], "A": [0x5D, 0x83],
        "B": [0x5E, 0x84], "C": [0x5F, 0x85], "D": [0x60, 0x86],
        "E": [0x61, 0x87], "F": [0x62, 0x88], "G": [0x63, 0x89],
        "H": [0x64, 0x8A], "I": [0x65, 0x8B], "J": [0x66, 0x8C],
        "K": [0x67, 0x8D], "L": [0x68, 0x8E], "M": [0x69, 0x8F],
        "N": [0x6A, 0x90], "O": [0x6B, 0x91], "P": [0x6C, 0x92],
        "Q": [0x6D, 0x93], "R": [0x6E, 0x94], "S": [0x6F, 0x95],
        "T": [0x70, 0x96], "U": [0x71, 0x97], "V": [0x72, 0x98],
        "W": [0x73, 0x99], "X": [0x74, 0x9A], "Y": [0x75, 0x9B],
        "Z": [0x76, 0x9C], "'": [0xD9, 0xEC], ".": [0xDC, 0xEF],
        "/": [0xDB, 0xEE], ":": [0xDD, 0xF0], "_": [0xDE, 0xF1],
    };

    /** Heart Color bytes */
    static readonly #HCOL_REC: Record<HeartColor, number> = {
        red: 0x00,
        blue: 0x01,
        green: 0x02,
        yellow: 0x03,
    };

    /** Heart beep speed bytes */
    static readonly #HSPD_REC: Record<HeartSpeed, number> = {
        off: 0,
        double: 16,
        normal: 32,
        half: 64,
        quarter: 128,
    };

    /** Menu speed bytes */
    static readonly #MSPD_REC: Record<MenuSpeed, number> = {
        slow: 0x04,
        normal: 0x08,
        fast: 0x10,
        instant: 0xe8,
    };

    #buffer: Uint8Array;

    constructor(buffer: Uint8Array) {
        this.#buffer = buffer;
    }

    get buffer(): Buffer {
        return Buffer.from(this.#buffer);
    }

    setSeedPatches(patches: Map<number, number[]>): this {
        for (const [offset, values] of patches) {
            this.#write(offset, values);
        }
        return this;
    }

    setHeartColor(color: HeartColor): this {
        const byte = Patcher.#HCOL_REC[color] ?? Patcher.#HCOL_REC.red;
        this.#write(0x187020, byte);
        return this;
    }

    setHeartSpeed(speed: HeartSpeed): this {
        const byte = Patcher.#HSPD_REC[speed] ?? Patcher.#HSPD_REC.normal;
        this.#write(0x180033, byte);
        return this;
    }

    setMenuSpeed(speed: MenuSpeed): this {
        const byte = Patcher.#MSPD_REC[speed] ?? Patcher.#MSPD_REC.normal;
        const isInstant = byte === Patcher.#MSPD_REC.instant;
        this.#write(0x180048, byte);
        this.#write(0x6dd9a, isInstant ? 0x20 : 0x11);
        this.#write(0x6df2a, isInstant ? 0x20 : 0x12);
        this.#write(0x6e0e9, isInstant ? 0x20 : 0x12);
        return this;
    }

    setQuickswap(enable: boolean): this {
        this.#write(0x18004b, enable ? 0x01 : 0x00);
        return this;
    }

    setReduceFlashing(enable: boolean): this {
        this.#write(0x18017f, enable ? 0x01 : 0x00);
        return this;
    }

    setMsu1Resume(enable: boolean): this {
        if (!enable) {
            this.#write(0x18021D, 0x00);
            this.#write(0x18021E, 0x00);
        }
        return this;
    }

    setBackgroundMusic(enable: boolean): this {
        this.#write(0x18021a, enable ? 0x00 : 0x01);
        return this;
    }

    setSprite(data: Buffer): this {
        // Thanks VT
        if (this.#isZsprFormat(data)) {
            this.#parseZspr(data);
        } else { // Legacy handler
            for (let i = 0; i < 0x7000; ++i) {
                this.#write(0x80000 + i, data[i]);
            }
            for (let i = 0; i < 120; ++i) {
                this.#write(0xdd308 + i, data[0x7000 + i]);
            }
            this.#write(0xdedf5, data[0x7036]);
            this.#write(0xdedf6, data[0x7037]);
            this.#write(0xdedf7, data[0x7054]);
            this.#write(0xdedf8, data[0x7055]);
        }

        return this;
    }

    setPaletteShuffle(mode: z3pr.PaletteRandomizerOptions<number> | boolean |
        z3pr.PaletteMode): this {
        if (typeof mode === "boolean" && mode) {
            z3pr.randomize(this.#buffer, {
                mode: "maseya",
                randomize_overworld: true,
                randomize_dungeon: true,
                seed: Math.round(Math.random() * 4294967295),
            });
        } else if (typeof mode === "string" && mode !== "none") {
            z3pr.randomize(this.#buffer, {
                mode: mode,
                randomize_overworld: true,
                randomize_dungeon: true,
                seed: Math.round(Math.random() * 4294967295),
            });
        } else if (typeof mode === "object") {
            z3pr.randomize(this.#buffer, mode);
        }

        return this;
    }

    resize(size: number): void {
        const newSize = size * (1024 ** 2);
        const resizeSize = Math.min(newSize, this.#buffer.buffer.byteLength);
        const replacement = new Uint8Array(resizeSize);
        replacement.set(this.#buffer);
        this.#buffer = replacement;
    }

    fixChecksum(): this {
        // Also VT
        const total = this.#buffer.reduce((pre, cur, i) =>
            i >= 0x7fdc && i < 0x7fe0 ? pre : pre + cur);
        const checksum = (total + 0x1fe) & 0xffff;
        const inverse = checksum ^ 0xffff;
        this.#write(0x7fdc, [
            inverse & 0xff,
            inverse >> 8,
            checksum & 0xff,
            checksum >> 8,
        ]);

        return this;
    }

    #write(offset: number, bytes: number[] | number): void {
        if (typeof bytes === "number") {
            this.#buffer[offset] = bytes;
        } else for (let i = 0; i < bytes.length; ++i) {
            this.#buffer[offset + i] = bytes[i];
        }
    }

    #canWriteSpriteAuthor(): boolean {
        return this.#buffer[0x118000] === 0x02 &&
               this.#buffer[0x118001] === 0x37 &&
               this.#buffer[0x11801E] === 0x02 &&
               this.#buffer[0x11801F] === 0x37;
    }

    #isZsprFormat(data: Buffer): boolean {
        return data.subarray(0, 4).reduce((pr, cu) =>
            pr + String.fromCharCode(cu), "") === "ZSPR";
    }

    #parseZspr(data: Buffer): void {
        const gfxOffset = data[12] << 24 | data[11] << 16 |
                          data[10] << 8  | data[9];
        const palOffset = data[18] << 24 | data[17] << 16 |
                          data[16] << 8  | data[15];
        let metaIndex = 0x1D;
        let junk = 2;

        while (metaIndex < gfxOffset && junk > 0) {
            if (!data[metaIndex + 1] && !data[metaIndex]) {
                --junk;
            }
            metaIndex += 2;
        }

        let shortAuth = "";
        while (metaIndex < gfxOffset && data[metaIndex] !== 0x00) {
            shortAuth += String.fromCharCode(data[metaIndex]);
            ++metaIndex;
        }

        // Write sprite author (if we're not dealing with a legacy seed)
        if (this.#canWriteSpriteAuthor()) {
            shortAuth = center(shortAuth.substring(0, 28), 28).toUpperCase();
            if (shortAuth.length === 27) {
                shortAuth.padEnd(28);
            }

            for (let i = 0; i < shortAuth.length; ++i) {
                const char = shortAuth.charAt(i);
                const [up, low] =
                    Patcher.#CHAR_REC[char in Patcher.#CHAR_REC ? char : " "];
                this.#write(0x118002 + i, up);
                this.#write(0x118020 + i, low);
            }
        }

        // GFX
        if (gfxOffset !== 0xFFFFFFFF) {
            for (let i = 0; i < 0x7000; ++i) {
                this.#write(0x80000 + i, data[gfxOffset + i]);
            }
        }

        // Palettes
        for (let i = 0; i < 120; ++i) {
            this.#write(0xdd308 + i, data[palOffset + i]);
        }

        // Gloves
        for (let i = 0; i < 4; ++i) {
            this.#write(0xdedf5 + i, data[palOffset + 120 + i]);
        }
    }
}
import { PatchElement } from "../../types/apiStructs";
import { HeartColor, HeartSpeed, MenuSpeed } from "../../types/types";
const center = await import("center-align");

export default class Patcher {
    #buffer: Uint8Array;

    constructor(buffer: Uint8Array) {
        this.#buffer = buffer;
    }

    get buffer(): Buffer {
        return Buffer.from(this.#buffer);
    }

    set seedPatches(patches: Array<PatchElement>) {
        for (const patch of patches) {
            for (const [key, values] of Object.entries(patch)) {
                const offset: number = parseInt(key);
                this.#write(offset, values);
            }
        }
    }

    set heartColor(color: HeartColor) {
        let byte: number = 0x00;
        switch (color) {
            case "blue":
                byte = 0x01;
                break;
            case "green":
                byte = 0x02;
                break;
            case "yellow":
                byte = 0x03;
                break;
            case "red":
            default:
                break;
        }
        this.#write(0x187020, byte);
    }

    set heartSpeed(speed: HeartSpeed) {
        let byte: number = 32;
        switch (speed) {
            case "off":
                byte = 0;
                break;
            case "double":
                byte = 16;
                break;
            case "half":
                byte = 64;
                break;
            case "quarter":
                byte = 128;
                break;
            case "normal":
            default:
                break;
        }
        this.#write(0x180033, byte);
    }

    set menuSpeed(speed: MenuSpeed) {
        let byte: number = 0x08;
        switch (speed) {
            case "slow":
                byte = 0x04;
                break;
            case "fast":
                byte = 0x10;
                break;
            case "instant":
                byte = 0xe8;
                break;
            case "normal":
            default:
                break;
        }

        this.#write(0x180048, byte);
        this.#write(0x6dd9a, speed === "instant" ? 0x20 : 0x11);
        this.#write(0x6df2a, speed === "instant" ? 0x20 : 0x12);
        this.#write(0x6e0e9, speed === "instant" ? 0x20 : 0x12);
    }

    set quickswap(enable: boolean) {
        this.#write(0x18004b, enable ? 0x01 : 0x00);
    }

    set reduceFlashing(enable: boolean) {
        this.#write(0x18017f, enable ? 0x01 : 0x00);
    }

    set msu1Resume(enable: boolean) {
        if (!enable) {
            this.#write(0x18021D, 0x00);
            this.#write(0x18021E, 0x00);
        }
    }

    set backgroundMusic(enable: boolean) {
        this.#write(0x18021a, enable ? 0x00 : 0x01);
    }

    set sprite(data: Buffer) {
        // Thanks VT
        const gfxOffset: number = data[12] << 24 | data[11] << 16 | data[10] << 8 | data[9];
        const palOffset: number = data[18] << 24 | data[17] << 16 | data[16] << 8 | data[15];
        let metaIndex: number = 0x1D;
        let shortAuthor: string = "";
        let junk: number = 2;

        while (metaIndex < gfxOffset && junk > 0) {
            if (!data[metaIndex + 1] && !data[metaIndex]) --junk;
            metaIndex += 2;
        }

        while (metaIndex < gfxOffset && data[metaIndex] !== 0x00) {
            shortAuthor += String.fromCharCode(data[metaIndex]);
            ++metaIndex;
        }

        const tupleMap: { [x: string]: [number, number] } = {
            " ": [0x9F, 0x9F], "0": [0x53, 0x79], "1": [0x54, 0x7A], "2": [0x55, 0x7B],
            "3": [0x56, 0x7C], "4": [0x57, 0x7D], "5": [0x58, 0x7E], "6": [0x59, 0x7F],
            "7": [0x5A, 0x80], "8": [0x5B, 0x81], "9": [0x5C, 0x82], "A": [0x5D, 0x83],
            "B": [0x5E, 0x84], "C": [0x5F, 0x85], "D": [0x60, 0x86], "E": [0x61, 0x87],
            "F": [0x62, 0x88], "G": [0x63, 0x89], "H": [0x64, 0x8A], "I": [0x65, 0x8B],
            "J": [0x66, 0x8C], "K": [0x67, 0x8D], "L": [0x68, 0x8E], "M": [0x69, 0x8F],
            "N": [0x6A, 0x90], "O": [0x6B, 0x91], "P": [0x6C, 0x92], "Q": [0x6D, 0x93],
            "R": [0x6E, 0x94], "S": [0x6F, 0x95], "T": [0x70, 0x96], "U": [0x71, 0x97],
            "V": [0x72, 0x98], "W": [0x73, 0x99], "X": [0x74, 0x9A], "Y": [0x75, 0x9B],
            "Z": [0x76, 0x9C], "'": [0xD9, 0xEC], ".": [0xDC, 0xEF], "/": [0xDB, 0xEE],
            ":": [0xDD, 0xF0], "_": [0xDE, 0xF1],
        };

        shortAuthor = center(shortAuthor.substring(0, 28), 28).toUpperCase();

        const authorBytes: Array<[number, number]> = [];
        for (const char of shortAuthor) {
            if (char in tupleMap) {
                authorBytes.push(tupleMap[char]);
            } else {
                authorBytes.push(tupleMap[" "]);
            }
        }

        authorBytes.forEach(([up, low], index) => {
            this.#write(0x118002 + index, up);
            this.#write(0x118020 + index, low);
        });

        if (gfxOffset !== 0xFFFFFFFF)
            for (let i: number = 0; i < 0x7000; ++i)
                this.#write(0x80000 + i, data[gfxOffset + i]);

        for (let i: number = 0; i < 120; ++i)
            this.#write(0xdd308 + i, data[palOffset + i]);

        for (let i: number = 0; i < 4; ++i)
            this.#write(0xdedf5 + i, data[palOffset + 120 + i]);
    }

    #write(offset: number, bytes: Array<number> | number): void {
        if (typeof bytes === "number") {
            this.#buffer[offset] = bytes;
        } else for (let i: number = 0; i < bytes.length; ++i) {
            this.#buffer[offset + i] = bytes[i];
        }
    }
}
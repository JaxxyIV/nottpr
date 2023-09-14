import { PatchElement } from "../../types/apiStructs";
import { HeartColor, HeartSpeed, MenuSpeed } from "../../types/types";

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

    #write(offset: number, bytes: Array<number> | number): void {
        if (typeof bytes === "number") {
            this.#buffer[offset] = bytes;
        } else for (let i: number = 0; i < bytes.length; ++i) {
            this.#buffer[offset + i] = bytes[i];
        }
    }
}
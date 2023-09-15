import { SpriteAPIData } from "../../types/apiStructs";
import fetch, { Response } from "node-fetch";

export default class Sprite {
    #name: string;
    #author: string;
    #version: number;
    #file: string;
    #tags: Array<string>;
    #usage: Array<string>;

    constructor(json: SpriteAPIData) {
        ({
            name: this.#name,
            author: this.#author,
            version: this.#version,
            file: this.#file,
            tags: this.#tags,
            usage: this.#usage,
        } = json);
    }

    get name(): string {
        return this.#name;
    }

    get author(): string {
        return this.#author;
    }

    get version(): number {
        return this.#version;
    }

    get fileUrl(): string {
        return this.#file;
    }

    get tags(): Array<string> {
        return Array.from(this.#tags);
    }

    get usage(): Array<string> {
        return Array.from(this.#usage);
    }

    get [Symbol.toStringTag](): string {
        return `Sprite-${this.#name}`;
    }

    /**
     * Fetches the ZSPR data for this Sprite and returns it as a buffer.
     *
     * @returns The buffered data.
     */
    async fetch(): Promise<Buffer> {
        const response: Response = await fetch(this.#file);
        const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}
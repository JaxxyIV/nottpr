import fetch from "node-fetch";
import { SpriteAPIData } from "../../types/apiStructs";

export default class Sprite {
    #name: string;
    #author: string;
    #version: number;
    #file: string;
    #tags: string[];
    #usage: string[];
    #buffer?: Buffer;

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

    get tags(): string[] {
        return Array.from(this.#tags);
    }

    get usage(): string[] {
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
        if (!this.#buffer) {
            this.#buffer = await fetch(this.#file)
                .then(res => res.arrayBuffer())
                .then(buffer => Buffer.from(buffer));
        }
        return this.#buffer;
    }
}
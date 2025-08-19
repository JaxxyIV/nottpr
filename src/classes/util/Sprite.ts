import JSONTranslatable from "../interfaces/JSONTranslatable.js";
import { SpriteAPIData } from "../../types/structures.js";

/**
 * An instance of this class represents a sprite stored on alttpr.com.
 *
 * You can get a Sprite's .zspr file by using the `Sprite.fetch()` method. You
 * can also download a Sprite's preview as a blob by using the `Sprite.image()`
 * method.
 */
export default class Sprite
    implements JSONTranslatable<SpriteAPIData> {
    #name: string;
    #author: string;
    #version: number;
    #file: string;
    #tags: string[];
    #usage: string[];
    #preview: string;
    #buffer?: ArrayBuffer;
    #blob?: Blob;

    constructor(json: SpriteAPIData) {
        ({
            name: this.#name,
            author: this.#author,
            version: this.#version,
            file: this.#file,
            tags: this.#tags,
            usage: this.#usage,
            preview: this.#preview,
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

    get tags(): ReadonlyArray<string> {
        return Array.from(this.#tags);
    }

    get usage(): ReadonlyArray<string> {
        return Array.from(this.#usage);
    }

    get previewUrl(): string {
        return this.#preview;
    }

    get [Symbol.toStringTag](): string {
        return this.#name;
    }

    /**
     * Fetches the ZSPR data for this Sprite and returns it as an ArrayBuffer.
     *
     * @returns The buffered data.
     */
    async fetch(): Promise<ArrayBuffer> {
        if (!this.#buffer) {
            this.#buffer = await fetch(this.#file)
                .then(res => res.arrayBuffer());
        }
        return this.#buffer;
    }

    /**
     * Fetches the preview image for this Sprite and returns it as a Blob.
     *
     * @returns The image as a Blob.
     */
    async image(): Promise<Blob> {
        if (!this.#blob) {
            this.#blob = await fetch(this.#preview)
                .then(res => res.blob());
        }
        return this.#blob;
    }

    /**
     * Returns a JSON representation of this Sprite.
     *
     * @returns The JSON object.
     */
    toJSON(): SpriteAPIData {
        return {
            name: this.name,
            author: this.author,
            version: this.version,
            file: this.fileUrl,
            tags: Array.from(this.tags),
            usage: Array.from(this.usage),
            preview: this.previewUrl,
        };
    }
}
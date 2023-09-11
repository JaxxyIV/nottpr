import fetch from "node-fetch";
export default class Sprite {
    #name;
    #author;
    #version;
    #file;
    #tags;
    #usage;
    constructor(json) {
        ({
            name: this.#name,
            author: this.#author,
            version: this.#version,
            file: this.#file,
            tags: this.#tags,
            usage: this.#usage,
        } = json);
    }
    get name() {
        return this.#name;
    }
    get author() {
        return this.#author;
    }
    get version() {
        return this.#version;
    }
    get fileUrl() {
        return this.#file;
    }
    get tags() {
        return Array.from(this.#tags);
    }
    get usage() {
        return Array.from(this.#usage);
    }
    async fetch() {
        const response = await fetch(this.#file);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    get [Symbol.toStringTag]() {
        return "Sprite";
    }
}

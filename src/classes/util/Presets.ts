import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "yaml";
import BaseSeedBuilder from "../builders/BaseSeedBuilder.js";
import CustomizerBuilder from "../builders/CustomizerBuilder.js";
import SeedBuilder from "../builders/SeedBuilder.js";

/**
 * The Presets class is a utility class used for managing and storing saved
 * nottpr presets.
 */
export default class Presets {
    static #presetPath: string;
    static #default: string;
    static {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.#default = path.resolve(__dirname, "../..", "presets");
    }

    /**
     * Overrides the path for saving and loading presets.
     *
     * The default path for saving and loading presets is located in the local
     * nottpr module.
     *
     * @param path the new file path
     */
    static setPath(path: string): void {
        this.#presetPath = path;
    }

    /**
     * Reverts the save/load path for presets back to nottpr.
     */
    static resetPath(): void {
        this.#presetPath = this.#default;
    }

    /**
     * Saves a main or customizer preset to the local nottpr install with the
     * given name.
     *
     * The preset will be saved to the current path value. If `setPath` is not
     * used, the default behavior is to save the preset to the local nottpr
     * module, else the preset is saved to the path declared by the user in
     * `setPath`.
     *
     * @param name the preset name
     * @param preset the builder to save as a preset
     */
    static save(name: string, preset: SeedBuilder): void
    static save(name: string, preset: CustomizerBuilder): void
    static save(name: string, preset: SeedBuilder | CustomizerBuilder): void {
        if (!(preset instanceof BaseSeedBuilder)) {
            throw new TypeError("preset is not a nottpr-compatible object");
        }
        fs.writeFileSync(path.join(this.#getPath(), `${name}.yaml`), preset.toYAML());
    }

    /**
     * Loads a saved preset from the local nottpr install.
     *
     * @param preset the name of the preset to load
     * @param [custom] a boolean to indicate the return type of this call. This
     * does not change the return value and is mainly for asserting the return
     * type
     */
    static load(preset: string): SeedBuilder | CustomizerBuilder
    static load(preset: string, custom: true): CustomizerBuilder
    static load(preset: string, custom: false): SeedBuilder
    static load(preset: string, custom?: boolean): SeedBuilder | CustomizerBuilder {
        const buf = fs.readFileSync(path.join(this.#getPath(), `${preset}.yaml`));
        const str = buf.toString("utf8");
        const obj = yaml.parse(str);
        if (!("meta" in obj)) {
            throw new Error("Preset does not contain a meta");
        }
        if (obj.meta.source !== "nottpr") {
            throw new Error("Incompatible source");
        }
        if (obj.meta.branch === "main") {
            return SeedBuilder.from(obj.settings);
        } else if (obj.meta.branch === "customizer") {
            return CustomizerBuilder.from(obj.settings);
        } else {
            throw new Error("Specified branch is incompatible with nottpr");
        }
    }

    /**
     * Removes a preset from the local nottpr install and returns a boolean
     * indicating the success or failure of the operation.
     *
     * @param preset the preset to remove
     * @returns a boolean indicating the success or failure of the operation
     */
    static remove(preset: string): boolean {
        if (!this.listAll().includes(preset)) {
            return false;
        }
        fs.rmSync(path.join(this.#getPath(), `${preset}.yaml`));
        return true;
    }


    /**
     * Returns a list of all existing presets stored on the local nottpr
     * install.
     *
     * @returns
     */
    static listAll(): string[] {
        return fs.readdirSync(this.#getPath())
            .filter(f => f.endsWith(".yaml"))
            .map(f => f.substring(0, f.indexOf(".")));
    }

    static #getPath() {
        return this.#presetPath ?? this.#default;
    }
}
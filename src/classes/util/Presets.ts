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
    static #default: string;
    static {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.#default = path.resolve(__dirname, "../..", "presets");
    }

    /**
     * Saves a main or customizer preset to the local nottpr install with the
     * given name.
     *
     * @param name the preset name
     * @param preset the builder to save as a preset
     * @param pathname an optional path to override the default save location
     */
    static save(name: string, preset: SeedBuilder, pathname?: string): void
    static save(name: string, preset: CustomizerBuilder, pathname?: string): void
    static save(name: string, preset: SeedBuilder | CustomizerBuilder, pathname?: string): void {
        if (!name.trim().length || !/^[a-zA-Z0-9_-]+$/.test(name)) {
            throw new Error('Invalid preset name');
        }
        if (!(preset instanceof BaseSeedBuilder)) {
            throw new TypeError("preset is not a nottpr-compatible object");
        }
        fs.writeFileSync(path.join(pathname ?? this.#default, `${name}.yaml`), preset.toYAML());
    }

    /**
     * Loads a saved preset from the local nottpr install.
     *
     * @param preset the name of the preset to load
     * @param pathname an optional path to override the default load location
     * @param custom a boolean to indicate the return type of this call. This
     * does not change the return value and is mainly for asserting the return
     * type
     * @returns the SeedBuilder or CustomizerBuilder object associated with the
     * given preset
     */
    static load(preset: string): SeedBuilder | CustomizerBuilder
    static load(preset: string, pathname?: string, custom?: true): CustomizerBuilder
    static load(preset: string, pathname?: string, custom?: false): SeedBuilder
    static load(preset: string, pathname?: string, custom?: boolean): SeedBuilder | CustomizerBuilder {
        if (!preset.trim().length || !/^[a-zA-Z0-9_-]+$/.test(preset)) {
            throw new Error('Invalid preset name');
        }
        const buf = fs.readFileSync(path.join(pathname ?? this.#default, `${preset}.yaml`));
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
     * @param pathname an optional path to override the default remove location
     * @returns a boolean indicating the success or failure of the operation
     */
    static remove(preset: string, pathname?: string): boolean {
        if (!this.listAll(pathname).includes(preset)) {
            return false;
        }
        fs.rmSync(path.join(pathname ?? this.#default, `${preset}.yaml`));
        return true;
    }


    /**
     * Returns a list of all existing presets stored on the local nottpr
     * install.
     *
     * @param pathname an optional path to override the default read location
     * @returns
     */
    static listAll(pathname?: string): string[] {
        return fs.readdirSync(pathname ?? this.#default)
            .filter(f => f.endsWith(".yaml"))
            .map(f => f.substring(0, f.indexOf(".")));
    }
}
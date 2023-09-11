import Request from "./Request.js";
import Seed from "../classes/Seed.js";
import Sprite from "../classes/Sprite.js";
export default class ALTTPR {
    static #cache = new Map();
    static async randomizer(payload) {
        const response = await new Request("/api/randomizer")
            .post(JSON.stringify(payload), "json", {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            });
        const seed = new Seed(response);
        this.#cache.set(seed.hash, seed);
        return new Seed(response);
    }
    static async customizer(payload) {
        const response = await new Request("/api/customizer")
            .post(JSON.stringify(payload), "json");
        const seed = new Seed(response);
        this.#cache.set(seed.hash, seed);
        return new Seed(response);
    }
    static async fetchDaily() {
        const response = await new Request("/api/daily").get("json");
        return response.hash;
    }
    static async fetchSeed(hash, force = false) {
        if (!force) {
            const cached = this.#cache.get(hash);
            if (typeof cached !== "undefined") {
                return cached;
            }
        }
        const response = await new Request(`/hash/${hash}`).get("text");
        let parsed;
        try {
            parsed = JSON.parse(response);
        }
        catch (_) {
            throw new Error("No seed found.");
        }
        return new Seed(parsed);
    }
    static async fetchSprite(name) {
        const response = await new Request("/api/sprites").get("json");
        const sprite = response.find(({ name: sName }) => name === sName);
        if (typeof sprite === "undefined") {
            throw new Error(`No results for ${name} were found.`);
        }
        return new Sprite(sprite);
    }
}

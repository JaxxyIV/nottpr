import Request from "./Request";
import {
    RandomizerPayload,
    CustomizerPayload,
    DailyAPIData,
    SeedAPIData,
    SpriteAPIData,
    GenerateSeedAPIData
} from "../../types/apiStructs";
import Seed from "../classes/Seed";
import Sprite from "../classes/Sprite";
import SeedBuilder from "../classes/SeedBuilder";
import CustomizerBuilder from "../classes/CustomizerBuilder";

export default class ALTTPR {
    static #cache: Map<string, Seed> = new Map<string, Seed>();

    /**
     * Generates a randomized seed on alttpr.com.
     *
     * @param data The data to provide to the API.
     * @returns The generated Seed.
     */
    static async randomizer(data: RandomizerAPIData): Promise<Seed> {
        const response: GenerateSeedAPIData = await new Request("/api/randomizer")
            .post(JSON.stringify(data), "json", {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            });
        const seed: Seed = new Seed(response);
        this.#cache.set(seed.hash, seed);
        return new Seed(response);
    }

    /**
     * Generates a customizer seed on alttpr.com.
     *
     * @param data The data to provide to the API.
     * @returns The generated Seed.
     */
    static async customizer(data: CustomizerAPIData): Promise<Seed> {
        const response: GenerateSeedAPIData = await new Request("/api/customizer")
            .post(JSON.stringify(data), "json", {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            });
        const seed: Seed = new Seed(response);
        this.#cache.set(seed.hash, seed);
        return new Seed(response);
    }

    /**
     * Fetches the hash for the daily challenge.
     *
     * @returns The daily hash.
     */
    static async fetchDaily(): Promise<string> {
        const response: DailyAPIData = await new Request("/api/daily").get("json");
        return response.hash;
    }

    /**
     * Fetches the seed with the given hash.
     *
     * @param hash The seed hash.
     * @param force Whether to skip the cache check and request the API.
     * @returns The requested Seed.
     */
    static async fetchSeed(hash: string, force: boolean = false): Promise<Seed> {
        if (!force) {
            const cached: Seed | undefined = this.#cache.get(hash);
            if (typeof cached !== "undefined") {
                return cached;
            }
        }

        const response: string = await new Request(`/hash/${hash}`).get("text");
        let parsed: SeedAPIData;

        try {
            parsed = JSON.parse(response);
        } catch (_) {
            throw new Error("No seed found.");
        }

        const seed: Seed = new Seed(parsed);
        this.#cache.set(hash, seed);
        return seed;
    }

    /**
     * Fetches the sprite with the given name.
     *
     * @param name The name of the sprite.
     * @returns The requested Sprite.
     */
    static async fetchSprite(name: string): Promise<Sprite> {
        const response: Array<SpriteAPIData> = await new Request("/api/sprites").get("json");
        const sprite: SpriteAPIData | undefined = response.find(({ name: sName }) => name === sName);

        if (typeof sprite === "undefined") {
            throw new Error(`No results for ${name} were found.`);
        }

        return new Sprite(sprite);
    }
}

type RandomizerAPIData = SeedBuilder | RandomizerPayload;
type CustomizerAPIData = CustomizerBuilder | CustomizerPayload;
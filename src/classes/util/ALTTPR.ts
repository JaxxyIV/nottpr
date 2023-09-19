import {
    CustomizerPayload,
    DailyAPIData,
    GenerateSeedAPIData,
    RandomizerPayload,
    SeedAPIData,
    SpriteAPIData
} from "../../types/apiStructs";
import CustomizerBuilder from "../builders/CustomizerBuilder";
import Seed from "./Seed";
import SeedBuilder from "../builders/SeedBuilder";
import Sprite from "./Sprite";
import Request from "./Request";

export default class ALTTPR {
    static #seeds: Map<string, Seed> = new Map<string, Seed>();

    /**
     * Returns a Map of cached Seed objects. You can retrieve cached Seeds by
     * specifying their hash.
     */
    static get seeds(): Map<string, Seed> {
        return this.#seeds;
    }

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
        this.#seeds.set(seed.hash, seed);
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
        this.#seeds.set(seed.hash, seed);
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
     * Fetches the seed with the given hash and returns it as a Seed object.
     *
     * @param hash The seed hash.
     * @param force Whether to skip the cache check and request the API.
     * @returns The requested Seed.
     */
    static async fetchSeed(hash: string, force: boolean = false): Promise<Seed> {
        if (!force) {
            const cached: Seed | undefined = this.#seeds.get(hash);
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
        this.#seeds.set(hash, seed);
        return seed;
    }

    /**
     * Fetches the sprite with the given name.
     *
     * @param name The name of the sprite.
     * @returns The requested Sprite.
     */
    static async fetchSprite(name: string): Promise<Sprite> {
        const response: Array<SpriteAPIData> = await new Request("/sprites").get("json");
        const sprite: SpriteAPIData | undefined = response.find(({ name: sName }) => name === sName);

        if (typeof sprite === "undefined") {
            throw new Error(`No results for ${name} were found.`);
        }

        return new Sprite(sprite);
    }
}

type RandomizerAPIData = SeedBuilder | RandomizerPayload;
type CustomizerAPIData = CustomizerBuilder | CustomizerPayload;
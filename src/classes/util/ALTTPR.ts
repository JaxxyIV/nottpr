import Request from "./Request.js";
import Seed from "./Seed.js";
import Sprite from "./Sprite.js";
import CustomizerBuilder from "../builders/CustomizerBuilder.js";
import SeedBuilder from "../builders/SeedBuilder.js";
import {
    CustomizerPayload,
    DailyAPIData,
    RandomizerPayload,
    SeedAPIData,
    SpriteAPIData,
} from "../../types/structures.js";
import BaseSeedBuilder from "../builders/BaseSeedBuilder.js";


/**
 * The ALTTPR class is the main class for interacting with alttpr.com's API.
 * All methods in the class are static and the class cannot be instantiated.
 *
 * The ALTTPR class permits local caching of seeds and sprites through the
 * `ALTTPR.seeds` and `ALTTPR.sprites` map objects. You can retrieve a cached
 * seed or sprite by passing the seed's hash or the sprite's name to each map's
 * respective `get()` method.
 *
 * All data in the caches will be lost upon program termination. If you want the
 * data to persist between executions of nottpr, you should store the data
 * locally and manually repopulate the cache maps upon executing nottpr.
 */
export default class ALTTPR {
    static #seeds = new Map<string, Seed>();
    static #sprites = new Map<string, Sprite>();

    static #postHeaders: Record<string, string> = {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
    };

    constructor() {
        throw new Error("You cannot instantiate this class.");
    }

    /**
     * Returns a Map of cached Seed objects. You can retrieve cached Seeds by
     * specifying their hash.
     */
    static get seeds(): Map<string, Seed> {
        return this.#seeds;
    }

    /**
     * Returns a Map of cached Sprite objects. You can retrieve cached Sprites
     * by specifying their names.
     */
    static get sprites(): Map<string, Sprite> {
        return this.#sprites;
    }

    /**
     * Sets the Authorization header to be used in API requests to alttpr.com.
     *
     * @param login The login key.
     * @param password The password.
     */
    static setCredentials(login: string, password: string): void {
        this.#postHeaders.Authorization =
            `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
    }

    /**
     * Generates a new seed on alttpr.com with the provided settings and adds
     * it to the local cache.
     *
     * The endpoint used for seed generation is determined automatically from
     * your input.
     *
     * Note: Object literals are not checked for correctness or completeness.
     *
     * @param data The data to supply to the API. This argument can be passed
     * as a JSON object, a SeedBuilder, or a CustomizerBuilder.
     * @returns The resulting Seed object.
     */
    static async generate(data: SeedBuilder): Promise<Seed>
    static async generate(data: CustomizerBuilder): Promise<Seed>
    static async generate(data: RandomizerPayload): Promise<Seed>
    static async generate(data: CustomizerPayload): Promise<Seed>
    static async generate(data: RandomizerAPIData | CustomizerAPIData): Promise<Seed> {
        if (data instanceof BaseSeedBuilder) {
            data = data.toJSON(); // Force as literal to check customizer
        }
        const endpoint = "custom" in data ? "customizer" : "randomizer";
        const response: SeedAPIData = await new Request(`/api/${endpoint}`)
            .post(JSON.stringify(data), "json", this.#postHeaders);
        const seed = new Seed(response, this.#sprites);
        this.#seeds.set(seed.hash, seed);
        return seed;
    }

    /**
     * Fetches the hash for the daily challenge.
     *
     * @returns The daily hash.
     */
    static async fetchDaily(): Promise<string> {
        const { hash }: DailyAPIData = await new Request("/api/daily")
            .get("json");
        return hash;
    }

    /**
     * Fetches the seed with the given hash and returns it as a Seed object.
     *
     * @param hash The seed hash.
     * @returns The requested Seed.
     */
    static async fetchSeed(hash: string): Promise<Seed> {
        if (this.#seeds.has(hash)) {
            return this.#seeds.get(hash);
        }

        const response: string = await new Request(`/hash/${hash}`)
            .get("text");
        let parsed: SeedAPIData;

        try {
            parsed = JSON.parse(response);
        } catch (e) {
            throw new Error("No seed found.");
        }

        const seed = new Seed(parsed, this.#sprites);
        this.#seeds.set(hash, seed);
        return seed;
    }

    /**
     * Updates the local sprite cache and returns it. You can retrieve sprites
     * by name by using `ALTTPR.sprites.get()`.
     *
     * This method should only be used in the event of an update to alttpr.com's
     * sprite catalog.
     *
     * @returns `this.sprites`
     * @example
     * ```js
     * await ALTTPR.fetchSprites();
     * const sprite = ALTTPR.sprites.get("Angel");
     * const file = await sprite.fetch();
     * // or
     * const sprite = (await ALTTPR.fetchSprites()).get("Angel");
     * const file = await sprite.fetch();
     * ```
     */
    static async fetchSprites(): Promise<Map<string, Sprite>> {
        const response: SpriteAPIData[] = await new Request("/sprites")
            .get("json");
        for (const element of response) {
            const sprite = new Sprite(element);
            this.#sprites.set(sprite.name, sprite);
        }
        return this.#sprites;
    }
}

type RandomizerAPIData = SeedBuilder | RandomizerPayload;
type CustomizerAPIData = CustomizerBuilder | CustomizerPayload;
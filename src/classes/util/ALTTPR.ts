import {
    CustomizerPayload,
    DailyAPIData,
    GenerateSeedAPIData,
    RandomizerPayload,
    SeedAPIData,
    SpriteAPIData,
} from "../../types/structures";
import CustomizerBuilder from "../builders/CustomizerBuilder";
import Seed from "./Seed";
import SeedBuilder from "../builders/SeedBuilder";
import Sprite from "./Sprite";
import Request from "./Request";

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
     * Generates a randomized seed on alttpr.com and adds it to the local cache.
     *
     * @param data The data to provide to the API. This argument can be passed
     * as a JSON object, a SeedBuilder, or a callback function.
     * @returns The generated Seed.
     * @example
     * ```js
     * // Crosskeys using SeedBuilder:
     * const preset = new SeedBuilder()
     *     .setAccessibility(Accessibility.Locations)
     *     .setDungeonItems(Keysanity.Full)
     *     .setGoal(Goals.FastGanon)
     *     .setEntrances(Entrances.Crossed);
     * const seed = await ALTTPR.randomizer(preset);
     * console.log(seed.permalink);
     *
     * // Crosskeys using a callback:
     * const seed = await ALTTPR.randomizer(builder => builder
     *     .setAccessibility(Accessibility.Locations)
     *     .setDungeonItems(Keysanity.Full)
     *     .setGoal(Goals.FastGanon)
     *     .setEntrances(Entrances.Crossed));
     * console.log(seed.permalink);
     * ```
     */
    static async randomizer(data: SeedBuilder): Promise<Seed>
    static async randomizer(data: RandomizerPayload): Promise<Seed>
    static async randomizer(data: (builder: SeedBuilder) => SeedBuilder):
        Promise<Seed>
    static async randomizer(data: RandomizerAPIData |
        ((builder: SeedBuilder) => SeedBuilder)): Promise<Seed> {
        if (typeof data === "function") {
            data = data(new SeedBuilder());
        }
        const response: GenerateSeedAPIData =
            await new Request("/api/randomizer")
                .post(JSON.stringify(data), "json", {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                });
        const seed = new Seed(response, this.#sprites);
        this.#seeds.set(seed.hash, seed);
        return seed;
    }

    /**
     * Generates a customizer seed on alttpr.com and adds it to the local cache.
     *
     * @param data The data to provide to the API. This argument can be passed
     * as a JSON object, a CustomizerBuilder, or a callback function.
     * @returns The generated Seed.
     */
    static async customizer(data: CustomizerBuilder): Promise<Seed>
    static async customizer(data: CustomizerPayload): Promise<Seed>
    static async customizer(data: (builder: CustomizerBuilder) =>
        CustomizerBuilder): Promise<Seed>
    static async customizer(data: CustomizerAPIData |
        ((builder: CustomizerBuilder) => CustomizerBuilder)): Promise<Seed> {
        if (typeof data === "function") {
            data = data(new CustomizerBuilder());
        }
        const response: GenerateSeedAPIData =
            await new Request("/api/customizer")
                .post(JSON.stringify(data), "json", {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                });
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
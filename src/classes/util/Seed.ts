import patch, { PatchOptions } from "z3r-patch";
// import { PaletteMode, PaletteRandomizerOptions } from "@maseya/z3pr";
import Sprite from "./Sprite.js";
import JSONTranslatable from "../interfaces/JSONTranslatable.js";
import { SpoilerAPIData, SeedAPIData } from "../../types/structures.js";
import {
    Drop,
    DropByte,
    EnemyGroup,
    HeartColor,
    HeartSpeed,
    MenuSpeed,
} from "../../types/enums.js";
import { prizePacks } from "../../types/symbol/prizePacks.js";

/**
 * An instance of this class represents a seed generated on alttpr.com.
 */
export default class Seed
    implements JSONTranslatable<SeedAPIData> {
    #logic: string;
    #spoiler: SpoilerAPIData;
    #hash: string;
    #generated: string;
    #size: number;
    #current_rom_hash?: string;
    #origPatch: Record<number, number[]>[];
    #patchMap = new Map<number, number[]>();

    readonly #sprites: Map<string, Sprite>;

    static readonly #HASH_STRINGS = [
        "Bow", "Boomerang", "Hookshot", "Bomb", "Mushroom",
        "Powder", "Ice Rod", "Pendant", "Bombos", "Ether",
        "Quake", "Lantern", "Hammer", "Shovel", "Ocarina",
        "Bug Net", "Book", "Bottle", "Green Potion", "Somaria",
        "Cape", "Mirror", "Boots", "Glove", "Flippers",
        "Moon Pearl", "Shield", "Mail", "Heart", "Map",
        "Compass", "Big Key",
    ];

    constructor(json: SeedAPIData, sprites: Map<string, Sprite>) {
        this.#sprites = sprites;
        ({
            logic: this.#logic,
            spoiler: this.#spoiler,
            patch: this.#origPatch,
            hash: this.#hash,
            generated: this.#generated,
            size: this.#size,
        } = json);

        // By converting the patch data in the JSON to a Map, operations like
        // obtaining the file select hash will be much easier.
        for (const patch of this.#origPatch) {
            for (const key in patch) {
                const bytes = patch[key];
                this.#patchMap.set(parseInt(key, 10), bytes);
            }
        }

        this.#current_rom_hash = "current_rom_hash" in json
            ? json.current_rom_hash
            : undefined;
    }

    get logic(): string {
        return this.#logic;
    }

    /**
     * Returns this Seed's JSON patch data as a Map object. Elements in the Map
     * are keyed by their offsets.
     */
    get patchMap(): ReadonlyMap<number, ReadonlyArray<number>> {
        return this.#patchMap;
    }

    get hash(): string {
        return this.#hash;
    }

    /**
     * Returns a Date object of when this Seed was generated.
     */
    get generated(): Date {
        return new Date(this.#generated);
    }

    /**
     * Returns when this Seed was generated as an ISO timestamp.
     */
    get generatedTimestamp(): string {
        return this.#generated;
    }

    get size(): number {
        return this.#size;
    }

    get currentRomHash(): string {
        return this.#current_rom_hash;
    }

    /**
     * Returns the start screen hash of this Seed as a string array.
     */
    get hashCode(): ReadonlyArray<string> {
        return this.#seekInPatch(1573397, 5)
            .map(b => Seed.#HASH_STRINGS[b]);
    }

    /**
     * Returns this Seed's permalink.
     */
    get permalink(): string {
        return `https://alttpr.com/h/${this.#hash}`;
    }

    get [Symbol.toStringTag](): string {
        return this.#hash;
    }

    /**
     * Patches a base ALTTP ROM with this Seed's JSON data and bps patch and
     * returns the result as a buffer.
     *
     * **Notes:**
     * * The value for `options.sprite` can be passed as a string, Sprite object,
     * or ArrayBuffer object.
     *
     * @param base The path to the base ROM.
     * @param options Additional post-generation options.
     * @returns The patched ROM as buffered data.
     */
    async patch(base: string, options: PostGenOptions = {}): Promise<Uint8Array> {
        // Correct the value provided for sprite (if necessary)
        if (options.sprite === undefined) { // Empty if-statement to account for undefined
        } else if (typeof options.sprite === "string") {
            if (!this.#sprites.has(options.sprite)) {
                throw new ReferenceError("Sprite does not exist in local cache.");
            }
            options.sprite = await this.#sprites.get(options.sprite).fetch();
        } else if (options.sprite instanceof Sprite) {
            options.sprite = await options.sprite.fetch();
        } else if (!(options.sprite instanceof ArrayBuffer)) {
            throw new TypeError("Invalid argument for sprite.");
        }

        // Apparently, trying to write a different menu speed for a tournament
        // seed doesn't modify the menu speed (which is the intended behavior).
        // However, it DOES (for some reason) modify the menu's sound effect.
        // This would obviously not be 1:1 with alttpr.com, so we have to add a
        // proper sanity check here for race seeds.
        if (this.#spoiler.meta.tournament) {
            delete options.menuSpeed;
        }

        return patch(base, this.toJSON(), options as PatchOptions);
    }

    toJSON(): Readonly<SeedAPIData> {
        return {
            logic: this.#logic,
            generated: this.#generated,
            hash: this.#hash,
            size: this.#size,
            spoiler: this.#spoiler,
            current_rom_hash: this.#current_rom_hash,
            patch: this.#origPatch,
        };
    }

    /**
     * Formats the spoiler log for this Seed and outputs the data as a Uint8Array.
     *
     * @param showDrops Should additional data about prize packs and tree pulls
     * be included?
     * @returns The formatted spoiler log as a Uint8Array.
     */
    formatSpoiler(showDrops = false): Uint8Array {
        // if "off" or "mystery", nothing special happens. Just return the
        // spoiler as-is.
        if (this.#spoiler.meta.spoilers === "off" ||
            this.#spoiler.meta.spoilers === "mystery") {
            const log = JSON.parse(JSON.stringify(this.#spoiler));
            log.meta.hash = this.#hash;
            log.meta.permalink = this.permalink;
            log.meta.code = this.hashCode.join(", ");
            return new TextEncoder()
                .encode(JSON.stringify(this.#spoiler, undefined, 4));
        }

        const log: Record<string, any> = {}; // TODO: Properly type this

        const dungeons = {
            "A1": "CastleTower",
            "A2": "GanonsTower",
            "H2": "HyruleCastle",
            "P1": "EasternPalace",
            "P2": "DesertPalace",
            "P3": "TowerOfHera",
            "D1": "DarkPalace",
            "D2": "SwampPalace",
            "D3": "SkullWoods",
            "D4": "ThievesTown",
            "D5": "IcePalace",
            "D6": "MiseryMire",
            "D7": "TurtleRock",
        };

        if ("shuffle" in this.#spoiler.meta) { // Entrance rando
            log.Prizes = {
                "Eastern Palace": undefined,
                "Desert Palace": undefined,
                "Tower of Hera": undefined,
                "Palace of Darkness": undefined,
                "Swamp Palace": undefined,
                "Skull Woods": undefined,
                "Thieves Town": undefined,
                "Ice Palace": undefined,
                "Misery Mire": undefined,
                "Turtle Rock": undefined,
            };
            log.Special = this.#spoiler.Special;
            log.Bosses = this.#spoiler.Bosses;
            log["Light World"] = this.#spoiler["Light World"];
            log["Dark World"] = this.#spoiler["Dark World"];
            log.Caves = this.#spoiler.Caves;
            log["Hyrule Castle"] = this.#spoiler["Hyrule Castle"];
            log["Eastern Palace"] = this.#spoiler["Eastern Palace"];
            log["Desert Palace"] = this.#spoiler["Desert Palace"];
            log["Tower of Hera"] = this.#spoiler["Tower of Hera"];
            log["Agahnims Tower"] = this.#spoiler["Agahnims Tower"];
            log["Palace of Darkness"] = this.#spoiler["Palace of Darkness"];
            log["Swamp Palace"] = this.#spoiler["Swamp Palace"];
            log["Skull Woods"] = this.#spoiler["Skull Woods"];
            log["Thieves Town"] = this.#spoiler["Thieves Town"];
            log["Ice Palace"] = this.#spoiler["Ice Palace"];
            log["Misery Mire"] = this.#spoiler["Misery Mire"];
            log["Turtle Rock"] = this.#spoiler["Turtle Rock"];
            log["Ganons Tower"] = this.#spoiler["Ganons Tower"];
            log.Entrances = this.#spoiler.Entrances;

            for (const key in log.Prizes) {
                const values: string[] = Object.values(this.#spoiler[key as keyof SpoilerAPIData]);
                log.Prizes[key] = values.find(v =>
                    v.startsWith("Crystal") || v.endsWith("Pendant"));
            }
        } else {
            log.Prizes = {
                "Eastern Palace": undefined,
                "Desert Palace": undefined,
                "Tower Of Hera": undefined,
                "Dark Palace": undefined,
                "Swamp Palace": undefined,
                "Skull Woods": undefined,
                "Thieves Town": undefined,
                "Ice Palace": undefined,
                "Misery Mire": undefined,
                "Turtle Rock": undefined,
            };
            log.Special = {};
            log.Bosses = {};
            log["Light World"] = {};
            log["Death Mountain"] = {};
            log["Dark World"] = {};
            log["Hyrule Castle"] = {};
            log["Eastern Palace"] = {};
            log["Desert Palace"] = {};
            log["Tower Of Hera"] = {};
            log["Castle Tower"] = {};
            log["Dark Palace"] = {};
            log["Swamp Palace"] = {};
            log["Skull Woods"] = {};
            log["Thieves Town"] = {};
            log["Ice Palace"] = {};
            log["Misery Mire"] = {};
            log["Turtle Rock"] = {};
            log["Ganons Tower"] = {};

            for (const key of Object.keys(log)) {
                if (!(key in this.#spoiler)) {
                    continue;
                }

                const entries: [string, string][] =
                    Object.entries(this.#spoiler[key as keyof SpoilerAPIData]);
                for (const [rawLoc, rawItem] of entries) {
                    const loc = rawLoc.replace(":1", "");
                    let item = rawItem.replace(":1", "");
                    const dKey = Object.keys(dungeons).find(k => item.endsWith(k));

                    if (typeof dKey !== "undefined") {
                        item += `-${dungeons[dKey as keyof typeof dungeons]}`;
                    }

                    log[key][loc] = item;
                }
            }

            for (const key of Object.keys(log.Prizes)) {
                // Have to deal with inconsistencies in how things are referred
                // to in the log.
                const actualKey = key === "Dark Palace" ? "Palace of Darkness"
                    : key === "Thieves Town" ? "Thieves' Town"
                    : key === "Tower Of Hera" ? "Tower of Hera"
                    : key;

                log.Prizes[key] = log[key][`${actualKey} - Prize`];
            }
        }

        [log.Special["Dig Game"]] = this.#seekInPatch(982421);

        if (showDrops) {
            log.Special.Drops = this.#readDrops();
        }

        log.meta = this.#spoiler.meta;
        log.meta.hash = this.#hash;
        log.meta.permalink = this.permalink;
        log.meta.code = this.hashCode.join(", ");

        return new TextEncoder()
            .encode(JSON.stringify(log, undefined, 4));
    }

    // Thanks clearmouse
    #readDrops(): DropsSpoilerData {
        const offsets = {
            stun: 227731,
            tree: 981972,
            crab: [207304, 207300], // main, last
            fish: 950988,
            enemy: 227960,
        };
        const itemSprites: Record<DropByte, Drop> = {
            [DropByte.Bee]: Drop.BeeSwarm,
            [DropByte.GoodBee]: Drop.GoodBee,
            [DropByte.Heart]: Drop.Heart,
            [DropByte.OneRupee]: Drop.GreenRupee,
            [DropByte.FiveRupees]: Drop.BlueRupee,
            [DropByte.TwentyRupees]: Drop.RedRupee,
            [DropByte.OneBomb]: Drop.OneBomb,
            [DropByte.FourBombs]: Drop.FourBombs,
            [DropByte.EightBombs]: Drop.EightBombs,
            [DropByte.SmallMagic]: Drop.SmallMagic,
            [DropByte.LargeMagic]: Drop.FullMagic,
            [DropByte.FiveArrows]: Drop.FiveArrows,
            [DropByte.TenArrows]: Drop.TenArrows,
            [DropByte.Fairy]: Drop.Fairy,
        };

        const drops: DropsSpoilerData = {
            Tree: {},
            Stun: undefined,
            Fish: undefined,
            Crab: {},
            Packs: {},
        };

        // Tree Pulls
        const treePulls = this.#seekInPatch(offsets.tree, 3);
        for (let i = 1; i <= treePulls.length; ++i) {
            const byte = treePulls[i - 1];
            drops.Tree[i as keyof PullTiers] = getDropSprite(byte);
        }

        // Stun
        drops.Stun = getDropSprite(this.#seekInPatch(offsets.stun, 1)[0]);

        // Fish
        drops.Fish = getDropSprite(this.#seekInPatch(offsets.fish, 1)[0]);

        // Crab
        drops.Crab.Main = getDropSprite(this.#seekInPatch(offsets.crab[0], 1)[0]);
        drops.Crab.Last = getDropSprite(this.#seekInPatch(offsets.crab[1], 1)[0]);

        // Enemy Packs
        const packs: DropByte[][] = [[], [], [], [], [], [], [],];
        const rowLimit = 8;

        const prizePackDrops = this.#seekInPatch(offsets.enemy);
        for (let i = 0; i < prizePackDrops.length; ++i) {
            packs[Math.floor(i / rowLimit)].push(prizePackDrops[i]);
        }

        for (let i = 0; i < packs.length; ++i) {
            const key = Object.keys(prizePacks)[i] as EnemyGroup;
            drops.Packs[key] = getPrizePackName(packs[i]);
        }

        return drops;

        function getDropSprite(byte: DropByte): Drop {
            if (byte in itemSprites) {
                return itemSprites[byte];
            } else {
                throw new Error(`No matching droppable found for ${byte}`);
            }
        }

        function getPrizePackName(pack: DropByte[]): string {
            // If the array contains one of these two bytes, we can safely assume
            // that the pack is not vanilla.
            if (pack.some(b => b === DropByte.Bee || b === DropByte.GoodBee)) {
                return pack.map(b => getDropSprite(b)).join(", ");
            }

            for (const [key, values] of Object.entries(prizePacks)) {
                if (pack.toString() === values.toString()) {
                    return key;
                }
            }

            return pack.map(b => getDropSprite(b)).join(", ");
        }
    }

    /**
     * Searches the patch data for the given byte offset. If the offset does
     * not exist in the map, the requested data at the next closest offset is
     * returned.
     *
     * @param offset The byte offset to search for.
     * @param byteCount The number of bytes to retrieve at the offset.
     * @returns The byte data at the given offset.
     */
    #seekInPatch(offset: number, byteCount?: number): number[] {
        if (this.#patchMap.has(offset)) {
            return typeof byteCount === "number"
                ? this.#patchMap.get(offset).slice(0, byteCount)
                : this.#patchMap.get(offset);
        }

        // If the offset does not exist here, then we know we are dealing with
        // an entrance seed. (The patch data is minified.)
        const offsets: number[] = [];
        for (const [key] of this.#patchMap) {
            offsets.push(key);
        }
        offsets.sort((a, b) => a - b);

        // If the requested byte is (somehow) out of range of even the highest
        // or lowest offset, we're just not going to even bother continuing the
        // search at this point.
        if (offset < offsets[0] || offset > offsets[offsets.length - 1]) {
            throw new RangeError(`Offset ${offset} is out of range.`);
        }

        // Binary search for the closest result. The element with the least
        // difference compared to the target is the one we're going with.
        const closest = Seed.#binarySearch(offsets, offset);
        const data = this.#patchMap.get(offsets[closest]);
        const i = offset - offsets[closest];

        return typeof byteCount === "number"
            ? data.slice(i, i + byteCount)
            : data.slice(i);
    }

    /**
     * Returns the index of the closest value to the given target.
     *
     * Precondition: `array` is sorted in ascending order.
     *
     * @param array The array to search.
     * @param target The value to find.
     * @param low The lower bound.
     * @param high The upper bound.
     * @returns The index of the closest value to the target.
     */
    static #binarySearch(array: number[], target: number, low: number = 0,
        high: number = array.length - 1): number {
        if (low > high) {
            // Return whichever result is closest to the target.
            return array[low] - target < target - array[high] ? low : high;
        }

        const middle = Math.floor((low + high) / 2);

        if (array[middle] === target) {
            return middle;
        } else if (array[middle] > target) {
            return this.#binarySearch(array, target, low, middle - 1);
        } else { // array[middle] < target
            return this.#binarySearch(array, target, middle + 1, high);
        }
    }
}

type PostGenOptions = {
    heartSpeed?: HeartSpeed,
    heartColor?: HeartColor,
    menuSpeed?: MenuSpeed,
    quickswap?: boolean,
    //paletteShuffle?: PaletteRandomizerOptions<number> | boolean | PaletteMode,
    backgroundMusic?: boolean,
    msu1Resume?: boolean,
    sprite?: string | Sprite | ArrayBuffer,
    reduceFlash?: boolean,
};
type DropsSpoilerData = {
    Tree?: PullTiers
    Crab?: {
        Main?: Drop
        Last?: Drop
    }
    Stun?: Drop
    Fish?: Drop
    Packs?: Partial<Record<EnemyGroup, string>>

};
type PullTiers = Partial<Record<1 | 2 | 3, Drop>>;
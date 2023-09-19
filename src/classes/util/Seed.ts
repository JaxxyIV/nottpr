import * as fs from "node:fs/promises";
import { BpsPatch } from "rommage/BpsPatch";
import * as structs from "../../types/apiStructs";
import * as types from "../../types/types";
import ALTTPR from "./ALTTPR";
import Patcher from "./Patcher";
import Request from "./Request";
import Sprite from "./Sprite";

export default class Seed {
    readonly #logic: string;
    readonly #spoiler: structs.SpoilerAPIData;
    readonly #hash: string;
    readonly #generated: string;
    readonly #size: number;
    #current_rom_hash?: string;
    readonly #patchMap: Map<number, Array<number>>;

    static readonly #hashStrings: Array<string> = [
        "Bow", "Boomerang", "Hookshot", "Bomb", "Mushroom",
        "Powder", "Ice Rod", "Pendant", "Bombos", "Ether",
        "Quake", "Lantern", "Hammer", "Shovel", "Ocarina",
        "Bug Net", "Book", "Bottle", "Green Potion", "Somaria",
        "Cape", "Mirror", "Boots", "Glove", "Flippers",
        "Moon Pearl", "Shield", "Mail", "Heart", "Map",
        "Compass", "Big Key",
    ];

    constructor(json: SeedData) {
        ({
            logic: this.#logic,
            spoiler: this.#spoiler,
            hash: this.#hash,
            generated: this.#generated,
            size: this.#size,
        } = json);

        // By converting the patch data in the JSON to a Map, operations like
        // obtaining the file select hash will be much easier.
        this.#patchMap = new Map<number, Array<number>>();
        json.patch.forEach(p => {
            const [[offset, bytes]] = Object.entries(p);
            this.#patchMap.set(parseInt(offset), bytes);
        });

        if ("current_rom_hash" in json) {
            ({ current_rom_hash: this.#current_rom_hash } = json);
        } else {
            this.#current_rom_hash = undefined;
        }
    }

    get logic(): string {
        return this.#logic;
    }

    /**
     * Returns this Seed's JSON patch data as a Map object. Elements in the Map
     * are keyed by their offsets.
     */
    get patchAsMap(): Map<number, Array<number>> {
        return this.#patchMap;
    }

    // get spoiler(): structs.SpoilerAPIData {
    //     return this.#spoiler;
    // }

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

    get currentRomHash(): string | undefined {
        return this.#current_rom_hash;
    }

    /**
     * Returns the start screen hash of this Seed as a string array.
     */
    get hashCode(): Array<string> {
        const loc: Array<number> | undefined = this.#patchMap.get(1573397);

        if (typeof loc === "undefined") {
            throw new TypeError("Expected number[] but returned undefined.");
        }

        return loc.map(b => Seed.#hashStrings[b]);
    }

    /**
     * Returns this Seed's permalink.
     */
    get permalink(): string {
        return `https://alttpr.com/h/${this.#hash}`;
    }

    /**
     * Formats the spoiler log for this Seed and outputs the data as a buffer.
     *
     * @param showDrops Should additional data about prize packs and tree pulls
     * be included?
     * @returns The formatted spoiler log as a buffer.
     */
    formatSpoilerLog(showDrops: boolean = false): Buffer {
        const dungeonTranslations = {
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
        }

        const spoiler: structs.SpoilerAPIData = JSON.parse(JSON.stringify(this.#spoiler));

        // if "off" or "mystery", nothing special happens. Just return the
        // spoiler as-is.
        if (spoiler.meta.spoilers === "off" ||
            spoiler.meta.spoilers === "mystery") {
            return Buffer.from(JSON.stringify(spoiler, undefined, 4), "utf8");
        }

        const log: { [x: string]: any } = {};

        if ("shuffle" in spoiler.meta) { // Thanks ER...
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
            log.Special = spoiler.Special;
            log.Bosses = spoiler.Bosses;
            log["Light World"] = spoiler["Light World"];
            log["Dark World"] = spoiler["Dark World"];
            log.Caves = spoiler.Caves;
            log["Hyrule Castle"] = spoiler["Hyrule Castle"];
            log["Eastern Palace"] = spoiler["Eastern Palace"];
            log["Desert Palace"] = spoiler["Desert Palace"];
            log["Tower of Hera"] = spoiler["Tower of Hera"];
            log["Agahnims Tower"] = spoiler["Agahnims Tower"];
            log["Palace of Darkness"] = spoiler["Palace of Darkness"];
            log["Swamp Palace"] = spoiler["Swamp Palace"];
            log["Skull Woods"] = spoiler["Skull Woods"];
            log["Thieves Town"] = spoiler["Thieves Town"];
            log["Ice Palace"] = spoiler["Ice Palace"];
            log["Misery Mire"] = spoiler["Misery Mire"];
            log["Turtle Rock"] = spoiler["Turtle Rock"];
            log["Ganons Tower"] = spoiler["Ganons Tower"];
            log.Entrances = spoiler.Entrances;

            for (const key in log.Prizes) {
                const values: Array<string> = Object.values(spoiler[key as keyof structs.SpoilerAPIData]) as Array<string>;
                log.Prizes[key] = values.find(v => v.startsWith("Crystal") || v.endsWith("Pendant"));
            }
        } else {
            log.Prizes = {};
            log.Special = {};
            log.Bosses = {};
            log["Light World"] = {};
            log["Death Mountain"] = {};
            log["Dark World"] = {};
            log["Hyrule Castle"] = {};
            log["Eastern Palace"] = {};
            log["Desert Palace"] = {};
            log["Tower of Hera"] = {};
            log["Castle Tower"] = {};
            log["Dark Palace"] = {};
            log["Swamp Palace"] = {};
            log["Skull Woods"] = {};
            log["Thieves Town"] = {};
            log["Ice Palace"] = {};
            log["Misery Mire"] = {};
            log["Turtle Rock"] = {};
            log["Ganons Tower"] = {};
        }

        log.Special.DigGameDigs = this.#patchMap.get(982421)[0];

        if (showDrops === true) {
            log.Drops = readDrops(this.#patchMap);
        }

        return Buffer.from(JSON.stringify(log, undefined, 4), "utf8");

        // Thanks clearmouse
        function readDrops(data: Map<number, Array<number>>): DropsSpoilerData {
            const offsets = {
                Stun: 227731,
                TreePull: 981972,
                CrabMain: 207304,
                CrabLast: 207300,
                Fish: 950988,
                PrizePacks: 227960,
            };
            const vanillaPacks: { [x in types.EnemyPacks]: Array<number> } = {
                Heart: [216, 216, 216, 216, 217, 216, 216, 217],
                Rupee: [218, 217, 218, 219, 218, 217, 218, 218],
                Magic: [224, 223, 223, 218, 224, 223, 216, 223],
                Bomb: [220, 220, 220, 221, 220, 220, 222, 220],
                Arrow: [225, 216, 225, 226, 225, 216, 225, 226],
                SmallVariety: [223, 217, 216, 225, 223, 220, 217, 216],
                BigVariety: [216, 227, 224, 219, 222, 216, 219, 226],
            };

            const drops: DropsSpoilerData = {
                Tree: {},
                Stun: undefined,
                Fish: undefined,
                Crab: {},
                Packs: {},
            };

            // Tree Pulls
            data.get(offsets.TreePull).forEach((byte: number, index: number) => {
                drops.Tree[(index + 1) as keyof PullTiers] = getDropSprite(byte);
            });

            // Stun
            drops.Stun = getDropSprite(data.get(offsets.Stun)[0]);

            // Fish
            drops.Fish = getDropSprite(data.get(offsets.Fish)[0]);

            // Crab
            drops.Crab.Main = getDropSprite(data.get(offsets.CrabMain)[0]);
            drops.Crab.Last = getDropSprite(data.get(offsets.CrabLast)[0]);

            // Enemy Packs
            const packs: Array<Array<number>> = [[], [], [], [], [], [], []];
            let pIndex: number = 0;

            data.get(offsets.PrizePacks).forEach((byte: number, index: number) => {
                packs[pIndex].push(byte);
                if (index % 8 === 0 && index !== 0) ++pIndex;
            });

            packs.forEach((pack: Array<number>, i: number) => {
                const key: string = Object.keys(vanillaPacks)[i];
                drops.Packs[key as types.EnemyPacks] = getPrizePackName(pack);
            });

            return drops;

            function getDropSprite(byte: number): types.Droppable {
                switch (byte) {
                    case 121: return "Bee";
                    case 178: return "BeeGood";
                    case 216: return "Heart";
                    case 217: return "RupeeGreen";
                    case 218: return "RupeeBlue";
                    case 219: return "RupeeRed";
                    case 220: return "BombRefill1";
                    case 221: return "BombRefill4";
                    case 222: return "BombRefill8";
                    case 223: return "MagicRefillSmall";
                    case 224: return "MagicRefillFull";
                    case 225: return "ArrowRefill5";
                    case 226: return "ArrowRefill10";
                    case 227: return "Fairy";
                    default: throw new Error(`No matching droppable found for ${byte}`);
                }
            }

            function getPrizePackName(pack: Array<number>): types.EnemyPacks | string {
                // If the array contains one of these two bytes, we can safely assume
                // that the pack is not vanilla.
                if (pack.some(b => b === 121 || b === 178)) {
                    return pack.map(b => getDropSprite(b)).toString();
                }

                for (const [key, values] of Object.entries(vanillaPacks)) {
                    if (pack === values) {
                        return key;
                    }
                }

                return pack.map(b => getDropSprite(b)).toString();
            }
        }
    }

    /**
     * Patches a base ALTTP ROM with this Seed's JSON data and bps patch and
     * returns the result as a buffer.
     *
     * @param base The path to the base ROM.
     * @param options The post-generation options.
     * @returns The patched ROM as a buffer.
     */
    async patchRom(base: string, options: PostGenOptions = {
        heartSpeed: "normal",
        heartColor: "red",
        menuSpeed: "normal",
        quickswap: true,
        backgroundMusic: true,
        msu1Resume: true,
        sprite: "Link",
        reduceFlash: false
    }): Promise<Buffer> {
        // Set defaults
        if (!options.sprite) {
            options.sprite = await (await ALTTPR.fetchSprite("Link")).fetch();
        } else if (typeof options.sprite === "string") {
            options.sprite = await (await ALTTPR.fetchSprite(options.sprite)).fetch();
        } else if (options.sprite instanceof Sprite) {
            options.sprite = await options.sprite.fetch();
        } else if (!(options.sprite instanceof Buffer)) {
            throw new TypeError("Invalid argument for sprite.");
        }

        const romBuffer: Buffer = await fs.readFile(base);

        // Base patch is applied first.
        const basePatch: Buffer = await this.fetchBasePatch();
        const bpsPatch: BpsPatch = new BpsPatch(basePatch);
        const patched: Buffer = bpsPatch.applyTo(romBuffer);

        // Then the seed-specific stuff is applied.
        const patcher: Patcher = new Patcher(patched);
        patcher.seedPatches = this.#patchMap;
        patcher.backgroundMusic = options.backgroundMusic ?? true;
        patcher.heartColor = options.heartColor ?? "red";
        patcher.heartSpeed = options.heartSpeed ?? "normal";
        patcher.menuSpeed = options.menuSpeed ?? "normal";
        patcher.msu1Resume = options.msu1Resume ?? true;
        patcher.quickswap = options.quickswap ?? true;
        patcher.reduceFlashing = options.reduceFlash ?? true;
        patcher.sprite = options.sprite;

        // Finally, correct the buffer's checksum.
        patcher.fixChecksum();

        return patcher.buffer;
    }

    async fetchBasePatch(): Promise<Buffer> {
        if (typeof this.#current_rom_hash === "undefined") {
            await this.#setRomHash();
        }

        const response: ArrayBuffer = await new Request(`/bps/${this.#current_rom_hash}.bps`).get("buffer");
        return Buffer.from(response);
    }

    async #setRomHash(): Promise<void> {
        const response: structs.PatchAPIData = await new Request(`/api/h/${this.#hash}`).get("json");
        ({ md5: this.#current_rom_hash } = response);
    }

    get [Symbol.toStringTag](): string {
        return `Seed-${this.#hash}`;
    }
}

type SeedData = structs.SeedAPIData | structs.GenerateSeedAPIData;
type PostGenOptions = {
    heartSpeed?: types.HeartSpeed
    heartColor?: types.HeartColor
    menuSpeed?: types.MenuSpeed
    quickswap?: boolean
    backgroundMusic?: boolean
    msu1Resume?: boolean
    sprite?: string | Sprite | Buffer
    reduceFlash?: boolean
};
type DropsSpoilerData = {
    Tree?: PullTiers
    Crab?: {
        Main?: types.Droppable
        Last?: types.Droppable
    }
    Stun?: types.Droppable
    Fish?: types.Droppable
    Packs?: {
        [x in types.EnemyPacks]?: types.EnemyPacks | string
    }
};
type PullTiers = {
    1?: types.Droppable
    2?: types.Droppable
    3?: types.Droppable
};
interface SpoilerWithDrops extends structs.SpoilerAPIData {
    Drops: DropsSpoilerData
};
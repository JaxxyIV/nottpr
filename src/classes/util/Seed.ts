import * as fs from "node:fs/promises";
import { BpsPatch } from "rommage/BpsPatch";
import * as structs from "../../types/apiStructs";
import * as types from "../../types/types";
import Patcher from "./Patcher";
import Request from "./Request";
import Sprite from "./Sprite";

export default class Seed {
    #logic: string;
    #spoiler: structs.SpoilerAPIData;
    #hash: string;
    #generated: string;
    #size: number;
    #current_rom_hash?: string;
    #patchMap = new Map<number, number[]>();
    #basePatch?: Buffer;

    readonly #sprites: Map<string, Sprite>;

    static readonly #hashStrings = [
        "Bow", "Boomerang", "Hookshot", "Bomb", "Mushroom",
        "Powder", "Ice Rod", "Pendant", "Bombos", "Ether",
        "Quake", "Lantern", "Hammer", "Shovel", "Ocarina",
        "Bug Net", "Book", "Bottle", "Green Potion", "Somaria",
        "Cape", "Mirror", "Boots", "Glove", "Flippers",
        "Moon Pearl", "Shield", "Mail", "Heart", "Map",
        "Compass", "Big Key",
    ];

    constructor(json: SeedData, sprites: Map<string, Sprite>) {
        this.#sprites = sprites;

        ({
            logic: this.#logic,
            spoiler: this.#spoiler,
            hash: this.#hash,
            generated: this.#generated,
            size: this.#size,
        } = json);

        // By converting the patch data in the JSON to a Map, operations like
        // obtaining the file select hash will be much easier.
        for (const patch of json.patch) {
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
    get patchAsMap(): Map<number, number[]> {
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

    get currentRomHash(): string {
        return this.#current_rom_hash;
    }

    /**
     * Returns the start screen hash of this Seed as a string array.
     */
    get hashCode(): string[] {
        const search = (a: number[], l: number, r: number, t: number): number => {
            if (l >= r) return l;
            const m = Math.floor((l + r) / 2);
            return a[m] === t ? m
                : a[m] > t ? search(a, l, m - 1, t)
                    : search(a, m + 1, r, t);
        };
        let target = 1573397;
        let hash = this.#patchMap.get(target);

        if (!hash) { // Entrance rando
            const offsets: number[] = [];
            for (const [offset] of this.#patchMap)
                offsets.push(offset);
            offsets.sort();
            let offInd = 0;
            //const index = search(offsets, 0, offsets.length, target);
            while (offsets[offInd] < target) ++offInd;
            target = offsets[offInd - 1];
            [, , ...hash] = this.#patchMap.get(target);
        }

        return hash.map(b => Seed.#hashStrings[b]);
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
     * Formats the spoiler log for this Seed and outputs the data as a buffer.
     *
     * @param showDrops Should additional data about prize packs and tree pulls
     * be included?
     * @returns The formatted spoiler log as a buffer.
     */
    writeSpoiler(showDrops = false): Buffer {
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
        }

        const spoiler: structs.SpoilerAPIData = JSON.parse(JSON.stringify(this.#spoiler));

        // if "off" or "mystery", nothing special happens. Just return the
        // spoiler as-is.
        if (spoiler.meta.spoilers === "off" || spoiler.meta.spoilers === "mystery") {
            return Buffer.from(JSON.stringify(spoiler, undefined, 4), "utf8");
        }

        const log: { [x: string]: any } = {};

        if ("shuffle" in spoiler.meta) {
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
                const values = Object.values(spoiler[key as keyof structs.SpoilerAPIData]) as string[];
                log.Prizes[key] = values.find(v => v.startsWith("Crystal") || v.endsWith("Pendant"));
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
                if (!(key in spoiler)) continue;

                const entries: [string, string][] = Object.entries(spoiler[key as keyof typeof spoiler]);
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
                let actualKey: string;
                // Have to deal with inconsistencies in how things are referred to in the log.
                switch (key) {
                    case "Dark Palace":
                        actualKey = "Palace of Darkness";
                        break;
                    case "Thieves Town":
                        actualKey = "Thieves' Town";
                        break;
                    case "Tower Of Hera":
                        actualKey = "Tower of Hera";
                        break;
                    default:
                        actualKey = key;
                        break;
                }

                log.Prizes[key] = log[key][`${actualKey} - Prize`];
            }
        }

        [log.Special["Dig Game"]] = this.#patchMap.get(982421);

        if (showDrops) {
            log.Special.Drops = this.#readDrops();
        }

        log.meta = spoiler.meta;
        log.meta.hash = this.#hash;
        log.meta.permalink = this.permalink;

        return Buffer.from(JSON.stringify(log, undefined, 4));
    }

    /**
     * Patches a base ALTTP ROM with this Seed's JSON data and bps patch and
     * returns the result as a buffer.
     *
     * **Notes:**
     * * The value for `options.sprite` can be passed as a string, Sprite object,
     * or buffer
     *
     * @param base The path to the base ROM.
     * @param options The post-generation options.
     * @returns The patched ROM as a buffer.
     */
    async patchROM(base: string, options: PostGenOptions = {
        heartSpeed: "normal",
        heartColor: "red",
        menuSpeed: "normal",
        quickswap: true,
        backgroundMusic: true,
        msu1Resume: true,
        sprite: "Link",
        reduceFlash: false
    }): Promise<Buffer> {
        // Correct the value provided for sprite (if necessary)
        if (!options.sprite) {
            options.sprite = await this.#sprites.get("Link").fetch();
        } else if (typeof options.sprite === "string") {
            if (!this.#sprites.has(options.sprite)) {
                throw new ReferenceError("Sprite does not exist in local cache.");
            }
            options.sprite = await this.#sprites.get(options.sprite).fetch();
        } else if (options.sprite instanceof Sprite) {
            options.sprite = await options.sprite.fetch();
        } else if (!(options.sprite instanceof Buffer)) {
            throw new TypeError("Invalid argument for sprite.");
        }

        const romBuffer = await fs.readFile(base);

        // Base patch is applied first.
        const basePatch = this.#basePatch ?? await this.fetchBasePatch();
        const bpsPatch = new BpsPatch(basePatch);
        const patched = bpsPatch.applyTo(romBuffer);

        // Then the seed-specific stuff is applied.
        return new Patcher(patched)
            .setSeedPatches(this.#patchMap)
            .setBackgroundMusic(options.backgroundMusic ?? true)
            .setHeartColor(options.heartColor ?? "red")
            .setHeartSpeed(options.heartSpeed ?? "normal")
            .setMenuSpeed(options.menuSpeed ?? "normal")
            .setMsu1Resume(options.msu1Resume ?? true)
            .setQuickswap(options.quickswap ?? true)
            .setReduceFlashing(options.reduceFlash ?? false)
            .setSprite(options.sprite)
            .fixChecksum() // Checksum fix must be done last
            .buffer;
    }

    async fetchBasePatch(): Promise<Buffer> {
        if (!this.#basePatch) {
            if (typeof this.#current_rom_hash === "undefined") {
                await this.#setRomHash();
            }

            const response: ArrayBuffer =
                await new Request(`/bps/${this.#current_rom_hash}.bps`)
                .get("buffer");
            const buffer = Buffer.from(response);
            this.#basePatch = buffer;
        }
        return this.#basePatch;
    }

    // Thanks clearmouse
    #readDrops(): DropsSpoilerData {
        const offsets = {
            stun: 227731,
            treePull: 981972,
            crabMain: 207304,
            crabLast: 207300,
            fish: 950988,
            prizePacks: 227960,
        };
        const vanillaPacks: Record<types.EnemyPacks, number[]> = {
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
        const treePulls = this.#patchMap.get(offsets.treePull);
        for (let i = 1; i <= treePulls.length; ++i) {
            const byte = treePulls[i - 1];
            drops.Tree[i as keyof PullTiers] = getDropSprite(byte);
        }

        // Stun
        drops.Stun = getDropSprite(this.#patchMap.get(offsets.stun)[0]);

        // Fish
        drops.Fish = getDropSprite(this.#patchMap.get(offsets.fish)[0]);

        // Crab
        drops.Crab.Main = getDropSprite(this.#patchMap.get(offsets.crabMain)[0]);
        drops.Crab.Last = getDropSprite(this.#patchMap.get(offsets.crabLast)[0]);

        // Enemy Packs
        const packs: number[][] = [[], [], [], [], [], [], []];
        const rowLimit = 8;

        const prizePackDrops = this.#patchMap.get(offsets.prizePacks);
        for (let i = 0; i < prizePackDrops.length; ++i) {
            packs[Math.floor(i / rowLimit)].push(prizePackDrops[i]);
        }

        for (let i = 0; i < packs.length; ++i) {
            const key = Object.keys(vanillaPacks)[i] as types.EnemyPacks;
            drops.Packs[key] = getPrizePackName(packs[i]);
        }

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

        function getPrizePackName(pack: number[]): types.EnemyPacks | string {
            // If the array contains one of these two bytes, we can safely assume
            // that the pack is not vanilla.
            if (pack.some(b => b === 121 || b === 178)) {
                return pack.map(b => getDropSprite(b)).join(", ");
            }

            for (const [key, values] of Object.entries(vanillaPacks)) {
                if (pack.toString() === values.toString()) {
                    return key;
                }
            }

            return pack.map(b => getDropSprite(b)).join(", ");
        }
    }

    async #setRomHash(): Promise<void> {
        const response: structs.PatchAPIData = await new Request(`/api/h/${this.#hash}`).get("json");
        ({ md5: this.#current_rom_hash } = response);
    }

    #seekInPatch(offset: number, byteCount: number): number[] {
        if (this.#patchMap.has(offset)) {
            return this.#patchMap.get(offset).slice(0, byteCount);
        }
        const offsets: number[] = [];
        for (const [key] of this.#patchMap)
            offsets.push(key);
        offsets.sort();

        let closest: number;
        if (offset < offsets[0]) {
            closest = offsets[0];
        } else if (offset > offsets[offsets.length - 1]) {
            closest = offsets[offsets.length - 1];
        } else {
            let left = 0;
            let right = offsets.length - 1;
            while (left <= right) {
                const cen = Math.floor((left + right) / 2);
                if (offsets[cen] > offset)
                    right = cen - 1;
                else
                    left = cen + 1;
            }
            closest = offsets[left] - offset < offset - offsets[right]
                ? offsets[left] : offsets[right];
        }
        return this.#patchMap.get(closest).slice(0, byteCount);
    }
}

type SeedData = structs.SeedAPIData | structs.GenerateSeedAPIData;
type PostGenOptions = Partial<{
    heartSpeed: types.HeartSpeed
    heartColor: types.HeartColor
    menuSpeed: types.MenuSpeed
    quickswap: boolean
    backgroundMusic: boolean
    msu1Resume: boolean
    sprite: string | Sprite | Buffer
    reduceFlash: boolean
}>;
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
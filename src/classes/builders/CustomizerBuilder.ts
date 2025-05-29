import {
    AllowedGlitches,
    CustomizerJSON,
    CustomizerJSONEquipment,
} from "../../types/apiStructs";
import {
    CustomizerSettings,
    Item,
    RupeeAmount,
    StartingEquipment,
    LocationMap,
    TextMap
} from "../../types/types";
import { BaseSeedOptions, CustomizerSeedOptions } from "../../types/optionObjs";
import BaseSeedBuilder from "./BaseSeedBuilder";
import CustomSettingsBuilder from "./CustomSettingsBuilder";
import * as flat from "flat";
const { unflatten } = flat;

export default class CustomizerBuilder extends BaseSeedBuilder<CustomizerSettings> {
    static #websiteJSONMap: [keyof CustomizerJSON, string][] = [
        ["randomizer.accessibility", "accessibility"],
        ["randomizer.boss_shuffle", "enemizer.boss_shuffle"],
        ["randomizer.dungeon_items", "dungeon_items"],
        ["randomizer.enemy_damage", "enemizer.enemy_damage"],
        ["randomizer.enemy_health", "enemizer.enemy_health"],
        ["randomizer.enemy_shuffle", "enemizer.enemy_shuffle"],
        ["randomizer.ganon_open", "crystals.ganon"],
        ["randomizer.glitches_required", "glitches"],
        ["randomizer.goal", "goal"],
        ["randomizer.hints", "hints"],
        ["randomizer.item_functionality", "item.item_functionality"],
        ["randomizer.item_placement", "item_placement"],
        ["randomizer.item_pool", "item.item_pool"],
        ["randomizer.tower_open", "crystals.tower"],
        ["randomizer.weapons", "weapons"],
        ["randomizer.world_state", "mode"],
        ["vt.custom.drops", "custom.drops.count"],
        ["vt.custom.items", "custom.item.count"],
        ["vt.custom.locations", "l"],
        ["vt.custom.name", "name"],
        ["vt.custom.notes", "notes"],
        ["vt.custom.prizepacks", "drops"],
        ["vt.custom.settings", "custom"],
    ];

    constructor(data?: CustomizerSeedOptions) {
        function isCustomizer(obj: object): obj is CustomizerSeedOptions {
            return "custom" in obj || "drops" in obj || "eq" in obj ||
                "l" in obj || "texts" in obj;
        }

        super();
        // if (typeof data === "undefined") {
        //     //super();
        //     return;
        // }

        // const hold: { [x: string]: unknown } = {};
        // const copy: CustomizerSeedOptions | BaseSeedOptions = JSON.parse(JSON.stringify(data ?? BaseSeedBuilder._default()));

        // if (isCustomizer(copy)) {
        //     const unparsed: (keyof CustomizerSeedOptions)[] = ["custom", "drops", "eq", "l", "texts"];
        //     for (const key of unparsed) {
        //         if (typeof copy[key] !== "undefined") {
        //             hold[key] = copy[key];
        //             delete copy[key];
        //         }
        //     }
        // }

        // super(copy as BaseSeedOptions);

        // if (typeof data !== "object" || data === null) {
        //     super();
        // } else {
        //     const unparsed: (keyof CustomizerSeedOptions)[] = ["custom", "drops", "eq", "l", "texts"];
        //     const hold: { [x: string]: unknown } = {};
        //     const copy: CustomizerSeedOptions = JSON.parse(JSON.stringify(data));
        //     for (const key of unparsed) {
        //         if (typeof copy[key] !== "undefined") {
        //             hold[key] = copy[key];
        //             delete copy[key];
        //         }
        //     }
        //     super(copy);
        // }
    }

    /**
     * Accepts a JSON object of VT customizer settings and converts the data to
     * a CustomizerBuilder.
     *
     * **Note:** The data must already be converted to an object. Strings, buffers,
     * or streams will not be parsed.
     *
     * @param data The customizer settings as a JSON object.
     * @returns The settings converted to a builder.
     */
    static fromCustomizerJSON(data: CustomizerJSON): CustomizerBuilder {
        const nest = (obj: any, keys: string[], value: unknown): void => {
            let temp = obj;
            for (let i = 0; i < keys.length; ++i) {
                if (i === keys.length - 1) temp[keys[i]] = value;
                else if (!(keys[i] in temp)) temp[keys[i]] = {};
                temp = temp[keys[i]];
            }
        };
        const copy: CustomizerJSON = JSON.parse(JSON.stringify(data));
        const converted: CustomizerSeedOptions = {};

        for (const [jsonKey, payloadKey] of this.#websiteJSONMap) {
            if (copy[jsonKey] !== null) {
                const props = payloadKey.split(".");
                if (props.length > 1) {
                    nest(converted, props, copy[jsonKey]);
                } else {
                    converted[payloadKey as keyof CustomizerSeedOptions] = copy[jsonKey] as never;
                }
            }
        }

        for (const [k, v] of Object.entries(copy["vt.custom.glitches"])) {
            converted.custom[k as keyof AllowedGlitches] = v;
        }

        const eq: StartingEquipment[] = [];
        for (const [k, v] of Object.entries(copy["vt.custom.equipment"])) {
            if (k === "empty") {
                continue;
            } else if (typeof v === "boolean" && v) {
                eq.push(k as StartingEquipment);
            } else if (typeof v === "number") {
                if (v <= 0) continue;

                const eqK = k as keyof CustomizerJSONEquipment;
                const isClonable = (s: string) => s.startsWith("Progressive") || s === "BossHeartContainer";

                if (eqK === "ProgressiveBow") {
                    if (v === 1) eq.push("SilverArrowUpgrade");
                    else for (let i = 0; i < v - 1; ++i)
                        eq.push(k as StartingEquipment);
                } else if (isClonable(eqK)) {
                    for (let i = 0; i < v; ++i)
                        eq.push(k as StartingEquipment);
                } else if (eqK === "Ocarina") {
                    eq.push(v === 1 ? "OcarinaInactive" : "OcarinaActive");
                } else if (eqK === "Boomerang") {
                    if (v !== 2) eq.push("Boomerang"); // 1 or 3
                    if (v !== 1) eq.push("RedBoomerang"); // 2 or 3
                } else if (eqK.startsWith("Bottle")) {
                    const bottleMap: Record<number, StartingEquipment> = {
                        1: "Bottle",
                        2: "BottleWithRedPotion",
                        3: "BottleWithGreenPotion",
                        4: "BottleWithBluePotion",
                        5: "BottleWithBee",
                        6: "BottleWithGoldBee",
                        7: "BottleWithFairy",
                    };
                    if (v in bottleMap) eq.push(bottleMap[v]);
                }
            } else if (typeof v === "string") { // k is "Rupees"
                const rupeeMap: Record<number, RupeeAmount> = {
                    300: "ThreeHundredRupees",
                    100: "OneHundredRupees",
                    50: "FiftyRupees",
                    20: "TwentyRupees",
                    5: "FiveRupees",
                    1: "OneRupee",
                };

                let rupees = parseInt(v);
                for (const key of Object.keys(rupeeMap)) {
                    const parsed = parseInt(key);
                    const toAdd = Math.floor(rupees / parsed);

                    for (let i = 0; i < toAdd; ++i)
                        eq.push(rupeeMap[parsed]);

                    rupees %= parsed;
                }
            }
        }

        converted.eq = eq;
        return new this(converted);
    }

    get eq(): Item[] {
        return Array.from<Item>(super._getProp("eq"));
    }

    get locations(): LocationMap {
        return super._getProp("l")
    }

    get texts(): TextMap {
        return super._getProp("texts");
    }

    get custom(): CustomSettingsBuilder {
        return super._getProp("custom");
    }

    get drops(): object {
        return super._getProp("drops");
    }

    setEq(eq: Item[]): this {
        if (!Array.isArray(eq)) {
            throw new TypeError("eq must be an array.");
        }
        return super._setProp("eq", eq);
    }

    addEq(eq: Item[]): this {
        if (!Array.isArray(eq)) {
            throw new TypeError("eq must be an array.");
        }
        (super._getProp("eq") as Item[]).push(...eq);
        return this;
    }

    setLocations(l: LocationMap): this {
        return super._setProp("l", l);
    }

    setTexts(texts: TextMap): this {
        return super._setProp("texts", texts);
    }

    setCustom(custom: CustomSettingsBuilder): this;
    setCustom(custom: ((builder: CustomSettingsBuilder) => CustomSettingsBuilder)): this;
    setCustom(custom: CustomSettingsBuilder | ((builder: CustomSettingsBuilder) => CustomSettingsBuilder)): this {
        let obj: { [x: string]: any };
        if (typeof custom === "function") {
            obj = custom(new CustomSettingsBuilder()).toJSON();
        } else if (custom instanceof CustomSettingsBuilder) {
            obj = custom.toJSON();
        }

        return super._setProp("custom", obj);
    }

    setDrops(drops: any): this {
        return super._setProp("drops", drops);
    }

    static #fill(passed: any, def: any): any {
        for (const key in def) {
            if (!(key in passed)) {
                passed[key] = def[key];
            } else if (typeof passed[key] === "object" && !Array.isArray(passed[key])) {
                passed[key] = this.#fill(passed[key], def[key]);
            }
        }
        return passed;
    }
}

const _def = {
    l: {},
    eq: ["BossHeartContainer", "BossHeartContainer", "BossHeartContainer"],
    drops: {
        0: ["auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill"],
        1: ["auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill"],
        2: ["auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill"],
        3: ["auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill"],
        4: ["auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill"],
        5: ["auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill"],
        6: ["auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill", "auto_fill"],
        pull: ["auto_fill", "auto_fill", "auto_fill"],
        crab: ["auto_fill", "auto_fill"],
        stun: ["auto_fill"],
        fish: ["auto_fill"],
    },
    custom: {
        "item.Goal.Required": "",
        "item.require.Lamp": false,
        "item.value.BlueClock": "",
        "item.value.GreenClock": "",
        "item.value.RedClock": "",
        "item.value.Rupoor": "",
        "prize.crossWorld": true,
        "prize.shuffleCrystals": true,
        "prize.shufflePendants": true,
        "region.bossNormalLocation": true,
        "region.wildBigKeys": false,
        "region.wildCompasses": false,
        "region.wildKeys": false,
        "region.wildMaps": false,
        "rom.dungeonCount": "off",
        "rom.freeItemMenu": false,
        "rom.freeItemText": false,
        "rom.mapOnPickup": false,
        "rom.timerMode": "off",
        "rom.timerStart": "",
        "rom.rupeeBow": false,
        "rom.genericKeys": false,
        "rom.logicMode": "NoGlitches",
        "spoil.BootsLocation": false,
        canBootsClip: false,
        canBunnyRevive: false,
        canBunnySurf: false,
        canDungeonRevive: false,
        canFakeFlipper: false,
        canMirrorClip: false,
        canMirrorWrap: false,
        canTransitionWrapped: false,
        canOneFrameClipOW: false,
        canOneFrameClipUW: false,
        canOWYBA: false,
        canSuperBunny: false,
        canSuperSpeed: false,
        canWaterWalk: false,
        item: {
            count: {
                BottleWithRandom: 4,
                Nothing: 0,
                L1Sword: 0,
                L1SwordAndShield: 0,
                MasterSword: 0,
                L3Sword: 0,
                L4Sword: 0,
                BlueShield: 0,
                RedShield: 0,
                MirrorShield: 0,
                FireRod: 1,
                IceRod: 1,
                Hammer: 1,
                Hookshot: 1,
                Bow: 0,
                Boomerang: 1,
                Powder: 1,
                Bombos: 1,
                Ether: 1,
                Quake: 1,
                Lamp: 1,
                Shovel: 1,
                OcarinaInactive: 1,
                CaneOfSomaria: 1,
                Bottle: 0,
                PieceOfHeart: 24,
                CaneOfByrna: 1,
                Cape: 1,
                MagicMirror: 1,
                PowerGlove: 0,
                TitansMitt: 0,
                BookOfMudora: 1,
                Flippers: 1,
                MoonPearl: 1,
                BugCatchingNet: 1,
                BlueMail: 0,
                RedMail: 0,
                Bomb: 0,
                ThreeBombs: 16,
                Mushroom: 1,
                RedBoomerang: 1,
                BottleWithRedPotion: 0,
                BottleWithGreenPotion: 0,
                BottleWithBluePotion: 0,
                TenBombs: 1,
                OneRupee: 2,
                FiveRupees: 4,
                TwentyRupees: 28,
                BowAndArrows: 0,
                BowAndSilverArrows: 0,
                BottleWithBee: 0,
                BottleWithFairy: 0,
                BossHeartContainer: 10,
                HeartContainer: 1,
                OneHundredRupees: 1,
                FiftyRupees: 7,
                Heart: 0,
                Arrow: 1,
                TenArrows: 12,
                SmallMagic: 0,
                ThreeHundredRupees: 5,
                BottleWithGoldBee: 0,
                OcarinaActive: 0,
                PegasusBoots: 1,
                BombUpgrade5: 0,
                BombUpgrade10: 0,
                ArrowUpgrade5: 0,
                ArrowUpgrade10: 0,
                HalfMagic: 1,
                QuarterMagic: 0,
                SilverArrowUpgrade: 0,
                Rupoor: 0,
                RedClock: 0,
                BlueClock: 0,
                GreenClock: 0,
                ProgressiveSword: 4,
                ProgressiveShield: 3,
                ProgressiveArmor: 2,
                ProgressiveGlove: 2,
                ProgressiveBow: 2,
                Triforce: 0,
                TriforcePiece: 0,
                MapA2: 1,
                MapD7: 1,
                MapD4: 1,
                MapP3: 1,
                MapD5: 1,
                MapD3: 1,
                MapD6: 1,
                MapD1: 1,
                MapD2: 1,
                MapA1: 0,
                MapP2: 1,
                MapP1: 1,
                MapH2: 1,
                CompassA2: 1,
                CompassD7: 1,
                CompassD4: 1,
                CompassP3: 1,
                CompassD5: 1,
                CompassD3: 1,
                CompassD6: 1,
                CompassD1: 1,
                CompassD2: 1,
                CompassA1: 0,
                CompassP2: 1,
                CompassP1: 1,
                CompassH2: 0,
                BigKeyA2: 1,
                BigKeyD7: 1,
                BigKeyD4: 1,
                BigKeyP3: 1,
                BigKeyD5: 1,
                BigKeyD3: 1,
                BigKeyD6: 1,
                BigKeyD1: 1,
                BigKeyD2: 1,
                BigKeyA1: 0,
                BigKeyP2: 1,
                BigKeyP1: 1,
                BigKeyH2: 0,
                KeyH2: 1,
                KeyP1: 0,
                KeyP2: 1,
                KeyA1: 2,
                KeyD2: 1,
                KeyD1: 6,
                KeyD6: 3,
                KeyD3: 3,
                KeyD5: 2,
                KeyP3: 1,
                KeyD4: 1,
                KeyD7: 4,
                KeyA2: 4,
            },
        },
        drop: {
            count: {
                Bee: 0,
                BeeGood: 0,
                Heart: 13,
                RupeeGreen: 9,
                RupeeBlue: 7,
                RupeeRed: 6,
                BombRefill1: 7,
                BombRefill4: 1,
                BombRefill8: 2,
                MagicRefillSmall: 6,
                MagicRefillFull: 3,
                ArrowRefill5: 5,
                ArrowRefill10: 3,
                Fairy: 1,
            },
        },
    },
};
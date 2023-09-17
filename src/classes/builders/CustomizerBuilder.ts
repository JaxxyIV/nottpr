import { CustomizerSettings, Item } from "../../types/types";
import BaseSeedBuilder from "./BaseSeedBuilder";
import CustomSettingsBuilder from "./CustomSettingsBuilder";

export default class CustomizerBuilder extends BaseSeedBuilder<CustomizerSettings> {
    constructor() {
        super();
    }

    get eq(): Array<Item> {
        return Array.from<Item>(super._getProp("eq"));
    }

    get locations(): { [x: string]: Item | undefined } {
        return super._getProp("l")
    }

    get texts(): { [x: string]: string | undefined } {
        return super._getProp("texts");
    }

    get custom(): CustomSettingsBuilder {
        return super._getProp("custom");
    }

    get drops(): object {
        return super._getProp("drops");
    }

    setEq(eq: Array<Item>): this {
        if (!Array.isArray(eq)) {
            throw new TypeError("eq must be an array.");
        }
        return super._setProp("eq", eq);
    }

    addEq(eq: Array<Item>): this {
        if (!Array.isArray(eq)) {
            throw new TypeError("eq must be an array.");
        }
        (super._getProp("eq") as Array<Item>).push(...eq);
        return this;
    }

    setLocations(l: object): this {
        return super._setProp("l", l);
    }

    setTexts(texts: object): this {
        return super._setProp("texts", texts);
    }

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
}

// {
//   "glitches": "none",
//   "item_placement": "advanced",
//   "dungeon_items": "standard",
//   "accessibility": "items",
//   "goal": "ganon",
//   "crystals": {
//     "ganon": "7",
//     "tower": "7"
//   },
//   "mode": "open",
//   "hints": "on",
//   "weapons": "randomized",
//   "item": {
//     "pool": "normal",
//     "functionality": "normal"
//   },
//   "tournament": false,
//   "spoilers": "on",
//   "lang": "en",
//   "enemizer": {
//     "boss_shuffle": "none",
//     "enemy_shuffle": "none",
//     "enemy_damage": "default",
//     "enemy_health": "default"
//   },
//   "name": "",
//   "notes": "",
//   "l": {},
//   "eq": [
//     "BossHeartContainer",
//     "BossHeartContainer",
//     "BossHeartContainer"
//   ],
//   "drops": {
//     "0": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "1": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "2": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "3": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "4": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "5": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "6": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "pull": [
//       "auto_fill",
//       "auto_fill",
//       "auto_fill"
//     ],
//     "crab": [
//       "auto_fill",
//       "auto_fill"
//     ],
//     "stun": [
//       "auto_fill"
//     ],
//     "fish": [
//       "auto_fill"
//     ]
//   },
//   "custom": {
//     "item.Goal.Required": "",
//     "item.require.Lamp": false,
//     "item.value.BlueClock": "",
//     "item.value.GreenClock": "",
//     "item.value.RedClock": "",
//     "item.value.Rupoor": "",
//     "prize.crossWorld": true,
//     "prize.shuffleCrystals": true,
//     "prize.shufflePendants": true,
//     "region.bossNormalLocation": true,
//     "region.wildBigKeys": false,
//     "region.wildCompasses": false,
//     "region.wildKeys": false,
//     "region.wildMaps": false,
//     "rom.dungeonCount": "off",
//     "rom.freeItemMenu": false,
//     "rom.freeItemText": false,
//     "rom.mapOnPickup": false,
//     "rom.timerMode": "off",
//     "rom.timerStart": "",
//     "rom.rupeeBow": false,
//     "rom.genericKeys": false,
//     "rom.logicMode": "NoGlitches",
//     "spoil.BootsLocation": false,
//     "canBootsClip": false,
//     "canBunnyRevive": false,
//     "canBunnySurf": false,
//     "canDungeonRevive": false,
//     "canFakeFlipper": false,
//     "canMirrorClip": false,
//     "canMirrorWrap": false,
//     "canTransitionWrapped": false,
//     "canOneFrameClipOW": false,
//     "canOneFrameClipUW": false,
//     "canOWYBA": false,
//     "canSuperBunny": false,
//     "canSuperSpeed": false,
//     "canWaterWalk": false,
//     "item": {
//       "count": {
//         "BottleWithRandom": 4,
//         "Nothing": 0,
//         "L1Sword": 0,
//         "L1SwordAndShield": 0,
//         "MasterSword": 0,
//         "L3Sword": 0,
//         "L4Sword": 0,
//         "BlueShield": 0,
//         "RedShield": 0,
//         "MirrorShield": 0,
//         "FireRod": 1,
//         "IceRod": 1,
//         "Hammer": 1,
//         "Hookshot": 1,
//         "Bow": 0,
//         "Boomerang": 1,
//         "Powder": 1,
//         "Bombos": 1,
//         "Ether": 1,
//         "Quake": 1,
//         "Lamp": 1,
//         "Shovel": 1,
//         "OcarinaInactive": 1,
//         "CaneOfSomaria": 1,
//         "Bottle": 0,
//         "PieceOfHeart": 24,
//         "CaneOfByrna": 1,
//         "Cape": 1,
//         "MagicMirror": 1,
//         "PowerGlove": 0,
//         "TitansMitt": 0,
//         "BookOfMudora": 1,
//         "Flippers": 1,
//         "MoonPearl": 1,
//         "BugCatchingNet": 1,
//         "BlueMail": 0,
//         "RedMail": 0,
//         "Bomb": 0,
//         "ThreeBombs": 16,
//         "Mushroom": 1,
//         "RedBoomerang": 1,
//         "BottleWithRedPotion": 0,
//         "BottleWithGreenPotion": 0,
//         "BottleWithBluePotion": 0,
//         "TenBombs": 1,
//         "OneRupee": 2,
//         "FiveRupees": 4,
//         "TwentyRupees": 28,
//         "BowAndArrows": 0,
//         "BowAndSilverArrows": 0,
//         "BottleWithBee": 0,
//         "BottleWithFairy": 0,
//         "BossHeartContainer": 10,
//         "HeartContainer": 1,
//         "OneHundredRupees": 1,
//         "FiftyRupees": 7,
//         "Heart": 0,
//         "Arrow": 1,
//         "TenArrows": 12,
//         "SmallMagic": 0,
//         "ThreeHundredRupees": 5,
//         "BottleWithGoldBee": 0,
//         "OcarinaActive": 0,
//         "PegasusBoots": 1,
//         "BombUpgrade5": 0,
//         "BombUpgrade10": 0,
//         "ArrowUpgrade5": 0,
//         "ArrowUpgrade10": 0,
//         "HalfMagic": 1,
//         "QuarterMagic": 0,
//         "SilverArrowUpgrade": 0,
//         "Rupoor": 0,
//         "RedClock": 0,
//         "BlueClock": 0,
//         "GreenClock": 0,
//         "ProgressiveSword": 4,
//         "ProgressiveShield": 3,
//         "ProgressiveArmor": 2,
//         "ProgressiveGlove": 2,
//         "ProgressiveBow": 2,
//         "Triforce": 0,
//         "TriforcePiece": 0,
//         "MapA2": 1,
//         "MapD7": 1,
//         "MapD4": 1,
//         "MapP3": 1,
//         "MapD5": 1,
//         "MapD3": 1,
//         "MapD6": 1,
//         "MapD1": 1,
//         "MapD2": 1,
//         "MapA1": 0,
//         "MapP2": 1,
//         "MapP1": 1,
//         "MapH2": 1,
//         "CompassA2": 1,
//         "CompassD7": 1,
//         "CompassD4": 1,
//         "CompassP3": 1,
//         "CompassD5": 1,
//         "CompassD3": 1,
//         "CompassD6": 1,
//         "CompassD1": 1,
//         "CompassD2": 1,
//         "CompassA1": 0,
//         "CompassP2": 1,
//         "CompassP1": 1,
//         "CompassH2": 0,
//         "BigKeyA2": 1,
//         "BigKeyD7": 1,
//         "BigKeyD4": 1,
//         "BigKeyP3": 1,
//         "BigKeyD5": 1,
//         "BigKeyD3": 1,
//         "BigKeyD6": 1,
//         "BigKeyD1": 1,
//         "BigKeyD2": 1,
//         "BigKeyA1": 0,
//         "BigKeyP2": 1,
//         "BigKeyP1": 1,
//         "BigKeyH2": 0,
//         "KeyH2": 1,
//         "KeyP1": 0,
//         "KeyP2": 1,
//         "KeyA1": 2,
//         "KeyD2": 1,
//         "KeyD1": 6,
//         "KeyD6": 3,
//         "KeyD3": 3,
//         "KeyD5": 2,
//         "KeyP3": 1,
//         "KeyD4": 1,
//         "KeyD7": 4,
//         "KeyA2": 4
//       }
//     },
//     "drop": {
//       "count": {
//         "Bee": 0,
//         "BeeGood": 0,
//         "Heart": 13,
//         "RupeeGreen": 9,
//         "RupeeBlue": 7,
//         "RupeeRed": 6,
//         "BombRefill1": 7,
//         "BombRefill4": 1,
//         "BombRefill8": 2,
//         "MagicRefillSmall": 6,
//         "MagicRefillFull": 3,
//         "ArrowRefill5": 5,
//         "ArrowRefill10": 3,
//         "Fairy": 1
//       }
//     }
//   }
// }
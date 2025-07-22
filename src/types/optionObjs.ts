import * as strings from "./strings.js";
import * as structs from "./structures.js";
import * as enums from "./enums.js";

export interface BaseSeedOptions {
    accessibility?: enums.Accessibility
    allow_quickswap?: boolean
    crystals?: CrystalOptions
    dungeon_items?: enums.Keysanity
    enemizer?: EnemizerOptions
    glitches?: enums.Glitches
    goal?: enums.Goals
    hints?: enums.Toggle
    item?: Partial<structs.ItemPayloadData>
    item_placement?: enums.ItemPlacement
    lang?: enums.Language
    mode?: enums.WorldState
    name?: string
    notes?: string
    override_start_screen?: structs.StartHashOverride
    pseudoboots?: boolean
    spoilers?: enums.Spoilers
    tournament?: boolean
    weapons?: enums.Weapons
}

export type CrystalOptions = Partial<structs.CrystalPayloadData>;
export type EnemizerOptions = Partial<structs.EnemizerPayloadData>;
export interface ItemOptions {
    placement?: enums.ItemPlacement
    pool?: enums.ItemPool
    functionality?: enums.ItemFunctionality
}

export type CustomizerSeedOptions = BaseSeedOptions & {
    custom?: CustomizerCustomOptions
    drops?: {
        0?: [
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop
        ]
        1?: [
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop
        ]
        2?: [
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop
        ]
        3?: [
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop
        ]
        4?: [
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop
        ]
        5?: [
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop
        ]
        6?: [
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop,
            strings.CustomizerDrop, strings.CustomizerDrop
        ]
        pull?: [strings.CustomizerDrop, strings.CustomizerDrop, strings.CustomizerDrop]
        crab?: [strings.CustomizerDrop, strings.CustomizerDrop]
        stun?: [strings.CustomizerDrop]
        fish?: [strings.CustomizerDrop]
    }
    eq?: Array<strings.StartingEquipment>
    l?: {
        [x: string]: strings.SpoilerItemString<strings.Item> | undefined
    }
    texts?: {
        [x: string]: string | undefined
    }
};

export type CustomizerCustomOptions = Partial<structs.AllowedGlitches> & {
    customPrizePacks?: boolean
    drop?: {
        count?: {
            [x in keyof structs.CustomDropCounts]?: number
        }
    }
    item?: {
        count?: {
            [x in keyof structs.CustomItemCounts]?: number
        }
    }
    /* In an ideal world, the customizer would pass this and a bunch of other
     * values below as numbers. But for some reason, they are passed as strings.
     *
     * Also these should really be sent to the customizer as nested objects, not
     * these long strings like they're being defined here.
     */
    "item.Goal.Required"?: string
    "item.overflow.count.Armor"?: string
    "item.overflow.count.BossHeartContainer"?: string
    "item.overflow.count.Bow"?: string
    "item.overflow.count.PieceOfHeart"?: string
    "item.overflow.count.Shield"?: string
    "item.overflow.count.Sword"?: string
    // "item.overflow.replacement.Armor"?: types.Item
    // "item.overflow.replacement.BossHeartContainer"?: types.Item
    // "item.overflow.replacement.Bow"?: types.Item
    // "item.overflow.replacement.PieceOfHeart"?: types.Item
    // "item.overflow.replacement.Shield"?: types.Item
    // "item.overflow.replacement.Sword"?: types.Item
    "item.require.Lamp"?: boolean
    "item.value.BlueClock"?: string
    "item.value.GreenClock"?: string
    "item.value.RedClock"?: string
    "item.value.Rupoor"?: string
    "prize.crossWorld"?: boolean
    "prize.shuffleCrystals"?: boolean
    "prize.shufflePendants"?: boolean
    "region.bossNormalLocation"?: boolean
    "region.wildBigKeys"?: boolean
    "region.wildCompasses"?: boolean
    "region.wildKeys"?: boolean
    "region.wildMaps"?: boolean
    "rom.dungeonCount"?: enums.CompassMode
    "rom.freeItemText"?: boolean
    "rom.genericKeys"?: boolean
    "rom.logicMode"?: strings.RomMode
    "rom.mapOnPickup"?: boolean
    "rom.rupeeBow"?: boolean
    "rom.timerMode"?: enums.ClockMode
    "rom.timerStart"?: string
    "spoil.BootsLocation"?: boolean
};

export interface OverflowOptions {
    count: Partial<Record<strings.Restrictable, number>>
    replacement: Partial<Record<strings.Restrictable, enums.Item>>
}
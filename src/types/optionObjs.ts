import * as types from "./types";
import * as structs from "./apiStructs";

export type BaseSeedOptions = {
    accessibility?: types.ItemAccessibility
    allow_quickswap?: boolean
    crystals?: CrystalOptions
    dungeon_items?: types.DungeonItems
    enemizer?: EnemizerOptions
    glitches?: types.GlitchesRequired
    goal?: types.Goal
    hints?: types.OptionToggle
    item?: ItemOptions
    item_placement?: types.ItemPlacement
    lang?: types.Lang
    mode?: types.WorldState
    name?: string
    notes?: string
    override_start_screen?: structs.StartHashOverride
    pseudoboots?: boolean
    spoilers?: types.SpoilerSetting
    tournament?: boolean
    weapons?: types.Weapons
};

export type CrystalOptions = {
    ganon?: types.CrystalRequirement
    tower?: types.CrystalRequirement
};

export type EnemizerOptions = {
    boss_shuffle?: types.BossShuffle
    enemy_damage?: types.EnemyDamage
    enemy_health?: types.EnemyHealth
    enemy_shuffle?: types.EnemyShuffle
    pot_shuffle?: types.OptionToggle
};

export type ItemOptions = {
    functionality?: types.ItemFunctionality
    pool?: types.ItemPool
};

export type CustomizerSeedOptions = BaseSeedOptions & {
    custom?: CustomizerCustomOptions
    drops?: {
        0?: [
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop
        ]
        1?: [
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop
        ]
        2?: [
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop
        ]
        3?: [
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop
        ]
        4?: [
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop
        ]
        5?: [
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop
        ]
        6?: [
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
            types.CustomizerDrop, types.CustomizerDrop
        ]
        pull?: [types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop]
        crab?: [types.CustomizerDrop, types.CustomizerDrop]
        stun?: [types.CustomizerDrop]
        fish?: [types.CustomizerDrop]
    }
    eq?: Array<types.StartingEquipment>
    l?: {
        [x: string]: types.SpoilerItemString<types.Item> | undefined
    }
    texts?: {
        [x: string]: string | undefined
    }
};

export type CustomizerCustomOptions = {
    [x in keyof structs.AllowedGlitches]?: boolean
} & {
    customPrizePacks?: boolean
    drop?: {
        count?: {
            [x in keyof structs.CustomDropCounts]?: number
        }
    }
    item?: {
        count?: {
            [x in keyof structs.ExtendedItemCountOptions]?: number
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
    "rom.dungeonCount"?: types.CompassMode
    "rom.freeItemText"?: boolean
    "rom.genericKeys"?: boolean
    "rom.logicMode"?: types.RomMode
    "rom.mapOnPickup"?: boolean
    "rom.rupeeBow"?: boolean
    "rom.timerMode"?: types.ClockMode
    "rom.timerStart"?: string
    "spoil.BootsLocation"?: boolean
};
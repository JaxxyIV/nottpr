import * as strings from "./strings";
import * as structs from "./structures";

export type BaseSeedOptions = {
    accessibility?: strings.ItemAccessibility
    allow_quickswap?: boolean
    crystals?: CrystalOptions
    dungeon_items?: strings.DungeonItems
    enemizer?: EnemizerOptions
    glitches?: strings.GlitchesRequired
    goal?: strings.Goal
    hints?: strings.OptionToggle
    item?: ItemOptions
    item_placement?: strings.ItemPlacement
    lang?: strings.Lang
    mode?: strings.WorldState
    name?: string
    notes?: string
    override_start_screen?: structs.StartHashOverride
    pseudoboots?: boolean
    spoilers?: strings.SpoilerSetting
    tournament?: boolean
    weapons?: strings.Weapons
};

export type CrystalOptions = {
    ganon?: strings.CrystalRequirement
    tower?: strings.CrystalRequirement
};

export type EnemizerOptions = {
    boss_shuffle?: strings.BossShuffle
    enemy_damage?: strings.EnemyDamage
    enemy_health?: strings.EnemyHealth
    enemy_shuffle?: strings.EnemyShuffle
    pot_shuffle?: strings.OptionToggle
};

export type ItemOptions = {
    functionality?: strings.ItemFunctionality
    pool?: strings.ItemPool
};

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
    "rom.dungeonCount"?: strings.CompassMode
    "rom.freeItemText"?: boolean
    "rom.genericKeys"?: boolean
    "rom.logicMode"?: strings.RomMode
    "rom.mapOnPickup"?: boolean
    "rom.rupeeBow"?: boolean
    "rom.timerMode"?: strings.ClockMode
    "rom.timerStart"?: string
    "spoil.BootsLocation"?: boolean
};

export type OverflowOptions = {
    count: Partial<Record<strings.Restrictable, number>>
    replacement: Partial<Record<strings.Restrictable, strings.Item>>
}

export type ItemValueOptions = {

}
import * as types from "./types";
import { Hash } from "./enums";

export type SpriteAPIData = {
    name: string
    author: string
    version: number
    file: string
    preview: string
    tags: Array<string>
    usage: Array<string>
};

export type DailyAPIData = {
    hash: string
    daily: string
};

export type PatchAPIData = {
    hash: string
    md5: string
    bpsLocation: string
};

export type BaseRomAPIData = {
    rom_hash: string
    base_file: string
};

export type SeedAPIData = {
    generated: string
    hash: string
    logic: string
    patch: Array<PatchElement>
    size: number
    spoiler: SpoilerAPIData
};

export type GenerateSeedAPIData = SeedAPIData & {
    current_rom_hash: string
};

export type APIPreset = {
    glitches_required: types.GlitchesRequired
    item_placement: types.ItemPlacement
    dungeon_items: types.DungeonItems
    accessibility: types.ItemAccessibility
    goal: types.Goal
    tower_open: types.CrystalRequirement
    ganon_open: types.CrystalRequirement
    world_state: types.WorldState
    entrance_shuffle: types.EntranceShuffle
    boss_shuffle: types.BossShuffle
    enemy_shuffle: types.EnemyShuffle
    hints: types.OptionToggle
    weapons: types.Weapons
    item_pool: types.ItemPool
    item_functionality: types.ItemFunctionality
    enemy_damage: types.EnemyDamage
    enemy_health: types.EnemyHealth
};

export type BasePayload = {
    accessibility: types.ItemAccessibility
    allow_quickswap?: boolean
    crystals: CrystalPayloadData
    dungeon_items: types.DungeonItems
    enemizer: EnemizerPayloadData
    glitches: types.GlitchesRequired
    goal: types.Goal
    hints: types.OptionToggle
    item: ItemPayloadData
    item_placement: types.ItemPlacement
    lang: types.Lang
    mode: types.WorldState
    name?: string
    notes?: string
    override_start_screen?: StartHashOverride
    pseudoboots?: boolean
    spoilers: types.SpoilerSetting
    tournament: boolean
    weapons: types.Weapons
};

export type RandomizerPayload = BasePayload & {
    entrances: types.EntranceShuffle
};

export type CustomizerPayload = BasePayload & {
    custom: CustomOptions
    drops: PrizePackGroups
    eq: Array<types.Item>
    l: {
        [x: string]: string
    }
    texts?: {
        [x: string]: string
    }
};

export type CrystalPayloadData = {
    ganon: types.CrystalRequirement
    tower: types.CrystalRequirement
};

export type EnemizerPayloadData = {
    boss_shuffle: types.BossShuffle
    enemy_damage: types.EnemyDamage
    enemy_health: types.EnemyHealth
    enemy_shuffle: types.EnemyShuffle
    pot_shuffle?: types.OptionToggle
};

export type ItemPayloadData = {
    functionality: types.ItemFunctionality
    pool: types.ItemPool
};

export type CustomOptions = AllowedGlitches & {
    customPrizePacks?: boolean
    drop: {
        count: CustomDropCounts
    }
    item: CustomizerItemOptions
    prize: CustomizerPrizeOptions
    region: CustomizerRegionOptions
    rom: CustomizerRomOptions
    spoil: {
        BootsLocation: boolean
    }
};

export type AllowedGlitches = {
    canBombJump?: boolean
    canBootsClip: boolean
    canBunnyRevive: boolean
    canBunnySurf: boolean
    canDungeonRevive: boolean
    canFakeFlipper: boolean
    canMirrorClip: boolean
    canMirrorWrap: boolean
    canOneFrameClipOW: boolean
    canOneFrameClipUW: boolean
    canOWYBA: boolean
    canSuperBunny: boolean
    canSuperSpeed: boolean
    canTransitionWrapped: boolean
    canWaterWalk: boolean
};

export type CustomDropCounts = {
    [x in types.Droppable]: number
};

export type CustomizerItemOptions = {
    count: ExtendedItemCountOptions
    Goal: {
        Required: "" | number
    }
    overflow?: ItemOverflowOptions
    require: {
        Lamp: boolean
    }
    value: {
        BlueClock: "" | number
        GreenClock: "" | number
        RedClock: "" | number
        Rupoor: "" | number
    }
};

export type PatchElement = {
    [x: number]: Array<number> | undefined
};

export type EntrancePaths = {
    [x: string]: Array<Array<string | null>> | undefined
};

export type Playthrough = {
    [x: number]: {
        [x: string]: string | undefined
    } | undefined
};

export type Entrance = {
    direction: types.EntranceDirection
    entrance: string
    exit: string
};

export type WorldRegion = {
    [x: string]: string | undefined
};

export type BossLocations = {
    [x: string]: types.Boss | undefined
};

export type ShopData = {
    item_0: string | ShopItemData
    item_1: string | ShopItemData
    item_2?: string | ShopItemData
    location: string
    type: string
};

export type ShopItemData = {
    item: string
    price: number
};

export type SpoilerSpecialData = {
    ["Misery Mire"]: types.Medalion
    ["Turtle Rock"]: types.Medalion
};

export type StartHashOverride = [Hash, Hash, Hash, Hash, Hash];

export type CustomizerPrizeOptions = {
    crossWorld: boolean
    shufflePendants: boolean
    shuffleCrystals: boolean
};

export type CustomizerRegionOptions = {
    [x in types.RequiredRegionSettings]: boolean
} & {
        [x in types.RegionSettings]?: boolean
    };

export type RequiredRomOptions = {
    [x in types.RequiredRomBoolSettings]: boolean
} & {
    timerMode: types.ClockMode
    timerStart: "" | number
    dungeonCount: types.CompassMode
    logicMode: types.RomMode
};

export type CustomizerRomOptions = RequiredRomOptions & {

};

export type ItemCountOptions = {
    [x in types.RequiredItemCountOptions]: number
};

export type ExtendedItemCountOptions = ItemCountOptions & {
    TwentyRupees2?: number
};

export type ItemOverflowOptions = {
    count: {
        [x in types.Restrictable]?: number
    }
    replacement: {
        [x in types.Restrictable]?: types.Item
    }
};

export interface CustomizerCustomOptions extends AllowedGlitches {
    customPrizePacks?: boolean
    drop: {
        count: CustomDropCounts
    }
    item: {
        count: ItemCountOptions
    }
    /* In an ideal world, the customizer would pass this and a bunch of other
     * values below as numbers. But for some reason, they are passed as strings.
     *
     * Also these should really be sent to the customizer as nested objects, not
     * these long strings as they are being defined here.
     */
    "item.Goal.Required": string | number
    "item.overflow.count.Armor"?: string | number
    "item.overflow.count.BossHeartContainer"?: string | number
    "item.overflow.count.Bow"?: string | number
    "item.overflow.count.PieceOfHeart"?: string | number
    "item.overflow.count.Shield"?: string | number
    "item.overflow.count.Sword"?: string | number
    "item.overflow.replacement.Armor"?: types.Item
    "item.overflow.replacement.BossHeartContainer"?: types.Item
    "item.overflow.replacement.Bow"?: types.Item
    "item.overflow.replacement.PieceOfHeart"?: types.Item
    "item.overflow.replacement.Shield"?: types.Item
    "item.overflow.replacement.Sword"?: types.Item
    "item.require.Lamp": boolean
    "item.value.BlueClock": string | number
    "item.value.GreenClock": string | number
    "item.value.RedClock": string | number
    "item.value.Rupoor": string | number
    "prize.crossWorld": boolean
    "prize.shuffleCrystals": boolean
    "prize.shufflePendants": boolean
    "region.bossNormalLocation": boolean
    "region.wildBigKeys": boolean
    "region.wildCompasses": boolean
    "region.wildKeys": boolean
    "region.wildMaps": boolean
    "rom.dungeonCount": types.CompassMode
    "rom.freeItemText": boolean
    "rom.genericKeys": boolean
    "rom.logicMode": types.RomMode
    "rom.mapOnPickup": boolean
    "rom.rupeeBow": boolean
    "rom.timerMode": types.ClockMode
    "rom.timerStart": string | number
    "spoil.BootsLocation": boolean
};

export type CustomizerJSON = {
    "vt.custom.drops": CustomDropCounts | null
    "vt.custom.equipment": CustomizerJSONEquipment | null
    "vt.custom.items": ItemCountOptions | null
    "vt.custom.name": string | null
    "vt.custom.notes": string | null
    "vt.custom.locations": {
        [x: string]: types.SpoilerItemString<types.RequiredItemCountOptions>
    } | null
    "vt.custom.prizepacks": PrizePackGroups | null
    "vt.custom.settings": CustomizerJSONCustomSettings
    "vt.custom.glitches": {
        canBootsClip: boolean
        canBunnyRevive: boolean
        canBunnySurf: boolean
        canDungeonRevive: boolean
        canFakeFlipper: boolean
        canMirrorClip: boolean
        canMirrorWrap: boolean
        canTransitionWrapped: boolean
        canOneFrameClipOW: boolean
        canOneFrameClipUW: boolean
        canOWYBA: boolean
        canSuperBunny: boolean
        canSuperSpeed: boolean
        canWaterWalk: boolean
    }
    "randomizer.glitches_required": types.GlitchesRequired | null
    "randomizer.item_placement": types.ItemPlacement | null
    "randomizer.dungeon_items": types.DungeonItems | null
    "randomizer.accessibility": types.ItemAccessibility | null
    "randomizer.goal": types.Goal | null
    "randomizer.tower_open": types.CrystalRequirement | null
    "randomizer.ganon_open": types.CrystalRequirement | null
    "randomizer.world_state": types.WorldState | null
    "randomizer.hints": types.OptionToggle | null
    "randomizer.boss_shuffle": types.BossShuffle | null
    "randomizer.enemy_shuffle": types.EnemyShuffle | null
    "randomizer.weapons": types.Weapons | null
    "randomizer.item_pool": types.ItemPool | null
    "randomizer.item_functionality": types.ItemFunctionality | null
    "randomizer.enemy_damage": types.EnemyDamage | null
    "randomizer.enemy_health": types.EnemyHealth | null
};

export type CustomizerJSONEquipment = {
    ProgressiveArmor: number // Valid from 0-2
    ProgressiveSword: number // Valid from 0-4
    ProgressiveShield: number // Valid from 0-3
    MoonPearl: boolean
    ProgressiveBow: number // Valid from 0-3
    Boomerang: number // Valid from 0-3
    Hookshot: boolean
    Mushroom: boolean
    Powder: boolean
    FireRod: boolean
    IceRod: boolean
    Bombos: boolean
    Ether: boolean
    Quake: boolean
    Lamp: boolean
    Hammer: boolean
    Shovel: boolean
    BugCatchingNet: boolean
    BookOfMudora: boolean
    Bottle1: number // Valid from 0-7
    Bottle2: number // Valid from 0-7
    Bottle3: number // Valid from 0-7
    Bottle4: number // Valid from 0-7
    CaneOfSomaria: boolean
    CaneOfByrna: boolean
    Cape: boolean
    MagicMirror: boolean
    PegasusBoots: boolean
    ProgressiveGlove: number // Valid from 0-2
    Flippers: boolean
    Ocarina: number // Valid from 0-2
    PendantOfCourage: boolean
    PendantOfWisdom: boolean
    PendantOfPower: boolean
    Crystal1: boolean
    Crystal2: boolean
    Crystal3: boolean
    Crystal4: boolean
    Crystal5: boolean
    Crystal6: boolean
    Crystal7: boolean
    BossHeartContainer: number // Valid from 1-20
    Rupees: string
    empty: boolean // I'm not sure what this is
};

export type PrizePackGroups = {
    0: [
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop
    ]
    1: [
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop
    ]
    2: [
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop
    ]
    3: [
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop
    ]
    4: [
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop
    ]
    5: [
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop
    ]
    6: [
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop,
        types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop
    ]
    pull: [types.CustomizerDrop, types.CustomizerDrop, types.CustomizerDrop]
    crab: [types.CustomizerDrop, types.CustomizerDrop]
    stun: [types.CustomizerDrop]
    fish: [types.CustomizerDrop]
};

export type CustomizerJSONCustomSettings = {
    "item.Goal.Required": string
    "item.overflow.count.Armor"?: string
    "item.overflow.count.BossHeartContainer"?: string
    "item.overflow.count.Bow"?: string
    "item.overflow.count.PieceOfHeart"?: string
    "item.overflow.count.Shield"?: string
    "item.overflow.count.Sword"?: string
    "item.require.Lamp": boolean
    "item.value.BlueClock": string
    "item.value.GreenClock": string
    "item.value.RedClock": string
    "item.value.Rupoor": string
    "prize.crossWorld": boolean
    "prize.shuffleCrystals": boolean
    "prize.shufflePendants": boolean
    "region.bossNormalLocation": boolean
    "region.wildBigKeys": boolean
    "region.wildCompasses": boolean
    "region.wildKeys": boolean
    "region.wildMaps": boolean
    "rom.dungeonCount": types.CompassMode
    "rom.freeItemText": boolean
    "rom.genericKeys": boolean
    "rom.logicMode": types.RomMode
    "rom.mapOnPickup": boolean
    "rom.rupeeBow": boolean
    "rom.timerMode": types.ClockMode
    "rom.timerStart": string
    "spoil.BootsLocation": boolean
};

export type SpoilerAPIData = {
    ["Agahnims Tower"]?: WorldRegion
    Bosses?: BossLocations
    ["Castle Tower"]?: WorldRegion
    Caves?: WorldRegion
    ["Dark Palace"]?: WorldRegion
    ["Dark World"]?: WorldRegion
    ["Death Mountain"]?: WorldRegion
    ["Desert Palace"]?: WorldRegion
    ["Eastern Palace"]?: WorldRegion
    Entrances?: Array<Entrance>
    ["Ganons Tower"]?: WorldRegion
    ["Hyrule Castle"]?: WorldRegion
    ["Ice Palace"]?: WorldRegion
    ["Light World"]?: WorldRegion
    ["Misery Mire"]?: WorldRegion
    ["Palace of Darkness"]?: WorldRegion
    Shops?: Array<ShopData>
    ["Skull Woods"]?: WorldRegion
    Special?: SpoilerSpecialData
    ["Swamp Palace"]?: WorldRegion
    ["Thieves Town"]?: WorldRegion
    ["Tower of Hera"]?: WorldRegion
    ["Tower Of Hera"]?: WorldRegion
    ["Turtle Rock"]?: WorldRegion
    meta: SeedMeta
    paths?: EntrancePaths
    playthrough?: Playthrough
};

export interface SeedMeta {
    accessibility: types.ItemAccessibility
    allow_quickswap: boolean
    build: string
    dungeon_items: types.DungeonItems
    ["enemizer.boss_shuffle"]: types.BossShuffle
    ["enemizer.enemy_damage"]: types.EnemyDamage
    ["enemizer.enemy_health"]: types.EnemyHealth
    ["enemizer.enemy_shuffle"]: types.EnemyShuffle
    ["enemizer.pot_shuffle"]: types.OptionToggle
    entry_crystals_ganon: types.CrystalRequirement
    entry_crystals_tower: types.CrystalRequirement
    goal: types.Goal
    hints: types.OptionToggle
    item_functionality: types.ItemFunctionality
    item_placement: types.ItemPlacement
    item_pool: types.ItemPool
    logic: types.RomMode
    mode: types.WorldState
    pseudoboots: boolean
    rom_mode: types.RomMode
    size: number
    spoilers: types.SpoilerSetting
    tournament: boolean
    weapons: types.Weapons
    world_id: number
    worlds: number
};

export interface EntranceSeedMeta extends SeedMeta {
    keysanity: boolean
    shuffle: types.EntranceShuffle
    version: string
};

export interface CustomizerSeedMeta extends SeedMeta {
    difficulty: string
};

export interface BaseSeedSpoiler {

};

export interface EntranceSpoiler extends BaseSeedSpoiler {
    Entrances?: Array<Entrance>
    "Light World"?: {
        [x in types.EntranceLightWorldLocation]: string
    }
    "Dark World"?: {
        [x in types.EntranceDarkWorldLocation]: string
    }
    Caves?: {
        [x in types.EntranceUnderworldLocation]: string
    }
    "Hyrule Castle"?: {
        [x in types.AggregateLocation<"Hyrule Castle", "Boomerang Chest" | "Map Chest" | "Zelda's Chest">]: string
    } & {
        [x in types.AggregateLocation<"Sewers", "Dark Cross" | types.AggregateLocation<"Secret Room", "Left" | "Middle" | "Right">>]: string
    } & {
        Sanctuary: string
    }
};
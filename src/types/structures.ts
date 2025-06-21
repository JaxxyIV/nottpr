import * as strings from "./strings";
import * as enums from "./enums";
import {
    Accessibility,
    BossShuffle,
    BottleLocation,
    Crystals,
    EnemyDamage,
    EnemyShuffle,
    EnemyHealth,
    Entrances,
    Glitches,
    Goals,
    Hash,
    ItemFunctionality,
    ItemLocation,
    ItemPlacement,
    ItemPool,
    Keysanity,
    Language,
    MedallionLocation,
    PrizeLocation,
    Spoilers,
    TextDialog,
    Toggle,
    Weapons,
    WorldState,
} from "./enums";
import {
    Bottle,
    DungeonPrize,
    Item,
    Medallion,
} from "./strings";

export type SpriteAPIData = {
    name: string,
    author: string,
    version: number,
    file: string,
    preview: string,
    tags: Array<string>,
    usage: Array<string>,
};

export type DailyAPIData = {
    hash: string,
    daily: string,
};

export type PatchAPIData = {
    hash: string,
    md5: string,
    bpsLocation: string,
};

export type BaseRomAPIData = {
    rom_hash: string,
    base_file: string,
};

export type SeedAPIData = {
    generated: string,
    hash: string,
    logic: string,
    patch: Array<PatchElement>,
    size: number,
    spoiler: SpoilerAPIData,
};

export type GenerateSeedAPIData = SeedAPIData & {
    current_rom_hash: string,
};

export type APIPreset = {
    glitches_required: enums.Glitches,
    item_placement: enums.ItemPlacement,
    dungeon_items: enums.Keysanity,
    accessibility: enums.Accessibility,
    goal: enums.Goals,
    tower_open: enums.Crystals,
    ganon_open: enums.Crystals,
    world_state: enums.WorldState,
    entrance_shuffle: enums.Entrances,
    boss_shuffle: enums.BossShuffle,
    enemy_shuffle: enums.EnemyShuffle,
    hints: enums.Toggle,
    weapons: enums.Weapons,
    item_pool: enums.ItemPool,
    item_functionality: enums.ItemFunctionality,
    enemy_damage: enums.EnemyDamage,
    enemy_health: enums.EnemyHealth,
};

export interface BasePayload {
    accessibility: enums.Accessibility,
    allow_quickswap?: boolean,
    crystals: CrystalPayloadData,
    dungeon_items: enums.Keysanity,
    enemizer: EnemizerPayloadData,
    glitches: enums.Glitches,
    goal: enums.Goals,
    hints: enums.Toggle,
    item: ItemPayloadData,
    item_placement: enums.ItemPlacement,
    lang: enums.Language,
    mode: enums.WorldState,
    name?: string,
    notes?: string,
    override_start_screen?: StartHashOverride,
    pseudoboots?: boolean,
    spoilers: enums.Spoilers,
    tournament: boolean,
    weapons: enums.Weapons,
};

export interface RandomizerPayload extends BasePayload {
    entrances: enums.Entrances,
};

export interface CustomizerPayload extends BasePayload {
    custom: CustomOptions,
    drops: PrizePackGroups,
    eq: Array<enums.Item>,
    l: Partial<
        Record<enums.ItemLocation, enums.Item> &
        Record<enums.BottleLocation, enums.Bottle> &
        Record<enums.MedallionLocation, enums.Medallion> &
        Record<enums.PrizeLocation, enums.Prize>
    >,
    texts?: Partial<Record<enums.TextDialog, string>>,
};

export interface CrystalPayloadData {
    ganon: enums.Crystals,
    tower: enums.Crystals,
};

export interface EnemizerPayloadData {
    boss_shuffle: enums.BossShuffle,
    enemy_damage: enums.EnemyDamage,
    enemy_health: enums.EnemyHealth,
    enemy_shuffle: enums.EnemyShuffle,
    pot_shuffle?: enums.Toggle,
};

export interface ItemPayloadData {
    functionality: enums.ItemFunctionality,
    pool: enums.ItemPool,
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

export type CustomDropCounts = Record<Exclude<enums.Drop, "auto_fill">, number>;

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

export type PatchElement = Record<number, Array<number>>;

export type EntrancePaths = {
    [x: string]: Array<Array<string | null>> | undefined
};

export type Playthrough = {
    [x: number]: {
        [x: string]: string | undefined
    } | undefined
};

export type Entrance = {
    direction: strings.EntranceDirection
    entrance: string
    exit: string
};

export type WorldRegion = {
    [x: string]: string | undefined
};

export type BossLocations = {
    [x: string]: strings.Boss | undefined
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
    ["Misery Mire"]: strings.Medallion
    ["Turtle Rock"]: strings.Medallion
};

export type StartHashOverride = [Hash, Hash, Hash, Hash, Hash];

export type CustomizerPrizeOptions = {
    crossWorld: boolean
    shufflePendants: boolean
    shuffleCrystals: boolean
};

export type CustomizerRegionOptions = {
    [x in strings.RequiredRegionSettings]: boolean
} & {
        [x in strings.RegionSettings]?: boolean
    };

export type RequiredRomOptions = {
    [x in strings.RequiredRomBoolSettings]: boolean
} & {
    timerMode: strings.ClockMode
    timerStart: "" | number
    dungeonCount: strings.CompassMode
    logicMode: strings.RomMode
};

export type CustomizerRomOptions = RequiredRomOptions & {

};

export type ItemCountOptions = {
    [x in strings.RequiredItemCountOptions]: number
};

export type ExtendedItemCountOptions = ItemCountOptions & {
    TwentyRupees2?: number
};

export type ItemOverflowOptions = {
    count: {
        [x in strings.Restrictable]?: number
    }
    replacement: {
        [x in strings.Restrictable]?: strings.Item
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
    "item.overflow.replacement.Armor"?: strings.Item
    "item.overflow.replacement.BossHeartContainer"?: strings.Item
    "item.overflow.replacement.Bow"?: strings.Item
    "item.overflow.replacement.PieceOfHeart"?: strings.Item
    "item.overflow.replacement.Shield"?: strings.Item
    "item.overflow.replacement.Sword"?: strings.Item
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
    "rom.dungeonCount": strings.CompassMode
    "rom.freeItemText": boolean
    "rom.genericKeys": boolean
    "rom.logicMode": strings.RomMode
    "rom.mapOnPickup": boolean
    "rom.rupeeBow": boolean
    "rom.timerMode": strings.ClockMode
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
        [x: string]: strings.SpoilerItemString<strings.RequiredItemCountOptions>
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
    "randomizer.glitches_required": strings.GlitchesRequired | null
    "randomizer.item_placement": strings.ItemPlacement | null
    "randomizer.dungeon_items": strings.DungeonItems | null
    "randomizer.accessibility": strings.ItemAccessibility | null
    "randomizer.goal": strings.Goal | null
    "randomizer.tower_open": strings.CrystalRequirement | null
    "randomizer.ganon_open": strings.CrystalRequirement | null
    "randomizer.world_state": strings.WorldState | null
    "randomizer.hints": strings.OptionToggle | null
    "randomizer.boss_shuffle": strings.BossShuffle | null
    "randomizer.enemy_shuffle": strings.EnemyShuffle | null
    "randomizer.weapons": strings.Weapons | null
    "randomizer.item_pool": strings.ItemPool | null
    "randomizer.item_functionality": strings.ItemFunctionality | null
    "randomizer.enemy_damage": strings.EnemyDamage | null
    "randomizer.enemy_health": strings.EnemyHealth | null
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
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop
    ],
    1: [
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
    ],
    2: [
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
    ],
    3: [
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
    ],
    4: [
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
    ],
    5: [
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
    ],
    6: [
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop, strings.CustomizerDrop,
    ],
    pull: [
        strings.CustomizerDrop, strings.CustomizerDrop,
        strings.CustomizerDrop,
    ],
    crab: [
        strings.CustomizerDrop, strings.CustomizerDrop,
    ],
    stun: [strings.CustomizerDrop]
    fish: [strings.CustomizerDrop]
};

export type LocationMap = Partial<Record<ItemLocation, strings.Item> &
    Record<PrizeLocation, strings.DungeonPrize> &
    Record<MedallionLocation, strings.Medallion> &
    Record<BottleLocation, strings.Bottle>>;

export type TextMap = Partial<Record<TextDialog, string>>;

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
    "rom.dungeonCount": strings.CompassMode
    "rom.freeItemText": boolean
    "rom.genericKeys": boolean
    "rom.logicMode": strings.RomMode
    "rom.mapOnPickup": boolean
    "rom.rupeeBow": boolean
    "rom.timerMode": strings.ClockMode
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
    accessibility: strings.ItemAccessibility
    allow_quickswap: boolean
    build: string
    dungeon_items: strings.DungeonItems
    ["enemizer.boss_shuffle"]: strings.BossShuffle
    ["enemizer.enemy_damage"]: strings.EnemyDamage
    ["enemizer.enemy_health"]: strings.EnemyHealth
    ["enemizer.enemy_shuffle"]: strings.EnemyShuffle
    ["enemizer.pot_shuffle"]: strings.OptionToggle
    entry_crystals_ganon: strings.CrystalRequirement
    entry_crystals_tower: strings.CrystalRequirement
    goal: strings.Goal
    hints: strings.OptionToggle
    item_functionality: strings.ItemFunctionality
    item_placement: strings.ItemPlacement
    item_pool: strings.ItemPool
    logic: strings.RomMode
    mode: strings.WorldState
    pseudoboots: boolean
    rom_mode: strings.RomMode
    size: number
    spoilers: strings.SpoilerSetting
    tournament: boolean
    weapons: strings.Weapons
    world_id: number
    worlds: number
};

export interface EntranceSeedMeta extends SeedMeta {
    keysanity: boolean
    shuffle: strings.EntranceShuffle
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
        [x in strings.EntranceLightWorldLocation]: string
    }
    "Dark World"?: {
        [x in strings.EntranceDarkWorldLocation]: string
    }
    Caves?: {
        [x in strings.EntranceUnderworldLocation]: string
    }
    "Hyrule Castle"?: {
        [x in strings.AggregateLocation<"Hyrule Castle", "Boomerang Chest" | "Map Chest" | "Zelda's Chest">]: string
    } & {
        [x in strings.AggregateLocation<"Sewers", "Dark Cross" | strings.AggregateLocation<"Secret Room", "Left" | "Middle" | "Right">>]: string
    } & {
        Sanctuary: string
    }
};
import * as strings from "./strings.js";
import {
    Accessibility,
    BossShuffle,
    Bottle,
    BottleLocation,
    Crystals,
    Drop,
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
    Medallion,
    MedallionLocation,
    Prize,
    PrizeLocation,
    Spoilers,
    TextDialog,
    Toggle,
    Weapons,
    WorldState,
    Item,
    ClockMode,
    CompassMode,
    Icon,
    RomMode,
} from "./enums.js";

/* Type definitions for various API structures on alttpr.com. */

export interface SpriteAPIData {
    name: string,
    author: string,
    version: number,
    file: string,
    preview: string,
    tags: string[],
    usage: string[],
}

export interface DailyAPIData {
    hash: string,
    daily: string,
}

export interface PatchAPIData {
    hash: string,
    md5: string,
    bpsLocation: string,
}

export interface BaseRomAPIData {
    rom_hash: string,
    base_file: string,
}

export interface SeedAPIData {
    generated: string,
    hash: string,
    logic: string,
    patch: PatchElement[],
    size: number,
    spoiler: SpoilerAPIData,
    current_rom_hash?: string,
}

export interface APIPreset {
    glitches_required: Glitches,
    item_placement: ItemPlacement,
    dungeon_items: Keysanity,
    accessibility: Accessibility,
    goal: Goals,
    tower_open: Crystals,
    ganon_open: Crystals,
    world_state: WorldState,
    entrance_shuffle: Entrances,
    boss_shuffle: BossShuffle,
    enemy_shuffle: EnemyShuffle,
    hints: Toggle,
    weapons: Weapons,
    item_pool: ItemPool,
    item_functionality: ItemFunctionality,
    enemy_damage: EnemyDamage,
    enemy_health: EnemyHealth,
}

export interface BasePayload {
    accessibility: Accessibility,
    allow_quickswap?: boolean,
    crystals: CrystalPayloadData,
    dungeon_items: Keysanity,
    enemizer: EnemizerPayloadData,
    glitches: Glitches,
    goal: Goals,
    hints: Toggle,
    item: ItemPayloadData,
    item_placement: ItemPlacement,
    lang: Language,
    mode: WorldState,
    name?: string,
    notes?: string,
    override_start_screen?: StartHashOverride,
    pseudoboots?: boolean,
    spoilers: Spoilers,
    tournament: boolean,
    weapons: Weapons,
}

export interface RandomizerPayload extends BasePayload {
    entrances: Entrances,
}

export interface CustomizerPayload extends BasePayload {
    custom: CustomOptions,
    drops: PrizePackGroups,
    eq: strings.StartingEquipment[],
    l: LocationMap,
    texts?: Partial<Record<TextDialog, string>>,
}

export interface CrystalPayloadData {
    ganon: Crystals,
    tower: Crystals,
}

export interface EnemizerPayloadData {
    boss_shuffle: BossShuffle,
    enemy_damage: EnemyDamage,
    enemy_health: EnemyHealth,
    enemy_shuffle: EnemyShuffle,
    pot_shuffle?: Toggle,
}

export interface ItemPayloadData {
    functionality: ItemFunctionality,
    pool: ItemPool,
}

export interface CustomOptions extends AllowedGlitches {
    customPrizePacks?: boolean,
    drop: {
        count: CustomDropCounts,
    },
    item: CustomizerItemOptions,
    prize: CustomizerPrizeOptions,
    region: CustomizerRegionOptions,
    rom: CustomizerRomOptions,
    spoil: {
        BootsLocation: boolean,
    },
}

// Separate type so we can have a single setter function for the glitched
// logic instead of 15.
export interface AllowedGlitches {
    canBombJump?: boolean,
    canBootsClip: boolean,
    canBunnyRevive: boolean,
    canBunnySurf: boolean,
    canDungeonRevive: boolean,
    canFakeFlipper: boolean,
    canMirrorClip: boolean,
    canMirrorWrap: boolean,
    canOneFrameClipOW: boolean,
    canOneFrameClipUW: boolean,
    canOWYBA: boolean,
    canSuperBunny: boolean,
    canSuperSpeed: boolean,
    canTransitionWrapped: boolean,
    canWaterWalk: boolean,
}

export type CustomDropCounts = Record<Exclude<Drop, "auto_fill">, number>;

export interface CustomItemValues {
    BlueClock: "" | number,
    GreenClock: "" | number,
    RedClock: "" | number,
    Rupoor: "" | number,
    BombUpgrade5?: number,
    BombUpgrade10?: number,
    ArrowUpgrade5?: number,
    ArrowUpgrade10?: number,
}

export interface CustomizerItemOptions {
    count: CustomItemCounts,
    Goal: {
        Required: "" | number,
        Icon?: Icon,
    },
    overflow?: ItemOverflowSettings,
    require: {
        Lamp: boolean,
    },
    value: CustomItemValues,
}

export type PatchElement = Record<number, number[]>;
export type EntrancePaths = Record<string, (string | null)[][]>;
export type Playthrough = Record<number, Record<string, string>>;

export interface Entrance {
    direction: strings.EntranceDirection,
    entrance: string,
    exit: string,
}

export type WorldRegion = Record<string, string>;
export type BossLocations = Record<string, strings.Boss>;

export interface ShopData {
    item_0: string | ShopItemData,
    item_1: string | ShopItemData,
    item_2?: string | ShopItemData,
    location: string,
    type: string,
}

export interface ShopItemData {
    item: string,
    price: number,
}

export interface SpoilerSpecialData {
    ["Misery Mire"]: Medallion,
    ["Turtle Rock"]: Medallion,
}

export type StartHashOverride = [Hash, Hash, Hash, Hash, Hash];

export interface CustomizerPrizeOptions {
    crossWorld: boolean,
    shufflePendants: boolean,
    shuffleCrystals: boolean,
}

export type CustomizerRegionOptions = Record<strings.RequiredRegionSettings, boolean> & Partial<Record<strings.RegionSettings, boolean>>;

export type RequiredRomOptions = Record<strings.RequiredRomBoolSettings, boolean> & {
    timerMode: ClockMode
    timerStart: "" | number
    dungeonCount: CompassMode
    logicMode: strings.RomMode
};

export interface CustomizerRomOptions extends RequiredRomOptions {
    CapeMagicUsage?: Partial<{
        Normal: number,
        Half: number,
        Quarter: number,
    }>,
    CaneOfByrnaInvulnerability?: boolean,
    PowderedSpriteFairyPrize?: number,
    BottleFill?: Partial<{
        Health: number,
        Magic: number,
    }>,
    CatchableFairies?: boolean,
    CatchableBees?: boolean,
    StunItems?: number,
    SilversOnlyAtGanon?: boolean,
    NoFarieDrops?: boolean,
    GanonAgRNG?: "none" | "table",
    vanillaKeys?: boolean,
    vanillaBigKeys?: boolean,
    vanillaCompasses?: boolean,
    vanillaMaps?: boolean,
    hudItemCounter?: boolean,
}

export type CustomItemCounts = Record<strings.RequiredItemCountOptions, number> & {
    TwentyRupees2?: number
};

export interface ItemOverflowSettings {
    count: Partial<Record<strings.Restrictable, number>>
    replacement: Partial<Record<strings.Restrictable, number>>
}

export interface CustomizerCustomOptions extends AllowedGlitches {
    customPrizePacks?: boolean
    drop: {
        count: CustomDropCounts
    }
    item: {
        count: CustomItemCounts
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
    "rom.dungeonCount": CompassMode
    "rom.freeItemText": boolean
    "rom.genericKeys": boolean
    "rom.logicMode": strings.RomMode
    "rom.mapOnPickup": boolean
    "rom.rupeeBow": boolean
    "rom.timerMode": ClockMode
    "rom.timerStart": string | number
    "spoil.BootsLocation": boolean
}

export interface CustomizerJSON {
    "vt.custom.drops": CustomDropCounts | null
    "vt.custom.equipment": CustomizerJSONEquipment | null
    "vt.custom.items": CustomItemCounts | null
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
    "randomizer.glitches_required": Glitches | null
    "randomizer.item_placement": ItemPlacement | null
    "randomizer.dungeon_items": Keysanity | null
    "randomizer.accessibility": Accessibility | null
    "randomizer.goal": Goals | null
    "randomizer.tower_open": Crystals | null
    "randomizer.ganon_open": Crystals | null
    "randomizer.world_state": WorldState | null
    "randomizer.hints": Toggle | null
    "randomizer.boss_shuffle": BossShuffle | null
    "randomizer.enemy_shuffle": EnemyShuffle | null
    "randomizer.weapons": Weapons | null
    "randomizer.item_pool": ItemPool | null
    "randomizer.item_functionality": ItemFunctionality | null
    "randomizer.enemy_damage": EnemyDamage | null
    "randomizer.enemy_health": EnemyHealth | null
}

export interface CustomizerJSONEquipment {
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
}

export interface PrizePackGroups {
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
}

export type LocationMap = Partial<Record<ItemLocation, Item> &
    Record<PrizeLocation, Prize> &
    Record<MedallionLocation, Medallion> &
    Record<BottleLocation, Bottle>>;

export type TextMap = Partial<Record<TextDialog, string>>;

export interface CustomizerJSONCustomSettings {
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
    "rom.dungeonCount": CompassMode
    "rom.freeItemText": boolean
    "rom.genericKeys": boolean
    "rom.logicMode": RomMode
    "rom.mapOnPickup": boolean
    "rom.rupeeBow": boolean
    "rom.timerMode": ClockMode
    "rom.timerStart": string
    "spoil.BootsLocation": boolean
}

export interface SpoilerAPIData {
    "Agahnims Tower"?: WorldRegion
    Bosses?: BossLocations
    "Castle Tower"?: WorldRegion
    Caves?: WorldRegion
    "Dark Palace"?: WorldRegion
    "Dark World"?: WorldRegion
    "Death Mountain"?: WorldRegion
    "Desert Palace"?: WorldRegion
    "Eastern Palace"?: WorldRegion
    Entrances?: Entrance[]
    ["Ganons Tower"]?: WorldRegion
    ["Hyrule Castle"]?: WorldRegion
    ["Ice Palace"]?: WorldRegion
    ["Light World"]?: WorldRegion
    ["Misery Mire"]?: WorldRegion
    ["Palace of Darkness"]?: WorldRegion
    Shops?: ShopData[]
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
}

export interface SeedMeta {
    accessibility: Accessibility
    allow_quickswap: boolean
    build: string
    dungeon_items: Keysanity
    "enemizer.boss_shuffle": BossShuffle
    "enemizer.enemy_damage": EnemyDamage
    "enemizer.enemy_health": EnemyHealth
    "enemizer.enemy_shuffle": EnemyShuffle
    "enemizer.pot_shuffle": Toggle
    entry_crystals_ganon: Crystals
    entry_crystals_tower: Crystals
    goal: Goals
    hints: Toggle
    item_functionality: ItemFunctionality
    item_placement: ItemPlacement
    item_pool: ItemPool
    logic: strings.RomMode
    mode: WorldState
    pseudoboots: boolean
    rom_mode: strings.RomMode
    size: number
    spoilers: Spoilers
    tournament: boolean
    weapons: Weapons
    world_id: number
    worlds: number
}

export interface EntranceSeedMeta extends SeedMeta {
    keysanity: boolean
    shuffle: Entrances
    version: string
}

export interface CustomizerSeedMeta extends SeedMeta {
    difficulty: string
}

export interface BaseSeedSpoiler {}

export interface EntranceSpoiler extends BaseSeedSpoiler {
    Entrances?: Array<Entrance>
    "Light World"?: Record<strings.EntranceLightWorldLocation, string>
    "Dark World"?: Record<strings.EntranceDarkWorldLocation, string>
    Caves?: Record<strings.EntranceUnderworldLocation, string>
    "Hyrule Castle"?: {
        [x in strings.AggregateLocation<"Hyrule Castle", "Boomerang Chest" | "Map Chest" | "Zelda's Chest">]: string
    } & {
        [x in strings.AggregateLocation<"Sewers", "Dark Cross" | strings.AggregateLocation<"Secret Room", "Left" | "Middle" | "Right">>]: string
    } & {
        Sanctuary: string
    }
}
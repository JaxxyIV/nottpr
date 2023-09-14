import * as types from "./types";

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

export type SpoilerAPIData = {
    ["Agahnims Tower"]?: WorldRegion
    Bosses?: BossLocations
    Caves?: WorldRegion
    ["Dark World"]?: WorldRegion
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
    ["Turtle Rock"]?: WorldRegion
    meta: SeedMeta
    paths?: EntrancePaths
    playthrough?: Playthrough
};

export type SeedMeta = {
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
    keysanity?: boolean
    logic: types.RomMode
    mode: types.WorldState
    pseudoboots: boolean
    rom_mode: types.RomMode
    shuffle?: types.EntranceShuffle
    size: number
    spoilers: types.SpoilerSetting
    tournament: boolean
    version?: string
    weapons: types.Weapons
    world_id: number
    worlds: number
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
    drops: any
    eq: Array<types.Item>
    l: any

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
    drop: {
        count: CustomDropCounts
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

export type CustomItemOptions = {
    count: {
        [x in types.Item]: number
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

export type StartHashOverride = [number, number, number, number, number];

export type CustomizerPrizeOptions = {
    crossWorld: boolean
    shufflePendants: boolean
    shuffleCrystals: boolean
};
import {
    ItemLocation,
    PrizeLocation,
    MedallionLocation,
    BottleLocation
} from "./enums.js";

export type GameRegion = "Light World" | "Hyrule Castle" | "Eastern Palace" | "Desert Palace" | "Death Mountain" | "Tower of Hera" | "Castle Tower" | "Dark World" | "Dark Palace" | "Swamp Palace" | "Skull Woods" | "Thieves Town" | "Ice Palace" | "Misery Mire" | "Turtle Rock" | "Ganons Tower" | "Special";

export type BaseSeedDungeons = "Hyrule Castle" | "Eastern Palace" | "Desert Palace" | "Swamp Palace" | "Skull Woods" | "Thieves Town" | "Ice Palace" | "Misery Mire" | "Turtle Rock" | "Ganons Tower";
export type SeedDungeons = BaseSeedDungeons | "Tower Of Hera" | "Castle Tower" | "Dark Palace";
export type EntranceSeedDungeons = BaseSeedDungeons | "Tower of Hera" | "Agahnims Tower" | "Palace of Darkness";
export type BaseOverworldRegions = "Light World" | "Dark World";
export type OverworldRegions = BaseOverworldRegions | "Death Mountain";
export type SeedRegions = SeedDungeons | OverworldRegions;
export type EntranceSeedRegions = EntranceSeedDungeons | BaseOverworldRegions | "Caves";

export type EntranceLightWorldLocation = "Mushroom" | "Bottle Merchant" | "Flute Spot" | "Sunken Treasure" | "Purple Chest" | "King Zora" | "Hobo" | "Lake Hylia Island" | "Maze Race" | "Desert Ledge" | "Master Sword Pedestal" | "Ether Tablet" | "Spectacle Rock" | "Floating Island";
export type EntranceDarkWorldLocation = "Pyramid" | "Catfish" | "Stumpy" | "Digging Game" | "Bombos Tablet" | "Frog" | "Dark Blacksmith Ruins" | "Bumper Cave Ledge";
export type EntranceUnderworldLocation = AggregateLocation<"Blind's Hideout", "Top" | "Left" | "Right" | "Far Left" | "Far Right"> | "Link's Uncle" | "Secret Passage" | AggregateLocation<"Waterfall Fairy", "Left" | "Right"> | "King's Tomb" | "Floodgate" | "Floodgate Chest" | "Link's House" | "Kakariko Tavern" | "Chicken House" | "Aginah's Cave" | AggregateLocation<"Sahasrahla's Hut", "Left" | "Middle" | "Right"> | "Sahasrahla" | AggregateLocation<"Kakariko Well", "Top" | "Left" | "Middle" | "Right" | "Bottom"> | "Blacksmith" | "Missing Smith" | "Magic Bat" | "Sick Kid" | "Lost Woods Hideout" | "Lumberjack Tree" | "Cave 45" | "Graveyard Cave" | AggregateLocation<"Mini Moldorm Cave", "Far Left" | "Left" | "Right" | "Far Right" | "Generous Guy"> | "Ice Rod Cave" | "Bonk Rock Cave" | "Library" | "Potion Shop" | "Old Man" | "Spectacle Rock Cave" | AggregateLocation<"Paradox Cave Lower", "Far Left" | "Left" | "Right" | "Far Right" | "Middle"> | AggregateLocation<"Paradox Cave Upper", "Left" | "Right"> | "Spiral Cave" | AggregateLocation<"Hype Cave", "Top" | "Middle Right" | "Middle Left" | "Bottom" | "Generous Guy"> | "Peg Cave" | AggregateLocation<"Pyramid Fairy", "Left" | "Right"> | "Brewery" | "C-Shaped House" | "Chest Game" | AggregateLocation<"Mire Shed", "Left" | "Right"> | AggregateLocation<"Superbunny Cave", "Top" | "Bottom"> | "Spike Cave" | AggregateLocation<"Hookshot Cave", "Top Right" | "Top Left" | "Bottom Right" | "Bottom Left"> | "Mimic Cave" | "Ganon";

export type LocationClass = "items" | "prizes" | "bottles" | "medallions";
export type PrizePackName = NumberString<0 | 1 | 2 | 3 | 4 | 5 | 6> | "pull" | "crab" | "stun" | "fish";
export type Boss = "Armos Knights" | "Lanmolas" | "Moldorm" | "Aganihm" | "Helmasaur King" | "Arrghus" | "Mothula" | "Blind" | "Kholdstare" | "Vitreous" | "Trinexx" | "Agahnim 2" | "Ganon";
export type RomMode = "NoGlitches" | "OverworldGlitches" | "MajorGlitches" | "NoLogic";
export type EntranceDirection = "entrance" | "exit" | "both";
export type Medallion = "Bombos" | "Ether" | "Quake";
export type DungeonSuffix = "A1" | "A2" | "D1" | "D2" | "D3" | "D4" | "D5" | "D6" | "D7" | "H2" | "P1" | "P2" | "P3";

export type Bottle = "Bottle" | "BottleWithBee" | "BottleWithBluePotion" | "BottleWithFairy" | "BottleWithGoldBee" | "BottleWithGreenPotion" | "BottleWithRandom" | "BottleWithRedPotion";
export type CapacityUpgrade = "ArrowUpgrade10" | "ArrowUpgrade5" | "BombUpgrade10" | "BombUpgrade5";
export type Subweapon = Medallion | "BookOfMudora" | "Boomerang" | "Bow" | "BowAndArrows" | "BowAndSilverArrows" | "BugCatchingNet" | "CaneOfByrna" | "CaneOfSomaria" | "Cape" | "FireRod" | "Hammer" | "Hookshot" | "IceRod" | "Lamp" | "MagicMirror" | "Mushroom" | "OcarinaActive" | "OcarinaInactive" | "Powder" | "RedBoomerang" | "Shovel";
export type Equipment = "BlueMail" | "BlueShield" | "BossHeartContainer" | "Flippers" | "HalfMagic" | "HeartContainer" | "L1Sword" | "L1SwordAndShield" | "L3Sword" | "L4Sword" | "MasterSword" | "MirrorShield" | "MoonPearl" | "PegasusBoots" | "PieceOfHeart" | "PowerGlove" | "ProgressiveArmor" | "ProgressiveBow" | "ProgressiveGlove" | "ProgressiveShield" | "ProgressiveSword" | "QuarterMagic" | "RedMail" | "RedShield" | "SilverArrowUpgrade" | "TitansMitt";
export type Clock = "BlueClock" | "GreenClock" | "RedClock";

export type RupeeAmount = Rupee<"Five" | "Twenty" | "Fifty" | "OneHundred" | "ThreeHundred"> | "OneRupee";
export type Pendant = BasePendant<"Courage" | "Wisdom" | "Power">;
export type Crystal = BaseCrystal<1 | 2 | 3 | 4 | 5 | 6 | 7>;
export type DungeonPrize = Crystal | Pendant;
export type RequiredItemCountOptions = CapacityUpgrade | BigKey<DungeonSuffix> | Bottle | Subweapon | Compass<DungeonSuffix> | Equipment | Clock | SmallKey<DungeonSuffix> | DungeonMap<DungeonSuffix> | RupeeAmount | "Arrow" | "Bomb" | "Heart" | "Nothing" | "Rupoor" | "SmallMagic" | "TenArrows" | "TenBombs" | "ThreeBombs" | "Triforce" | "TriforcePiece";

export type StartingEquipment = CapacityUpgrade | BigKey<DungeonSuffix> | Bottle | Subweapon |
    Compass<DungeonSuffix> | Equipment | SmallKey<DungeonSuffix> | DungeonMap<DungeonSuffix> | DungeonPrize | "Arrow" | "Bomb" | "FiftyRupees" | "FiveRupees" | "OneHundredRupees" | "OneRupee" | "Rupoor" | "SmallMagic" | "TenArrows" | "TenBombs" | "ThreeBombs" | "ThreeHundredRupees" | "TriforcePiece" | "TwentyRupees";
export type Item = RequiredItemCountOptions | "TwentyRupees2";
export type Droppable = "ArrowRefill10" | "ArrowRefill5" | "Bee" | "BeeGood" | "BombRefill1" | "BombRefill4" | "BombRefill8" | "Fairy" | "Heart" | "MagicRefillFull" | "MagicRefillSmall" | "RupeeBlue" | "RupeeGreen" | "RupeeRed";

export type EnemyPacks = "Heart" | "Rupee" | "Bomb" | "Magic" | "Arrow" | "SmallVariety" | "BigVariety";

export type BaseSettings = RequiredBaseSettings | OptionalBaseSettings;
export type RequiredBaseSettings = "accessibility" | "crystals" | "dungeon_items" | "enemizer" | "glitches" | "goal" | "hints" | "item" | "item_placement" | "lang" | "mode" | "spoilers" | "tournament" | "weapons";
export type OptionalBaseSettings = "allow_quickswap" | "name" | "notes" | "override_start_screen" | "pseudoboots";
export type CustomizerSettings = "l" | "eq" | "drops" | "custom" | "texts";
export type RequiredRomBoolSettings = "freeItemMenu" | "freeItemText" | "mapOnPickup" | "rupeeBow" | "genericKeys";
export type RequiredRomSettings = "dungeonCount" | "timerMode" | "timerStart" | "logicMode";
export type RequiredRegionSettings = "bossNormalLocation" | "wildBigKeys" | "wildCompasses" | "wildKeys" | "wildMaps";
export type RegionSettings = "forceSkullWoodsKey" | "bossHeartsInPool" | "bossesHaveItem" | "takeAnys";
export type CustomSettings = "item" | "prize" | "region" | "rom" | "spoil.BootsLocation" | "drop";
export type Restrictable = "Sword" | "Armor" | "Bow" | "Shield" | "BossHeartContainer" | "PieceOfHeart" | "Bottle";

export type SpoilerItemString<I extends Item> = `${I}:1`;

export type EquipmentSlot<N extends number> = `Equipment slot ${N}`;
export type BaseCrystal<N extends number> = `Crystal${N}`;
export type BasePendant<S extends string> = `PendantOf${S}`;
export type Rupee<S extends string> = `${S}Rupees`;
export type AggregateLocation<L extends string, C extends string> = `${L} - ${C}`;
export type BigKey<S extends DungeonSuffix> = `BigKey${S}`;
export type Compass<S extends DungeonSuffix> = `Compass${S}`;
export type SmallKey<S extends DungeonSuffix> = `Key${S}`;
export type DungeonMap<S extends DungeonSuffix> = `Map${S}`;
type NumberString<N extends number> = `${N}`;

export type CustomizerDrop = Droppable | "auto_fill";

export type Locations = ItemLocation | PrizeLocation | MedallionLocation | BottleLocation;
export type ValidItemOptions<T extends ItemLocation | PrizeLocation | MedallionLocation | BottleLocation> = T extends ItemLocation ? Item
    : T extends PrizeLocation ? DungeonPrize
    : T extends MedallionLocation ? Medallion
    : Bottle;

export type TextSpeed = 0 | 1 | 2 | 6;
export type TextPause = 1 | 3 | 5 | 7 | 9;
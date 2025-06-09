import {
    CrystalPayloadData,
    EnemizerPayloadData,
    ItemPayloadData,
    StartHashOverride
} from "../../types/structures";
import {
    DungeonItems,
    GlitchesRequired,
    Goal,
    ItemAccessibility,
    ItemPlacement,
    Lang,
    OptionToggle,
    SpoilerSetting,
    Weapons,
    WorldState
} from "../../types/strings";

export default interface BaseSeed {
    get accessibility(): ItemAccessibility;
    get allowQuickswap(): boolean;
    get crystals(): CrystalPayloadData;
    get dungeonItems(): DungeonItems;
    get enemizer(): EnemizerPayloadData;
    get glitches(): GlitchesRequired;
    get goal(): Goal;
    get hints(): OptionToggle;
    get item(): ItemPayloadData;
    get itemPlacement(): ItemPlacement;
    get lang(): Lang;
    get mode(): WorldState;
    get name(): string;
    get notes(): string;
    get overrideStartScreen(): StartHashOverride;
    get pseudoboots(): boolean;
    get spoilers(): SpoilerSetting;
    get tournament(): boolean;
    get weapons(): Weapons;

    setAccessibility(access: ItemAccessibility): this;
    setAllowQuickswap(allow: boolean): this;
    setCrystals(options: Partial<CrystalPayloadData>): this;
    setDungeonItems(shuffle: DungeonItems): this;
    setEnemizer(options: Partial<EnemizerPayloadData>): this;
    setGlitches(glitches: GlitchesRequired): this;
    setGoal(goal: Goal): this;
    setHints(toggle: OptionToggle): this;
    setItem(options: Partial<ItemPayloadData>): this;
    setItemPlacement(placement: ItemPlacement): this;
    setLang(lang: Lang): this;
    setMode(mode: WorldState): this;
    setName(name: string): this;
    setNotes(notes: string): this;
    setOverrideStartScreen(hash: StartHashOverride): this;
    setPseudoboots(enable: boolean): this;
    setSpoilers(spoilers: SpoilerSetting): this;
    setTournament(tournament: boolean): this;
    setWeapons(weapons: Weapons): this;
}
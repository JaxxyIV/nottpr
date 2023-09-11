import SeedBuilder from "./SeedBuilder";
export default class MysteryWeightset {
    #private;
    constructor();
    getWeight(key: ConfigurableOptions): Weights | undefined;
    setWeight(key: ConfigurableOptions, weights: Weights): this;
    select(showSettings?: boolean): SeedBuilder;
}
type ConfigurableOptions = "accessibility" | "allow_quickswap" | "crystals.ganon" | "crystals.tower" | "dungeon_items" | "enemizer.boss_shuffle" | "enemizer.enemy_damage" | "enemizer.enemy_health" | "enemizer.enemy_shuffle" | "enemizer.pot_shuffle" | "glitches" | "goal" | "hints" | "item.functionality" | "item.pool" | "item_placement" | "mode" | "pseudoboots" | "weapons";
type Weights = {
    [x: string]: number;
};
export {};

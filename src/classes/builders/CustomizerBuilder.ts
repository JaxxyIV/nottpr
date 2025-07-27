import * as fs from "node:fs";
import * as yaml from "yaml";
import BaseSeedBuilder from "./BaseSeedBuilder.js";
import CustomSettingsBuilder from "./CustomSettingsBuilder.js";
import EquipmentBuilder from "./EquipmentBuilder.js";
import PrizePackBuilder from "./PrizePackBuilder.js";
import {
    AllowedGlitches,
    BuilderCallback,
    CustomizerJSON,
    CustomizerJSONEquipment,
    CustomizerPayload,
    CustomOptions,
    DeepPartial,
    LocationMap,
    NottprYAML,
    PrizePackGroups,
    TextMap,
} from "../../types/structures.js";
import { RupeeAmount, StartingEquipment } from "../../types/strings.js";
import {
    Bottle,
    BottleLocation,
    Item,
    ItemLocation,
    Medallion,
    MedallionLocation,
    Prize,
    PrizeLocation,
} from "../../types/enums.js";
import { CustomizerSeedOptions } from "../../types/optionObjs.js";
import { baseDefault, customizerDefault } from "../../types/symbol/payloads.js";
import { unflatten } from "flat";

/**
 * An instance of this class represents a payload object to be supplied to
 * alttpr.com's customizer API. By default, all instances are initialized with
 * default settings to mimic an open 7/7 defeat Ganon.
 *
 * Like SeedBuilder objects, settings can be modified through the use of setters.
 * These setters often expect smaller builder objects to be supplied as arguments;
 * however, you can use callback functions to avoid importing multiple builder
 * classes.
 *
 * Item and drop pool counts do not sync with placed items/starting equipment
 * and prize packs respectively when calling the `toJSON()` method.
 *
 * @example
 * ```js
 * import { CustomizerBuilder, Item } from "nottpr";
 *
 * const builder = new CustomizerBuilder()
 *     .setEquipment(equip => equip
 *         .setStartingBoots(true))
 *     .setCustom(custom => custom
 *         .setItemSettings(item => item
 *             .setItemCounts({
 *                 [Item.PegasusBoots]: 0
 *             })));
 * ```
 * @extends BaseSeedBuilder
 */
export default class CustomizerBuilder
    extends BaseSeedBuilder<CustomizerPayload> {
    static #websiteJSONMap: [keyof CustomizerJSON, string][] = [
        ["randomizer.accessibility", "accessibility"],
        ["randomizer.boss_shuffle", "enemizer.boss_shuffle"],
        ["randomizer.dungeon_items", "dungeon_items"],
        ["randomizer.enemy_damage", "enemizer.enemy_damage"],
        ["randomizer.enemy_health", "enemizer.enemy_health"],
        ["randomizer.enemy_shuffle", "enemizer.enemy_shuffle"],
        ["randomizer.ganon_open", "crystals.ganon"],
        ["randomizer.glitches_required", "glitches"],
        ["randomizer.goal", "goal"],
        ["randomizer.hints", "hints"],
        ["randomizer.item_functionality", "item.item_functionality"],
        ["randomizer.item_placement", "item_placement"],
        ["randomizer.item_pool", "item.item_pool"],
        ["randomizer.tower_open", "crystals.tower"],
        ["randomizer.weapons", "weapons"],
        ["randomizer.world_state", "mode"],
        ["vt.custom.drops", "custom.drops.count"],
        ["vt.custom.items", "custom.item.count"],
        ["vt.custom.locations", "l"],
        ["vt.custom.name", "name"],
        ["vt.custom.notes", "notes"],
        ["vt.custom.prizepacks", "drops"],
        ["vt.custom.settings", "custom"],
    ];

    static readonly #default = this.#createDefault();

    #forcedItems: ItemTuple[] = [];

    constructor(options?: DeepPartial<CustomizerPayload>) {
        super();
        if (!options) return;
        this._body = { ...options } as typeof this._body;
    }

    static fromYAML(file: string): CustomizerBuilder {
        const str = fs.readFileSync(file).toString();
        const preset = yaml.parse(str);
        if (preset.customizer !== true) {
            throw new SyntaxError("Input file is not a customizer preset.");
        } else if (preset.doors) {
            throw new SyntaxError("Door randomizer presets are unsupported.");
        }
        const settings = unflatten(preset.settings);
        const obj = new this(settings);
        if ("forced_locations" in preset) {
            obj.setForcedItems(...preset.forced_locations);
        }
        return obj;
    }

    /**
     * Accepts a file path to a customizer .json file or an object literal and
     * converts it to a CustomizerBuilder.
     *
     * @param data The data to be parsed.
     * @returns The settings converted to a builder.
     */
    static fromCustomizerJSON(data: string | CustomizerJSON): CustomizerBuilder {
        if (typeof data === "string") {
            data = JSON.parse(fs.readFileSync(data).toString()) as CustomizerJSON;
        }

        const nest = (obj: any, keys: string[], value: unknown): void => {
            let temp = obj;
            for (let i = 0; i < keys.length; ++i) {
                if (i === keys.length - 1) {
                    temp[keys[i]] = value;
                } else if (!(keys[i] in temp)) {
                    temp[keys[i]] = {};
                }
                temp = temp[keys[i]];
            }
        };
        const copy = this.prototype._deepCopy(data);
        const converted: Partial<CustomizerPayload> = {};

        for (const [jsonKey, payloadKey] of this.#websiteJSONMap) {
            if (copy[jsonKey] !== null) {
                const props = payloadKey.split(".");
                if (props.length > 1) {
                    nest(converted, props, copy[jsonKey]);
                } else {
                    converted[payloadKey as keyof CustomizerSeedOptions] = copy[jsonKey] as never;
                }
            }
        }

        for (const [k, v] of Object.entries(copy["vt.custom.glitches"])) {
            converted.custom[k as keyof AllowedGlitches] = v;
        }

        const eq: StartingEquipment[] = [];
        for (const [k, v] of Object.entries(copy["vt.custom.equipment"])) {
            if (k === "empty") {
                continue;
            } else if (typeof v === "boolean" && v) {
                eq.push(k as StartingEquipment);
            } else if (typeof v === "number") {
                if (v <= 0) {
                    continue;
                }

                const eqK = k as keyof CustomizerJSONEquipment;
                const isClonable = (s: string) => s.startsWith("Progressive") || s === "BossHeartContainer";

                if (eqK === "ProgressiveBow") {
                    if (v === 1) {
                        eq.push("SilverArrowUpgrade");
                    } else for (let i = 0; i < v - 1; ++i) {
                        eq.push(k as StartingEquipment);
                    }
                } else if (isClonable(eqK)) {
                    for (let i = 0; i < v; ++i) {
                        eq.push(k as StartingEquipment);
                    }
                } else if (eqK === "Ocarina") {
                    eq.push(v === 1 ? "OcarinaInactive" : "OcarinaActive");
                } else if (eqK === "Boomerang") {
                    if (v !== 2) eq.push("Boomerang"); // 1 or 3
                    if (v !== 1) eq.push("RedBoomerang"); // 2 or 3
                } else if (eqK.startsWith("Bottle")) {
                    const bottleMap: Record<number, StartingEquipment> = {
                        1: "Bottle",
                        2: "BottleWithRedPotion",
                        3: "BottleWithGreenPotion",
                        4: "BottleWithBluePotion",
                        5: "BottleWithBee",
                        6: "BottleWithGoldBee",
                        7: "BottleWithFairy",
                    };
                    if (v in bottleMap) {
                        eq.push(bottleMap[v]);
                    }
                }
            } else if (typeof v === "string") { // k is "Rupees"
                const rupeeMap: Record<number, RupeeAmount> = {
                    300: "ThreeHundredRupees",
                    100: "OneHundredRupees",
                    50: "FiftyRupees",
                    20: "TwentyRupees",
                    5: "FiveRupees",
                    1: "OneRupee",
                };

                let rupees = parseInt(v);
                Object.keys(rupeeMap).reverse().map(parseInt).forEach(key => {
                    const toAdd = Math.floor(rupees / key);
                    for (let i = 0; i < toAdd; ++i)
                        eq.push(rupeeMap[key]);
                    rupees %= key;
                });
            }
        }

        converted.eq = eq;
        return new this(converted);
    }

    get eq(): ReadonlyArray<StartingEquipment> {
        return Array.from(this._body.eq);
    }

    get locations(): Readonly<LocationMap> {
        return this._body.l;
    }

    get texts(): Readonly<TextMap> {
        return this._body.texts;
    }

    get custom(): DeepPartial<CustomOptions> {
        return this._body.custom;
    }

    get drops(): Readonly<Partial<PrizePackGroups>> {
        return this._body.drops as Partial<PrizePackGroups>;
    }

    /**
     * Overwrites the current starting equipment with the provided argument.
     *
     * **Note:** Passing an array will replace the stored array's contents
     * exactly, including starting health.
     *
     * @param equipment The starting equipment for the preset described by this
     * builder. The argument can be either an array, EquipmentBuilder, or a
     * callback function.
     * @returns The current object for chaining.
     * @example
     * ```js
     * const builder = new CustomizerBuilder()
     *     .setEquipment(["PegasusBoots"]); // Zero hearts? Enjoy death!
     *
     * const builder = new CustomizerBuilder()
     *     .setEquipment([ // OK!
     *         "PegasusBoots",
     *         "BossHeartContainer",
     *         "BossHeartContainer",
     *         "BossHeartContainer"
     *     ]);
     * ```
     */
    setEquipment(equipment: EquipmentBuilder): this;
    setEquipment(equipment: StartingEquipment[]): this;
    setEquipment(equipment: (builder: EquipmentBuilder) => EquipmentBuilder): this;
    setEquipment(equipment: StartingEquipment[] | EquipmentBuilder | BuilderCallback<EquipmentBuilder>): this {
        if (Array.isArray(equipment)) {
            this._body.eq = super._deepCopy(equipment);
        } else if (typeof equipment === "function") {
            this._body.eq = equipment(new EquipmentBuilder()).toJSON();
        } else {
            this._body.eq = equipment.toJSON();
        }

        return this;
    }

    /**
     * Sets the possible "by location" placements for this CustomizerBuilder.
     *
     * @param loc A record of locations and their item placements.
     * @returns The current object for chaining.
     * @example
     * ```js
     * import { CustomizerBuilder, Item, ItemLocation } from "nottpr";
     * const builder = new CustomizerBuilder()
     *     .setLocations({
     *         [ItemLocation.Pedestal]: Item.IceRod, // Hardsets ice rod at pedestal
     *     });
     * ```
     * @see {@link CustomizerBuilder.setForcedItems()}
     */
    setLocations(loc: LocationMap): this {
        this._body.l = loc;
        return this;
    }

    /**
     * Sets the possible "by item" placements for this CustomizerBuilder.
     *
     * Item placements are specified as a rest parameter of single-entry
     * records. Placements are specified an array of locations.
     *
     * @param loc A rest argument of single-entry records containing items and
     * their possible location placements.
     * @returns The current object for chaining.
     * @example
     * ```js
     * import { CustomizerBuilder, Item, ItemLocation } from "nottpr";
     * const builder = new CustomizerBuilder()
     *     .setForcedItems(
     *         // Bombos placed at either Aginah or Bob's torch
     *         { [Item.Bombos]: [ItemLocation.Aginah, ItemLocation.GanonBobsTorch] },
     *     );
     * ```
     * @see {@link CustomizerBuilder.setLocations()}
     */
    setForcedItems(...loc: ForcedItem[]): this {
        const result: ItemTuple[] = [];
        for (const entry of loc) {
            for (const kv of Object.entries(entry) as ItemTuple[]) {
                result.push(kv);
            }
        }
        this.#forcedItems = result;
        return this;
    }

    /**
     * Sets the dialog modifications for this CustomizerBuilder.
     *
     * @param texts A record of dialog boxes to modify.
     * @returns The current object for chaining.
     * @example
     * ```js
     * // Setting the Triforce text:
     * import { CustomizerBuilder, TextDialog } from "nottpr";
     *
     * const preset = new CustomizerBuilder()
     *     .setTexts({
     *         [TextDialog.TriforceText]: "Hello World!"
     *     });
     * ```
     */
    setTexts(texts: TextMap): this {
        this._body.texts = super._deepCopy(texts);
        return this;
    }

    /**
     * Sets the custom settings portion of this CustomizerBuilder.
     *
     * This portion of the customizer is the most exhaustive. Refer to the
     * {@link CustomSettingsBuilder} class for more intricate documentation.
     *
     * @param custom The custom options. This argument can be passed as an
     * object literal, a CustomSettingsBuilder, or a callback function.
     * @returns The current object for chaining.
     */
    setCustom(custom: CustomSettingsBuilder): this;
    setCustom(custom: DeepPartial<CustomOptions>): this;
    setCustom(custom: (builder: CustomSettingsBuilder) => CustomSettingsBuilder): this;
    setCustom(custom: DeepPartial<CustomOptions> | CustomSettingsBuilder | BuilderCallback<CustomSettingsBuilder>): this {
        if (typeof custom === "function") {
            this._body.custom = custom(new CustomSettingsBuilder()).toJSON();
        } else if (custom instanceof CustomSettingsBuilder) {
            this._body.custom = custom.toJSON();
        } else {
            this._body.custom = { ...custom };
        }
        return this;
    }

    /**
     * Sets the prize packs for this CustomizerBuilder.
     *
     * @param drops The replacement prize packs. This argument can be passed as
     * a partial object literal, a PrizePackBuilder, or a callback function.
     * @returns The current object for chaining.
     */
    setDrops(drops: PrizePackBuilder): this;
    setDrops(drops: Partial<PrizePackGroups>): this;
    setDrops(drops: (builder: PrizePackBuilder) => PrizePackBuilder): this;
    setDrops(drops: Partial<PrizePackGroups> | PrizePackBuilder | BuilderCallback<PrizePackBuilder>): this {
        if (typeof drops === "function") {
            drops = drops(new PrizePackBuilder()).toJSON();
        } else if (drops instanceof PrizePackBuilder) {
            drops = drops.toJSON();
        } else {
            drops = new PrizePackBuilder(drops).toJSON();
        }

        this._body.drops = super._deepCopy(drops);
        return this;
    }

    /**
     * Returns the JSON representation of this CustomizerBuilder.
     *
     * If `setForcedItems` is used on this builder, this method will also roll
     * the locations for those respective items.
     *
     * @returns The JSON representation of this CustomizerBuilder.
     */
    override toJSON(): CustomizerPayload {
        const res = super._deepMerge(super._deepCopy(CustomizerBuilder.#default), super.toJSON());
        if (this.#forcedItems.length > 0) {
            res.l = this.#rollLocations();
        }
        return res;
    }

    override toYAML(complete?: boolean): string {
        const struct: Partial<NottprYAML> = {
            customizer: true,
            forced_locations: [],
        };
        if (complete) {
            const hold = this.#forcedItems;
            this.#forcedItems = [];
            struct.settings = this.toJSON();
            this.#forcedItems = hold;
        } else {
            struct.settings = this._body;
        }

        for (const [k, v] of this.#forcedItems) {
            struct.forced_locations.push({
                item: k,
                locations: v,
            });
        }

        return yaml.stringify(struct);
    }

    #rollLocations(): LocationMap {
        const pick = (arr: unknown[]) => Math.floor(Math.random() * arr.length);
        const result: LocationMap = super._deepCopy(this._body.l);
        const remaining = super._deepCopy(this.#forcedItems);

        while (remaining.length != 0) {
            const randInd = pick(remaining);
            const [item, locs] = remaining[randInd];
            let ok = false;
            while (!ok) {
                if (!locs.length) { // If all the possible locations are used up
                    throw new Error(`Unable to place ${item}: Ran out of locations.`);
                }

                const randLoc = pick(locs);
                if (result[locs[randLoc]]) { // Location is already occupied
                    locs.splice(randLoc, 1); // Remove the location so it can't be rolled again
                } else {
                    result[locs[randLoc]] = item as never;
                    ok = true;
                }
            }
            remaining.splice(randInd, 1);
        }

        return result;
    }

    static #createDefault(): CustomizerPayload {
        return Object.assign(this.prototype._deepCopy(baseDefault), customizerDefault) as CustomizerPayload;
    }
}

type ForcedItem = Partial<Record<Item, ItemLocation[]> |
    Record<Bottle, BottleLocation[]> |
    Record<Medallion, MedallionLocation[]> |
    Record<Prize, PrizeLocation[]>>;

type LocTuple<Type, Pool> = [Type, Pool[]];

type ItemTuple = LocTuple<Item, ItemLocation> | LocTuple<Bottle, BottleLocation> | LocTuple<Medallion, MedallionLocation> | LocTuple<Prize, PrizeLocation>;
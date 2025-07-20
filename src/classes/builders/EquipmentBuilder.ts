import JSONTranslatable from "../interfaces/JSONTranslatable.js";
import { Item } from "../../types/enums.js";
import { RupeeAmount, StartingEquipment } from "../../types/strings.js";

/**
 * An instance of this class describes a set of starting equipment for a
 * customizer seed.
 *
 * Several methods are designed as syntactic sugar either to expose popular
 * starting options, or for ease of use.
 */
export default class EquipmentBuilder
    implements JSONTranslatable<StartingEquipment[]> {
    static readonly #rupeeMap: Record<number, RupeeAmount> = {
        300: "ThreeHundredRupees",
        100: "OneHundredRupees",
        50: "FiftyRupees",
        20: "TwentyRupees",
        5: "FiveRupees",
        1: "OneRupee",
    };

    static readonly #MAX_CAP = 40;

    #hearts = 3;
    #rupees = 0;
    #arrows = 0;
    #bombs = 0;
    #startingBoots = false;
    #swords = 0;
    #shields = 0;
    #armor = 0;
    #glove = 0;
    #bow = 0;
    #eq: StartingEquipment[] = [];

    /**
     * Constructs a new EquipmentBuilder. An optional array can be passed to
     * set the starting equipment directly.
     *
     * If an array is passed, the class instance will be constructed using
     * {@link setEquipmentSafe()}.
     *
     * @param equipment Starting equipment to add to this builder.
     */
    constructor(equipment?: StartingEquipment[]) {
        if (Array.isArray(equipment)) {
            this.setEquipmentSafe(equipment);
        }
    }

    get hearts(): number {
        return this.#hearts;
    }

    get rupees(): number {
        return this.#rupees;
    }

    get arrowUpgrades(): number {
        return this.#arrows;
    }

    get bombUpgrades(): number {
        return this.#bombs;
    }

    get startingBoots(): boolean {
        return this.#startingBoots;
    }

    get swords(): number {
        return this.#swords;
    }

    get shields(): number {
        return this.#shields;
    }

    get armor(): number {
        return this.#armor;
    }

    get glove(): number {
        return this.#glove;
    }

    get bow(): number {
        return this.#bow;
    }

    get equipment(): ReadonlyArray<StartingEquipment> {
        return Array.from(this.#eq);
    }

    /**
     * Sets whether the Pegasus Boots will be in the starting equipment. This
     * method is syntactic sugar for the following (assuming `boots == true`):
     * ```js
     * const builder = new EquipmentBuilder()
     *     .setEquipment(["PegasusBoots"]);
     * ```
     *
     * @param boots Should boots be in the starting equipment?
     * @returns The current object for chaining.
     */
    setStartingBoots(boots: boolean): this {
        this.#startingBoots = boots;
        return this;
    }

    /**
     * Replaces the stored starting equipment array with the provided one.
     *
     * This method is the slow version of {@link setEquipment()}. Compared
     * to the normal version, this method scans the passed array for boots,
     * heart containers, rupees, capacity upgrades, and progressive equipment;
     * removes those entries from the array and updates any corresponding
     * variables; then sets the starting equipment array to the mutated
     * argument.
     *
     * **LIMITATION**: Regarding swords and other progressive equipment, this
     * method intentionally does not process hardset items like "PowerGlove" or
     * "MirrorShield". It is intended to be used with progressive items.
     *
     * @param equipment The new starting equipment.
     * @returns The current object for chaining.
     * @see {@link setEquipment()}
     */
    setEquipmentSafe(equipment: StartingEquipment[]): this {
        let newHP = 0;
        let newRup = 0;
        let newBom = 0;
        let newArr = 0;
        let newSrd = 0;
        let newArm = 0;
        let newShl = 0;
        let newGlv = 0;
        let newBow = 0;
        for (let i = 0; i < equipment.length;) {
            let found = false;
            const eq = equipment[i];
            if (eq === Item.PegasusBoots) {
                this.#startingBoots = true;
                found = true;
            } else if (eq === Item.HeartContainer) {
                ++newHP;
                found = true;
            } else if (eq === Item.ProgressiveArmor) {
                ++newArm;
                found = true;
            } else if (eq === Item.ProgressiveShield) {
                ++newShl;
                found = true;
            } else if (eq === Item.ProgressiveSword) {
                ++newSrd;
                found = true;
            } else if (eq === Item.ProgressiveGlove) {
                ++newGlv;
                found = true;
            } else if (eq === Item.ProgressiveBow) {
                ++newBow;
                found = true;
            } else if (eq.includes("Rupee")) {
                found = true;
                switch (eq.slice(0, eq.indexOf("R") - 1)) {
                    case "One": newRup += 1; break;
                    case "Five": newRup += 5; break;
                    case "Twenty": newRup += 20; break;
                    case "Fifty": newRup += 50; break;
                    case "OneHundred": newRup += 100; break;
                    case "ThreeHundred": newRup += 300; break;
                }
            } else if (eq.endsWith("0") || eq.endsWith("e5")) {
                found = true;
                const toAdd = eq.endsWith("0") ? 10 : 5;
                if (eq.startsWith("A")) {
                    newArr += toAdd;
                } else {
                    newBom += toAdd;
                }
            }

            if (found) { // don't change index since everything is shifted back
                equipment.splice(i, 1);
            } else { // This item is OK; move to n
                ++i;
            }
        }

        // We'll just assume these values are correct. If an incorrect use of
        // the method causes a generation failure, that's not our problem.
        if (newHP) this.#hearts = newHP;
        if (newRup) this.#rupees = newRup;
        if (newBom) this.#bombs = newBom;
        if (newArr) this.#arrows = newArr;
        if (newArm) this.#armor = newArm;
        if (newGlv) this.#glove = newGlv;
        if (newShl) this.#shields = newShl;
        if (newSrd) this.#swords = newSrd;
        if (newBow) this.#bow = newBow;

        return this.setEquipment(equipment);
    }

    /**
     * Replaces the stored starting equipment array with the provided one.
     *
     * This method is the fast version of {@link setEquipmentSafe()} and is
     * almost always the better of the two to use in most situations.
     *
     * setEquipment only updates the starting array. It does not change any
     * values that are otherwise affected by sugar methods. As such, using
     * setter methods such as {@link setStartingHearts()} in combination with
     * this method can yield unexpected results.
     *
     * @param equipment The new starting equipment.
     * @returns The current object for chaining.
     * @example
     * ```js
     * const b1 = new EquipmentBuilder()
     *     .setStartingBoots(true)
     *     .setEquipment(["OcarinaActive"]);
     * const b2 = new EquipmentBuilder()
     *     .setEquipmentSafe(["PegasusBoots", "OcarinaActive"]);
     * console.log(b1.toJSON() === b2.toJSON()); // true
     * ```
     * @see {@link setEquipmentSafe()}
     */
    setEquipment(equipment: StartingEquipment[]): this {
        this.#eq = Array.from(equipment);
        return this;
    }

    /**
     * Sets the arrow capacity upgrade amount. The value must be in range [0,40]
     * and be divisible by 5.
     *
     * @param arrows The starting arrow capacity extension.
     * @returns The current object for chaining.
     */
    setArrowUpgrades(arrows: number): this {
        arrows = Math.floor(arrows);
        if (arrows % 5 !== 0) {
            throw new Error("arrows parameter must be an increment of 5.");
        } else if (arrows < 0 || arrows > EquipmentBuilder.#MAX_CAP) {
            throw new RangeError("Arrow quantity out of range.");
        }
        this.#arrows = arrows;
        return this;
    }

    /**
     * Sets the bomb capacity upgrade amount. The value must be in range [0,40]
     * and be divisible by 5.
     *
     * @param bombs The starting bomb capacity extension.
     * @returns The current object for chaining.
     */
    setBombUpgrades(bombs: number): this {
        bombs = Math.floor(bombs);
        if (bombs % 5 !== 0) {
            throw new Error("bombs parameter must be an increment of 5.");
        } else if (bombs < 0 || bombs > EquipmentBuilder.#MAX_CAP) {
            throw new RangeError("Bomb quantity out of range.");
        }
        this.#bombs = bombs;
        return this;
    }

    /**
     * Sets the number of starting heart containers. Value must be in range
     * [1,20].
     *
     * @param hearts The count of starting heart containers.
     * @returns The current object for chaining.
     */
    setStartingHearts(hearts: number): this {
        hearts = Math.floor(hearts);
        if (hearts < 1 || hearts > 20) {
            throw new RangeError("Heart quantity out of range.");
        }
        this.#hearts = hearts;
        return this;
    }

    /**
     * Sets the starting rupee amount. Value must be in range [0,9999].
     *
     * @param rupees The starting rupee amount.
     * @returns The current object for chaining.
     */
    setStartingRupees(rupees: number): this {
        rupees = Math.floor(rupees);
        if (rupees < 0 || rupees > 9999) {
            throw new RangeError("Rupee amount out of range.");
        }
        this.#rupees = rupees;
        return this;
    }

    /**
     * Sets the starting sword level. Value must be in range [0,4].
     *
     * @param swords The starting sword level.
     * @returns The current object for chaining.
     */
    setSwords(swords: number): this {
        swords = Math.floor(swords);
        if (swords < 0 || swords > 4) {
            throw new RangeError("Sword count out of range.");
        }
        this.#swords = swords;
        return this;
    }

    /**
     * Sets the starting shield level. Value must be in range [0,3].
     *
     * @param shields The starting shield level.
     * @returns The current object for chaining.
     */
    setShields(shields: number): this {
        shields = Math.floor(shields);
        if (shields < 0 || shields > 3) {
            throw new RangeError("Shield count out of range.");
        }
        this.#shields = shields;
        return this;
    }

    /**
     * Sets the starting armor level. Value must be in range [0,2].
     *
     * @param armor The starting armor level.
     * @returns The current object for chaining.
     */
    setArmor(armor: number): this {
        armor = Math.floor(armor);
        if (armor < 0 || armor > 2) {
            throw new RangeError("Armor count out of range.");
        }
        this.#armor = armor;
        return this;
    }

    /**
     * Sets the starting lift level. Value must be in range [0,2].
     *
     * @param glove The starting lift level.
     * @returns The current object for chaining.
     */
    setGlove(glove: number): this {
        glove = Math.floor(glove);
        if (glove < 0 || glove > 2) {
            throw new RangeError("Glove count out of range.");
        }
        this.#glove = glove;
        return this;
    }

    /**
     * Sets the starting bow level. Value must be in range [0,2].
     *
     * @param bow The starting bow level.
     * @returns The current object for chaining.
     */
    setBow(bow: number): this {
        bow = Math.floor(bow);
        if (bow < 0 || bow > 2) {
            throw new RangeError("Bow count out of range.");
        }
        this.#bow = bow;
        return this;
    }

    /**
     * Returns a JSON representation of this EquipmentBuilder.
     *
     * @returns A JSON object.
     */
    toJSON(): StartingEquipment[] {
        const equipment = Array.from(this.#eq);
        let {
            hearts,
            arrowUpgrades: arrows,
            bombUpgrades: bombs,
            swords,
            shields,
            armor,
            glove,
            bow,
        } = this;

        if (this.startingBoots) {
            equipment.push(Item.PegasusBoots);
        }

        seqPush(hearts, Item.HeartContainer);
        seqPush(swords, Item.ProgressiveSword);
        seqPush(shields, Item.ProgressiveShield);
        seqPush(armor, Item.ProgressiveArmor);
        seqPush(glove, Item.ProgressiveGlove);
        seqPush(bow, Item.ProgressiveBow);
        capPush(arrows, [Item.ArrowUpgrade5, Item.ArrowUpgrade10]);
        capPush(bombs, [Item.BombUpgrade5, Item.BombUpgrade10]);

        if (this.rupees > 0) {
            equipment.push(...this.#rupeeArray());
        }

        return equipment;

        function capPush(val: number, [item5, item10]: [Item, Item]): void {
            if (val % 10 !== 0) {
                equipment.push(item5 as StartingEquipment);
            }
            val /= 10;
            seqPush(val, item10);
        }
        function seqPush(val: number, item: Item): void {
            while (val > 0) {
                equipment.push(item as StartingEquipment);
                --val;
            }
        }
    }

    #rupeeArray(): RupeeAmount[] {
        let remaining = this.#rupees;
        const array: RupeeAmount[] = [];
        for (const [key, value] of Object.entries(EquipmentBuilder.#rupeeMap).reverse()) {
            const amount = parseInt(key);
            let r = Math.floor(remaining / amount);
            while (r > 0) {
                array.push(value);
                --r;
            }
            remaining %= amount;
        }
        return array;
    }
}
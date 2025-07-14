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

    get equipment(): StartingEquipment[] {
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
     * @returns The current object, for chaining.
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
     * heart containers, rupees, and capacity upgrades; removes those entries
     * from the array and updates any corresponding variables; then sets
     * the starting equipment array to the mutated argument.
     *
     * @param equipment The new starting equipment.
     * @returns The current object, for chaining.
     * @see {@link setEquipment()}
     */
    setEquipmentSafe(equipment: StartingEquipment[]): this {
        let newHP = 0;
        let newRup = 0;
        let newBom = 0;
        let newArr = 0;
        for (let i = 0; i < equipment.length;) {
            let found = false;
            const eq = equipment[i];
            if (eq === Item.PegasusBoots) {
                this.#startingBoots = true;
                found = true;
            } else if (eq === Item.HeartContainer) {
                ++newHP;
                found = true;
            } else if (eq.includes("Rupee")) {
                found = true;
                switch (eq.slice(0, eq.indexOf("R") - 1)) {
                    case "One": newRup += 1;
                        break;
                    case "Five": newRup += 5;
                        break;
                    case "Twenty": newRup += 20;
                        break;
                    case "Fifty": newRup += 50;
                        break;
                    case "OneHundred": newRup += 100;
                        break;
                    case "ThreeHundred": newRup += 300;
                        break;
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

        if (newHP) {
            this.#hearts = newHP;
        }
        if (newRup) {
            this.#rupees = newRup;
        }
        if (newBom) {
            this.#bombs = newBom;
        }
        if (newArr) {
            this.#arrows = newArr;
        }

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
     * @returns The current object, for chaining.
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
     * @returns The current object, for chaining.
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
     * @returns The current object, for chaining.
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
     * @returns The current object, for chaining.
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
     * @returns The current object, for chaining.
     */
    setStartingRupees(rupees: number): this {
        rupees = Math.floor(rupees);

        if (rupees < 0 || rupees > 9999) {
            throw new RangeError("Rupee amount out of range.");
        }

        this.#rupees = rupees;
        return this;
    }

    toJSON(): StartingEquipment[] {
        const { equipment } = this;

        if (this.startingBoots) {
            equipment.push(Item.PegasusBoots);
        }

        let { hearts } = this;
        while (hearts > 0) {
            equipment.push(Item.HeartContainer);
            --hearts;
        }

        let { arrowUpgrades: arrows } = this;
        if (arrows % 10 !== 0) {
            equipment.push(Item.ArrowUpgrade5);
            arrows -= 5;
        }
        arrows /= 10;
        while (arrows > 0) {
            equipment.push(Item.ArrowUpgrade10);
            --arrows;
        }

        let { bombUpgrades: bombs } = this;
        if (bombs % 10 !== 0) {
            equipment.push(Item.BombUpgrade5);
            bombs -= 5;
        }
        bombs /= 10;
        while (arrows > 0) {
            equipment.push(Item.BombUpgrade10);
            --bombs;
        }

        if (this.rupees > 0) {
            equipment.push(...this.#rupeeArray());
        }

        return equipment;
    }

    #rupeeArray(): RupeeAmount[] {
        let remaining = this.#rupees;
        const array: RupeeAmount[] = [];

        for (const key of Object.keys(EquipmentBuilder.#rupeeMap)) {
            const amount = parseInt(key);
            let r = Math.floor(remaining / amount);

            while (r > 0) {
                array.push(EquipmentBuilder.#rupeeMap[amount]);
                --r;
            }

            remaining %= amount;
        }

        return array;
    }
}
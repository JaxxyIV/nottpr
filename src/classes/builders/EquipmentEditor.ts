import { Equipment, RupeeAmount, StartingEquipment } from "../../types/strings";

export default class EquipmentEditor {
    static #rupeeMap: Record<number, RupeeAmount> = {
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

    setStartingBoots(boots: boolean): this {
        this.#startingBoots = boots;
        return this;
    }

    setStartingEquipment(eq: string[]): this {

        return this;
    }

    setArrowUpgrades(arrows: number): this {
        arrows = Math.floor(arrows);

        if (arrows % 5 !== 0) {
            throw new Error("arrows parameter must be an increment of 5.");
        } else if (arrows < 0 || arrows > EquipmentEditor.#MAX_CAP) {
            throw new RangeError("Arrow quantity out of range.");
        }

        this.#arrows = arrows;
        return this;
    }

    setBombUpgrades(bombs: number): this {
        bombs = Math.floor(bombs);

        if (bombs % 5 !== 0) {
            throw new Error("bombs parameter must be an increment of 5.");
        } else if (bombs < 0 || bombs > EquipmentEditor.#MAX_CAP) {
            throw new RangeError("Bomb quantity out of range.");
        }

        this.#bombs = bombs;
        return this;
    }

    setStartingHearts(hearts: number): this {
        hearts = Math.floor(hearts);

        if (hearts < 1 || hearts > 20) {
            throw new RangeError("Heart quantity out of range.");
        }

        this.#hearts = hearts;
        return this;
    }

    setStartingRupees(rupees: number): this {
        rupees = Math.floor(rupees);

        if (rupees < 0 || rupees > 9999) {
            throw new RangeError("Rupee amount out of range.");
        }

        this.#rupees = rupees;
        return this;
    }

    toArray(): StartingEquipment[] {
        const array: StartingEquipment[] = [];

        for (let h = 1; h <= this.#hearts; ++h) {
            array.push("BossHeartContainer");
        }

        array.push(...this.#rupeesToArray());


        return array;
    }

    #rupeesToArray(): RupeeAmount[] {
        let remaining = this.#rupees;
        const array: RupeeAmount[] = [];

        for (const key of Object.keys(EquipmentEditor.#rupeeMap)) {
            const amount = parseInt(key);
            let r = Math.floor(remaining / amount);

            while (r > 0) {
                array.push(EquipmentEditor.#rupeeMap[amount]);
                --r;
            }

            remaining %= amount;
        }

        return array;
    }
}
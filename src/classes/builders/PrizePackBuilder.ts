import BaseBuilder from "./BaseBuilder.js";
import { Drop, EnemyGroup } from "../../types/enums.js";
import { PrizePackGroups } from "../../types/structures.js";

/**
 * An instance of this class represents a prize pack collection to be supplied
 * to alttpr.com's customizer API.
 *
 * This class is not useful on its own. It is intended to be used in tandem
 * with a CustomizerBuilder.
 */
export default class PrizePackBuilder
    extends BaseBuilder<PrizePackGroups> {

    constructor(packs?: Partial<PrizePackGroups>) {
        super();
        if (!packs) return;
        this._body = { ...packs };
    }

    getPack(pack: EnemyGroup): ReadonlyArray<Drop> {
        const g = PrizePackBuilder.#groupToIndex(pack);
        return this.#check(g);
    }

    get treePull(): ReadonlyArray<Drop> {
        return this.#check("pull");
    }

    get crab(): ReadonlyArray<Drop> {
        return this.#check("crab");
    }

    get stun(): Drop {
        return this._body.stun?.[0];
    }

    get fish(): Drop {
        return this._body.fish?.[0];
    }

    /**
     * Sets the prize pack contents for a particular enemy group.
     *
     * @param group The enemy group to edit.
     * @param pack An array containing up to 8 `Drop` values. If the length of
     * `pack` is less than 8, the omitted values will default to `Drop.Random`.
     * @returns The current object for chaining.
     */
    setPack(group: EnemyGroup, pack: Drop[]): this {
        const g = PrizePackBuilder.#groupToIndex(group);
        if (!Array.isArray(this._body[g])) {
            this._body[g] = [];
        }
        for (let i = 0; i < 8; ++i) {
            this._body[g][i] = pack[i] ?? Drop.Random;
        }
        return this;
    }

    /**
     * Sets the tree pull tiers for this PrizePackBuilder.
     *
     * @param pull A rest parameter of the prizes for each tier. Up to three
     * values can be passed. Omitted values will default to `Drop.Random`.
     * @returns The current object for chaining.
     */
    setTreePull(...pull: Drop[]): this {
        if (!Array.isArray(this._body.pull)) {
            this._body.pull = [];
        }
        for (let i = 0; i < 3; ++i) {
            this._body.pull[i] = pull[i] ?? Drop.Random;
        }
        return this;
    }

    /**
     * Sets the crab prizes for this PrizePackBuilder.
     *
     * @param main The main prize drop.
     * @param last The last prize drop. Defaults to `main` if not specified.
     * @returns The current object for chaining.
     */
    setCrab(main: Drop, last = main): this {
        if (!Array.isArray(this._body.crab)) {
            this._body.crab = [];
        }
        this._body.crab[0] = main;
        this._body.crab[1] = last;
        return this;
    }

    /**
     * Sets the stun prize for this PrizePackBuilder.
     *
     * @param stun The stun prize.
     * @returns The current object for chaining.
     */
    setStun(stun: Drop): this {
        if (!Array.isArray(this._body.stun)) {
            this._body.stun = [];
        }
        this._body.stun[0] = stun;
        return this;
    }

    /**
     * Sets the prize for throwing a fish into water.
     *
     * @param fish The fish prize.
     * @returns The current object for chaining.
     */
    setFish(fish: Drop): this {
        if (!Array.isArray(this._body.fish)) {
            this._body.fish = [];
        }
        this._body.fish[0] = fish;
        return this;
    }

    static #groupToIndex(group: EnemyGroup): keyof PrizePackGroups & number {
        return Object.values(EnemyGroup)
            .findIndex(g => g === group) as keyof PrizePackGroups & number;
    }

    #check(key: keyof typeof this._body): Drop[] {
        return Array.isArray(this._body[key])
            ? super._deepCopy(this._body[key])
            : [];
    }
}
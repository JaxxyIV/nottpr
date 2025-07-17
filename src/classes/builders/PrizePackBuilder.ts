import BaseBuilder from "./BaseBuilder.js";
import { Drop, EnemyGroup } from "../../types/enums.js";
import {
    CrabTuple,
    PackTuple,
    PrizePackGroups,
    TreePullTuple,
} from "../../types/structures.js";
import { customizerDefault } from "../../types/symbol/payloads.js";

export default class PrizePackBuilder
    extends BaseBuilder<PrizePackGroups> {
    static readonly #def = customizerDefault.drops;

    constructor(packs?: Partial<PrizePackGroups>) {
        super();
        this._body = super._deepCopy(PrizePackBuilder.#def);

        for (const key of Object.keys(packs) as (keyof PrizePackGroups)[]) {
            for (let i = 0; i < packs[key].length; ++i) {
                this._body[key][i] = packs[key][i];
            }
        }
    }

    getPack(pack: EnemyGroup): Readonly<PackTuple> {
        const g = PrizePackBuilder.#groupToIndex(pack);
        return super._deepCopy(this._body[g]);
    }

    get treePull(): Readonly<TreePullTuple> {
        return super._deepCopy(this._body.pull);
    }

    get crab(): Readonly<CrabTuple> {
        return super._deepCopy(this._body.crab);
    }

    get stun(): Drop {
        return this._body.stun[0];
    }

    get fish(): Drop {
        return this._body.fish[0];
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
        for (let i = 0; i < this._body[g].length; ++i) {
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
        for (let i = 0; i < this._body.pull.length; ++i) {
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
        this._body.crab[0] = main;
        this._body.crab[1] = last;
        return this;
    }

    setStun(stun: Drop): this {
        this._body.stun[0] = stun;
        return this;
    }

    setFish(fish: Drop): this {
        this._body.fish[0] = fish;
        return this;
    }

    static #groupToIndex(group: EnemyGroup): keyof PrizePackGroups & number {
        return Object.values(EnemyGroup)
            .findIndex(g => g === group) as keyof PrizePackGroups & number;
    }
}
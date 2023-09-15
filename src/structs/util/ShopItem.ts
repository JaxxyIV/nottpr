import { ShopItemData } from "../../types/apiStructs";

export default class ShopItem {
    #item: string;
    #price: number;
    constructor(json: ShopItemData) {
        ({
            item: this.#item,
            price: this.#price,
        } = json);
    }

    get item(): string {
        return this.#item;
    }

    get price(): number {
        return this.#price;
    }

    get [Symbol.toStringTag](): string {
        return "ShopItem";
    }
}
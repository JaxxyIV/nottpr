import { ShopData, ShopItemData } from "../../types/apiStructs";
import ShopItem from "./ShopItem";

export default class Shop {
    #location: string;
    #type: string;
    #item_0: string | ShopItem;
    #item_1: string | ShopItem;
    #item_2?: string | ShopItem;

    constructor(json: ShopData) {
        ({
            location: this.#location,
            type: this.#type
        } = json);

        if (typeof json.item_0 === "string" && typeof json.item_1 === "string") {
            ({
                item_0: this.#item_0,
                item_1: this.#item_1
            } = json);
        } else {
            this.#item_0 = new ShopItem(json.item_0 as ShopItemData);
            this.#item_1 = new ShopItem(json.item_1 as ShopItemData);
        }

        switch (typeof json.item_2) {
            case "string":
                ({ item_2: this.#item_2 } = json);
                break;
            case "undefined":
                this.#item_2 = undefined;
                break;
            case "object":
            default:
                this.#item_2 = new ShopItem(json.item_2);
                break;
        }
    }

    get location(): string {
        return this.#location;
    }

    get type(): string {
        return this.#type;
    }

    get item0(): string | ShopItem {
        return this.#item_0;
    }

    get item1(): string | ShopItem {
        return this.#item_1;
    }

    get item2(): string | ShopItem | undefined {
        return this.#item_2;
    }
}
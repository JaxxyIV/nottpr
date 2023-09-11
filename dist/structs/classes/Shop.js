import ShopItem from "./ShopItem.js";
export default class Shop {
    #location;
    #type;
    #item_0;
    #item_1;
    #item_2;
    constructor(json) {
        ({
            location: this.#location,
            type: this.#type
        } = json);
        if (typeof json.item_0 === "string" && typeof json.item_1 === "string") {
            ({
                item_0: this.#item_0,
                item_1: this.#item_1
            } = json);
        }
        else {
            this.#item_0 = new ShopItem(json.item_0);
            this.#item_1 = new ShopItem(json.item_1);
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
    get location() {
        return this.#location;
    }
    get type() {
        return this.#type;
    }
    get item0() {
        return this.#item_0;
    }
    get item1() {
        return this.#item_1;
    }
    get item2() {
        return this.#item_2;
    }
    get [Symbol.toStringTag]() {
        return "Shop";
    }
}

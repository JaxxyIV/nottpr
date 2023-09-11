export default class ShopItem {
    #item;
    #price;
    constructor(json) {
        ({
            item: this.#item,
            price: this.#price,
        } = json);
    }
    get item() {
        return this.#item;
    }
    get price() {
        return this.#price;
    }
    get [Symbol.toStringTag]() {
        return "ShopItem";
    }
}

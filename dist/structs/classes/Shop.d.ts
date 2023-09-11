import { ShopData } from "../../types/apiStructs";
import ShopItem from "./ShopItem";
export default class Shop {
    #private;
    constructor(json: ShopData);
    get location(): string;
    get type(): string;
    get item0(): string | ShopItem;
    get item1(): string | ShopItem;
    get item2(): string | ShopItem | undefined;
    get [Symbol.toStringTag](): string;
}

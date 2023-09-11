import { ShopItemData } from "../../types/apiStructs";
export default class ShopItem {
    #private;
    constructor(json: ShopItemData);
    get item(): string;
    get price(): number;
    get [Symbol.toStringTag](): string;
}

import { BasePayload, CustomizerPayload, PrizePackGroups } from "../../types/apiStructs";
import { Item } from "../../types/types";
import JSONTranslatable from "../interfaces/JSONTranslatable";
import BaseSeedBuilder from "./BaseSeedBuilder";
import CustomizerCustomBuilder from "./CustomizerCustomBuilder";
import CustomizerDropsBuilder from "./CustomizerDropsBuilder";

export default class CustomizerBuilder extends BaseSeedBuilder implements JSONTranslatable {
    #custom?: CustomizerCustomBuilder;
    #drops?: CustomizerDropsBuilder;
    #eq?: Array<Item>;
    #l?: {
        [x: string]: string
    };
    #texts?: {
        [x: string]: string
    };

    constructor() {
        super();
    }

    get custom(): CustomizerCustomBuilder {
        return this.#custom;
    }

    get drops(): CustomizerDropsBuilder {
        return this.#drops;
    }

    get eq(): Array<Item> {
        return JSON.parse(JSON.stringify(this.#eq));
    }

    get l(): { [x: string]: string } {
        return JSON.parse(JSON.stringify(this.#l ?? {}));
    }

    get texts(): { [x: string]: string } {
        return JSON.parse(JSON.stringify(this.#texts ?? {}));
    }

    setCustom(custom: ((builder: CustomizerCustomBuilder) => CustomizerCustomBuilder) | CustomizerCustomBuilder): this {
        if (typeof custom === "function") {
            this.#custom = custom(new CustomizerCustomBuilder());
        } else {
            this.#custom = custom;
        }
        return this;
    }

    setDrops(drops: ((builder: CustomizerDropsBuilder) => CustomizerDropsBuilder) | CustomizerDropsBuilder): this {
        if (typeof drops === "function") {
            this.#drops = drops(new CustomizerDropsBuilder());
        } else {
            this.#drops = drops;
        }
        return this;
    }

    setEq(eq: Array<Item>): this {
        this.#eq = JSON.parse(JSON.stringify(eq));
        return this;
    }

    setL(l: { [x: string]: string }): this {
        this.#l = JSON.parse(JSON.stringify(l));
        return this;
    }

    setTexts(texts: { [x: string]: string }): this {
        this.#texts = JSON.parse(JSON.stringify(texts));
        return this;
    }

    toJSON(): CustomizerPayload {
        throw new Error("Method not implemented.");
        // const parent: BasePayload | CustomizerPayload = super.toJSON();
        // parent.custom as CustomizerPayload;
    }
}
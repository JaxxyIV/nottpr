import { PrizePackGroups } from "../../types/apiStructs";
import JSONTranslatable from "../interfaces/JSONTranslatable";

export default class CustomizerDropsBuilder implements JSONTranslatable {
    toJSON(): unknown {
        throw new Error("Method not implemented.");
    }

}
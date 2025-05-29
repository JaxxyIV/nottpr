import { CustomizerCustomOptions } from "../../types/apiStructs";
import JSONTranslatable from "../interfaces/JSONTranslatable";

export default class CustomizerCustomBuilder implements JSONTranslatable {
    toJSON(): unknown {
        throw new Error("Method not implemented.");
    }
}
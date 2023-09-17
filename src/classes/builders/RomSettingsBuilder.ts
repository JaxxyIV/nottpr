import BaseBuilder from "./BaseBuilder";
//import { RomSettings } from "../../types/types";

export default class RomSettingsBuilder extends BaseBuilder<string, any> {
    constructor(data?: RomOptions) {
        super();
    }
}

type RomOptions = {
    [x in string]: any;
}
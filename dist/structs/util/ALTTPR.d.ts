import { RandomizerPayload, CustomizerPayload } from "../../types/apiStructs";
import Seed from "../classes/Seed";
import Sprite from "../classes/Sprite";
import SeedBuilder from "../classes/SeedBuilder";
import CustomizerBuilder from "../classes/CustomizerBuilder";
export default class ALTTPR {
    #private;
    static randomizer(data: RandomizerAPIData): Promise<Seed>;
    static customizer(data: CustomizerAPIData): Promise<Seed>;
    static fetchDaily(): Promise<string>;
    static fetchSeed(hash: string, force?: boolean): Promise<Seed>;
    static fetchSprite(name: string): Promise<Sprite>;
}
type RandomizerAPIData = SeedBuilder | RandomizerPayload;
type CustomizerAPIData = CustomizerBuilder | CustomizerPayload;
export {};

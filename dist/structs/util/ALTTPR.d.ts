import { RandomizerPayload, CustomizerPayload } from "../../types/apiStructs";
import Seed from "../classes/Seed";
import Sprite from "../classes/Sprite";
import SeedBuilder from "../classes/SeedBuilder";
export default class ALTTPR {
    #private;
    static randomizer(payload: RandomizerAPIData): Promise<Seed>;
    static customizer(payload: CustomizerPayload): Promise<Seed>;
    static fetchDaily(): Promise<string>;
    static fetchSeed(hash: string, force?: boolean): Promise<Seed>;
    static fetchSprite(name: string): Promise<Sprite>;
}
type RandomizerAPIData = SeedBuilder | RandomizerPayload;
export {};

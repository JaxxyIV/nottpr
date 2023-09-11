import SeedBuilder from "./SeedBuilder.js";
import { unflatten } from "flat";
export default class MysteryWeightset {
    #weights = new Map;
    constructor() { }
    getWeight(key) {
        return this.#weights.get(key);
    }
    setWeight(key, weights) {
        for (const k in weights) {
            if (weights[k] < 0) {
                throw new Error(`Unexpected negative value for ${k} in ${key}`);
            }
            weights[k] = Math.round(weights[k]);
        }
        this.#weights.set(key, weights);
        return this;
    }
    select(showSettings = false) {
        let data = {};
        for (const [k, v] of this.#weights.entries()) {
            const arr = [];
            for (const key in v) {
                for (let i = 1; i <= v[key]; ++i) {
                    if (k === "allow_quickswap" || k === "pseudoboots") {
                        if (key.toLowerCase() === "true") {
                            arr.push(true);
                        }
                        else {
                            arr.push(false);
                        }
                    }
                    else {
                        arr.push(key);
                    }
                }
            }
            const sel = arr[Math.floor(Math.random() * arr.length)];
            data[k] = sel;
        }
        data = unflatten(data);
        return new SeedBuilder(data)
            .setTournament(true)
            .setSpoilers(showSettings ? "off" : "mystery");
    }
}

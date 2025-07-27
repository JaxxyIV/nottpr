import { DeepPartial } from "../../types/structures.js";
import JSONTranslatable from "../interfaces/JSONTranslatable.js";

export default class BaseBuilder<T>
    implements JSONTranslatable<T> {
    protected _body: DeepPartial<T> = {} as DeepPartial<T>;

    protected _deepCopy<S>(value: S): S {
        return JSON.parse(JSON.stringify(value));
    }

    toJSON(): T {
        return this._body as T;
    }
}
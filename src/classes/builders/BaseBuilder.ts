export default class BaseBuilder<K extends string, V> {
    protected _body: { [x in K]?: V } = {};

    protected _getProp(key: K): V {
        return this._body[key];
    }

    protected _setProp(key: K, value: V): this {
        this._body[key] = value;
        return this;
    }

    protected _deepCopy(value: V): V {
        return JSON.parse(JSON.stringify(value)) as V;
    }

    toJSON(): unknown {
        return this._body;
    }
}
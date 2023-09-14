export default class BaseBuilder<K extends string, V> {
    protected _body: { [x in K]?: V } = {};

    protected _getProp(key: K): V {
        return this._body[key];
    }

    protected _setProp(key: K, value: V): this {
        this._body[key] = value;
        return this;
    }

    toJSON(): { [x in K]?: V } {
        return this._body;
    }
}
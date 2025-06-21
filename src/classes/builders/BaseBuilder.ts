export default class BaseBuilder<K extends string> {
    protected _body: { [x in K]?: unknown } = {};

    protected _getProp(key: K): unknown {
        return this._body[key];
    }

    protected _setProp(key: K, value: unknown): this {
        this._body[key] = value;
        return this;
    }

    protected _deepCopy(value: unknown): unknown {
        return JSON.parse(JSON.stringify(value));
    }

    toJSON(): unknown {
        return this._body;
    }
}
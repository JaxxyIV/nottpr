export default class BaseBuilder {
    protected _body: { [x: string | number]: any } = {};

    constructor() { }

    protected _getProp(key: string | number): any {
        return this._body[key];
    }

    protected _setProp(key: string | number, value: any): this {
        this._body[key] = value;
        return this;
    }

    toJSON(): { [x: string | number]: any } {
        return this._body;
    }
}
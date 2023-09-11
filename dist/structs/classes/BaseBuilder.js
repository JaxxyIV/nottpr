export default class BaseBuilder {
    _body = {};
    constructor() { }
    _getProp(key) {
        return this._body[key];
    }
    _setProp(key, value) {
        this._body[key] = value;
        return this;
    }
    toJSON() {
        return this._body;
    }
}

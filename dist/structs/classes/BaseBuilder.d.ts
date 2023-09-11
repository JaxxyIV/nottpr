export default class BaseBuilder {
    protected _body: {
        [x: string | number]: any;
    };
    constructor();
    protected _getProp(key: string | number): any;
    protected _setProp(key: string | number, value: any): this;
    toJSON(): {
        [x: string | number]: any;
    };
}

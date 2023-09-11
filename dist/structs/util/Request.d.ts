export default class Request {
    #private;
    constructor(path: string);
    get(as: ResponseType): Promise<any>;
    post(body: any, as: ResponseType, headers?: HeadersInit): Promise<any>;
}
type ResponseType = "json" | "text" | "buffer";
export {};

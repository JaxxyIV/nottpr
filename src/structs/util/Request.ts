import fetch, { Response } from "node-fetch";

export default class Request {
    readonly #base_link: string = "https://alttpr.com";
    #path: string;

    constructor(path: string) {
        this.#path = path;
    }

    async get(as: ResponseType): Promise<any> {
        const response: Response = await fetch(this.#url);

        if (!response.ok) {
            const text: string = await response.text();
            throw new Error(text);
        }

        switch (as) {
            case "text":
                return response.text();
            case "buffer":
                return response.arrayBuffer();
            case "json":
            default:
                return response.json();
        }
    }

    async post(body: any, as: ResponseType, headers?: HeadersInit): Promise<any> {
        const response: Response = await fetch(this.#url, {
            method: "post",
            headers,
            body
        });

        if (!response.ok) {
            const text: string = await response.text();
            throw new Error(text);
        }

        switch (as) {
            case "text":
                return response.text();
            case "buffer":
                return response.arrayBuffer();
            case "json":
            default:
                return response.json();
        }
    }

    get #url(): string {
        return `${this.#base_link}${this.#path}`;
    }
}

type ResponseType = "json" | "text" | "buffer";
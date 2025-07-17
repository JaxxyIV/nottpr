export default class Request {
    static readonly #base_link = "https://alttpr.com";
    #path: string;

    constructor(path: string) {
        this.#path = path;
    }

    async get(as: ResponseType): Promise<unknown> {
        const response = await fetch(this.#url);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return as === "text" ? response.text()
            : as === "buffer" ? response.arrayBuffer()
            : response.json();
    }

    async post(body: BodyInit, as: ResponseType, headers?: HeadersInit): Promise<unknown> {
        const response: Response = await fetch(this.#url, {
            method: "post",
            headers,
            body,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return as === "text" ? response.text()
            : as === "buffer" ? response.arrayBuffer()
            : response.json();
    }

    get #url(): string {
        return `${Request.#base_link}${this.#path}`;
    }
}

type ResponseType = "json" | "text" | "buffer";
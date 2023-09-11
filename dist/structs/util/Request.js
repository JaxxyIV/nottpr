import fetch from "node-fetch";
export default class Request {
    #base_link = "https://alttpr.com";
    #path;
    constructor(path) {
        this.#path = path;
    }
    async get(as) {
        const response = await fetch(this.#url);
        if (!response.ok) {
            const text = await response.text();
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
    async post(body, as, headers) {
        const response = await fetch(this.#url, {
            method: "post",
            headers,
            body
        });
        if (!response.ok) {
            const text = await response.text();
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
    get #url() {
        return `${this.#base_link}${this.#path}`;
    }
}

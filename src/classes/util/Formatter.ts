import {
    TextPause,
    TextSpeed
} from "../../types/strings";

/**
 * An instance of this class represents a formatted text string designed to be
 * used in the texts portion of the alttpr.com customizer API.
 *
 * Some characters are reserved symbols in the text parser:
 * * "≥" is used for the cursor in select menus or yes/no dialogs.
 * * "@" is the first four characters of the player's save file name.
 * * ">" is used for Link's face.
 * * "%", "^", and "=" are the bird, ankh, and squigly line hyroglyphs.
 * * "¼", "½", "¾", and "♥" are used for heart piece dialogs (unused in rando).
 * * "ᚋ", "ᚌ", "ᚍ", and "ᚎ" are special variables used in only a handful of
 * dialogs (such as your time in race game).
 *
 * These characters can be symbolically referenced via the `SpecialChars` enum.
 *
 * Certain dialogs must be formatted in specific ways. For example, if you are
 * modifying an NPC dialog that normally has a yes/no choice, then the modified
 * dialog must contain a yes/no choice as well.
 *
 * Most instance methods have a built-in autoformatting functionality. This
 * functionality can be disabled either immediately in the constructor, or
 * through the `setAutoformat` method. When the autoformatter is on, your
 * inputs will be formatted according to the following guideline:
 * 1. The autoformatter will place as many words as it can on a single line
 * before going to a new line.
 * 2. The autoformatter will try to respect any new lines you include in your
 * input. However, it may format in a way you aren't expecting.
 */
export default class Formatter {
    static readonly #MAX_PER_LINE = 19;

    #text: string;
    #autoformat: boolean;

    constructor(text = "", autoformat = true) {
        this.setAutoformat(autoformat);
        if (Formatter.#getCharCount(text) > 0) {
            Formatter.#validateIncoming(text);
        }
        this.#text = text;
    }

    /**
     *
     * @returns
     */
    setAutoformat(autoformat: boolean): this {
        this.#autoformat = autoformat;
        return this;
    }

    /**
     * Adds new lines of text to this Formatter object.
     *
     * Within a regular line of text, the maximum number of characters allowed
     * is 19.
     *
     * @param lines The lines of text to add.
     * @returns The current object, for chaining.
     */
    addLines(lines: string): this {
        if (this.#text.length > 0) { // Adds a newline when chained with previous text.
            this.#text += "\n";
        }

        this.#text += this.#autoformat ? Formatter.#formatLines(lines) : lines;
        return this;
    }

    /**
     * Adds a speed modification for the given text.
     *
     * @param speed
     * @param lines
     * @returns The current object, for chaining.
     */
    addSpeed(speed: TextSpeed, lines: string): this {
        if (this.#text.length > 0) { // Adds a newline when chained with previous text.
            this.#text += "\n";
        }

        this.#text += `{SPEED${speed}}` +
            (this.#autoformat ? Formatter.#formatLines(lines) : lines);

        return this;
    }

    /**
     * Adds a time delay before the given text displays.
     *
     * @param pause The pause duration.
     * @param lines The lines of text to add.
     * @returns The current object, for chaining.
     */
    addPause(pause: TextPause, lines: string): this {
        if (this.#text.length > 0) { // Adds a newline when chained with previous text.
            this.#text += "\n";
        }

        this.#text += `{PAUSE${pause}}` +
            (this.#autoformat ? Formatter.#formatLines(lines) : lines);

        return this;
    }

    displayBottom(lines: string): this {
        if (this.#text.length > 0) { // Adds a newline when chained with previous text.
            this.#text += "\n";
        }
        this.#text += "{BOTTOM}" +
            (this.#autoformat ? Formatter.#formatLines(lines) : lines);

        return this;
    }

    /**
     * Returns the string representation of this Formatter.
     * @returns
     */
    toString(): string {
        return this.#text;
    }

    static #formatLines(text: string): string {
        const words = text.split(" ");
        const lines: string[][] = [[],];
        let i = 0;
        let lineIndex = 0;

        while (i < words.length) {
            const word = words[i];
            if (word.includes("\n")) {
                const splits = word.split("\n");
                let subword = splits[0];
                if (this.#getCharCount(lines[lineIndex].join(" ")) +
                    this.#getCharCount(subword) + 1 > this.#MAX_PER_LINE) {
                    ++lineIndex;
                    lines.push([]);
                }
                lines[lineIndex].push(subword);
                let j = 1;
                while (j < splits.length) {
                    subword = splits[j];
                    ++lineIndex;
                    lines.push([subword]);
                }
            } else {
                if (this.#getCharCount(lines[lineIndex].join(" ")) +
                    this.#getCharCount(word) + 1 > this.#MAX_PER_LINE) {
                    ++lineIndex;
                    lines.push([]);
                }
                lines[lineIndex].push(word);
            }
            ++i;
        }

        return lines.map(line => line.join(" ")).join("\n");
    }

    static #validateIncoming(text: string): void {
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; ++i) {
            const line = lines[i];
            const length = this.#getCharCount(line);
            if (length > this.#MAX_PER_LINE) {
                throw new Error(`Line ${i + 1} of ${lines.length} exceeds max length. (${length} > ${this.#MAX_PER_LINE})`);
            }
        }
    }

    static #getCharCount(text: string): number {
        return [...text].length;
    }

    static speed<N extends TextSpeed, T extends string>(speed: N, text: T): `{SPEED${N}}${T}` {
        return `{SPEED${speed}}${text}`;
    }

    static pause<N extends TextPause, T extends string>(pause: N, text: T): `{PAUSE${N}}${T}` {
        return `{PAUSE${pause}}${text}`;
    }

    static bottom<T extends string>(text: T): `{BOTTOM}${T}` {
        return `{BOTTOM}${text}`;
    }

    static noBorder<T extends string>(text: T): `{NOBORDER}${T}` {
        return `{NOBORDER}${text}`;
    }

    static choice<T extends string, U extends string, V extends string>(prompt: T, opt1: U, opt2: V): `${T}\n  ≥ ${U}\n    ${V}\n{CHOICE}` {
        return `${prompt}\n  ≥ ${opt1}\n    ${opt2}\n{CHOICE}`;
    }

    static choice2<T extends string, U extends string, V extends string, W extends string>(prompt: T, opt1: U, opt2: V, opt3: W): `${T}\n≥${U}\n ${V}\n ${W}\n{CHOICE2}` {
        return `${prompt}\n≥${opt1}\n ${opt2}\n ${opt3}\n{CHOICE2}`;
    }

    static choice3<T extends string, U extends string, V extends string>(prompt: T, opt1: U, opt2: V): `${T}\n≥${U}\n ${V}\n{CHOICE3}` {
        return `${prompt}\n≥${opt1}\n ${opt2}\n{CHOICE3}`;
    }

    static menu<T extends string>(text: T): `{MENU}\n${T}` {
        return `{MENU}\n${text}`;
    }

    static ibox<T extends string>(text: T): `{IBOX}\n${T}` {
        return `{IBOX}\n${text}`;
    }

    static itemSelect<T extends string>(prompt: T): `${T}\n{ITEMSELECT}` {
        return `${prompt}\n{ITEMSELECT}`;
    }

    static harp<T extends string>(text: T): `${T}\n{HARP}`{
        return `${text}\n{HARP}`;
    }

    static changePic<T extends string>(text: T): `${T}\n{CHANGEPIC}` {
        return `${text}\n{CHANGEPIC}`;
    }

    static intro<T extends string>(text: T): `{INTRO}${T}` {
        return `{INTRO}${text}`;
    }
}
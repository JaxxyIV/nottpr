import { TextPause, TextSpeed } from "../../types/strings.js";

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
 */
export default class Formatter {
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
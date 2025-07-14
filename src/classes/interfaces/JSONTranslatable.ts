export default interface JSONTranslatable<T> {
    toJSON(): T;
}
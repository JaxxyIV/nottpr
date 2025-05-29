export default interface Builder<T extends object> {
    construct(): T;
}
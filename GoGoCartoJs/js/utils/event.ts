export interface IEvent<T> {
    do(handler: { (data?: T): void }) : void;
    off(handler: { (data?: T): void }) : void;
}

export class Event<T> implements IEvent<T> {
    private handlers: { (data?: T): void; }[] = [];

    public do(handler: { (data?: T): void }) {
        this.handlers.push(handler);
    }

    public off(handler: { (data?: T): void }) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public emit(data?: T) {
        this.handlers.slice(0).forEach(h => h(data));
    }
}
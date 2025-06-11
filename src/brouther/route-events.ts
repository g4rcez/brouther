type ExtractSet<T extends Set<any>> = T extends Set<infer R> ? R : never;

type Callback = (url: string) => void

class RouteEventsImpl {
    private listeners = {
        start: new Set<Callback>(),
        change: new Set<Callback>(),
        notFound: new Set<Callback>(),
        changeWithLoader: new Set<Callback>(),
    };

    public on<K extends keyof RouteEventsImpl["listeners"]>(event: K, callback: ExtractSet<RouteEventsImpl["listeners"][K]>) {
        this.listeners[event].add(callback);
        return () => this.listeners[event].delete(callback);
    }

    private listen<K extends keyof RouteEventsImpl["listeners"]>(key: K, url: string) {
        const listeners = this.listeners[key];
        listeners.forEach((fn) => fn(url));
    }

    public notFound(url: string) {
        this.listen("notFound", url);
    }

    public changeWithLoader(url: string) {
        this.listen("changeWithLoader", url);
    }

    public change(url: string) {
        this.listen("change", url);
    }

    public start(url: string) {
        this.listen("start", url);
    }
}

export const RouteEvents = new RouteEventsImpl();

class ze {
    object;
    backingStore;
    storagePrefix;
    constructor(e, t=Be, r="") {
        this.object = e,
        this.backingStore = t,
        this.storagePrefix = r
    }
    register(e) {
        e = this.storagePrefix + e,
        this.backingStore.register(e)
    }
    set(e, t) {
        e = this.storagePrefix + e,
        this.object[e] = t,
        this.backingStore.set(e, t)
    }
    has(e) {
        return (e = this.storagePrefix + e)in this.object
    }
    get(e) {
        return e = this.storagePrefix + e,
        this.object[e]
    }
    async forceGet(e) {
        const t = this.storagePrefix + e
          , r = await this.backingStore.get(t);
        return r && r !== this.object[t] ? this.set(e, r) : r || this.remove(e),
        r
    }
    remove(e) {
        e = this.storagePrefix + e,
        delete this.object[e],
        this.backingStore.remove(e)
    }
    removeAll() {
        this.object = {},
        this.backingStore.clear()
    }
    dumpSizes() {
        q.instance().log("Ten largest settings: ");
        const e = {
            __proto__: null
        };
        for (const t in this.object)
            e[t] = this.object[t].length;
        const t = Object.keys(e);
        t.sort((function(t, r) {
            return e[r] - e[t]
        }
        ));
        for (let r = 0; r < 10 && r < t.length; ++r)
            q.instance().log("Setting: '" + t[r] + "', size: " + e[t[r]])
    }
}

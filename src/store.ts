'use client';

import { useEffect, useState } from "react";
import hash from "./hash";
import parseJson from "./parse-json";

type Persistable = {
    [key: string]: any | Persistable;
} | (any | Persistable)[];

/**
 * Create a global data store, that can be (partially) persisted.
 * 
 * @see {@link https://www.npmjs.com/package/@infinityfx/gs}
 */
export default function createGlobalStore<T extends Persistable>({ initial, key, persist }: {
    initial: T;
    /**
     * Unique key used to store persistent data under, inside local storage.
     * When not specified, a unique key is generated based on the initial data.
     */
    key?: string;
    /**
     * Whether to persist data inside local storage.
     * 
     * @default false
     */
    persist?: boolean | (keyof T)[];
}) {
    const id = key ?? '$GS.' + hash(initial),
        mutable = {
            data: parseJson(JSON.stringify(initial)) as T,
            loaded: !persist
        };

    function store() {
        if (!persist) return;

        let data: any = {};

        if (Array.isArray(persist)) {
            for (const key of persist) {
                data[key] = mutable.data[key];
            }
        } else {
            data = mutable.data;
        }

        window.localStorage.setItem(id, JSON.stringify(data));
    }

    function load() {
        const serialized = window.localStorage.getItem(id);

        if (serialized) {
            Object.assign(mutable.data, parseJson(serialized));
            mutable.loaded = true;
        }
    }

    function mutate(callback: (data: T) => Promise<any> | any) {
        callback(mutable.data);

        window.dispatchEvent(new CustomEvent('gs.sync', { detail: id }));
    }

    return function () {
        const [data, setData] = useState(mutable.data);
        const [loaded, setLoaded] = useState(mutable.loaded);

        function synchronize({ detail }: CustomEventInit<string>) {
            if (detail !== id) return;

            setData(parseJson(JSON.stringify(mutable.data)));
        }

        useEffect(() => {
            if (!mutable.loaded && persist) {
                setLoaded(true);
                load();
            }

            synchronize({ detail: id });

            const ctrl = new AbortController(),
                { signal } = ctrl;

            window.addEventListener('gs.sync', synchronize, { signal });
            window.addEventListener('beforeunload', store, { signal });

            return () => {
                ctrl.abort();
                store();
            };
        }, []);

        return [data, mutate, loaded] as const;
    }
}
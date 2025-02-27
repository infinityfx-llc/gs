# GS

[![NPM package](https://img.shields.io/npm/v/@infinityfx/gs)](https://www.npmjs.com/package/@infinityfx/gs)
[![NPM bundle size](https://img.shields.io/bundlephobia/minzip/@infinityfx/gs)](https://bundlephobia.com/package/@infinityfx/gs)
[![Last commit](https://img.shields.io/github/last-commit/infinityfx-llc/gs)](https://github.com/infinityfx-llc/gs)
![NPM weekly downloads](https://img.shields.io/npm/dw/@infinityfx/gs)
![NPM downloads](https://img.shields.io/npm/dt/@infinityfx/gs)

React persistable global store.

# Usage

## Creating stores

```ts
import { createGlobalStore } from '@infinityfx/gs';

export const useNotesStore = createGlobalStore({
    initial: ['My first note'],
    // persist the data to local storage (is false by default)
    persist: true
});

export const useFruitsStore = createGlobalStore({
    initial: {
        apple: 0,
        banana: 0,
        strawberry: 0,
        tomato: 0
    },
    // only persist a subset of data
    persist: ['apple', 'banana', 'strawberry'],
    // specify a custom key to store data under
    key: 'fruits-data'
});
```

## Using and mutating data

```ts
import { useCounterStore } from './stores';

export default function MyComponent() {
    const [data, mutate] = useCounterStore();

    // You can update state by mutating the data passed inside the mutate callback
    return <button onClick={() => mutate(data => data.counter++)}>
        {data.counter}
    </button>;
}
```
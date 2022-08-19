# EqualJS

The new way to write Web Applications, like the old time but with JSX elements.

- Without Virtual DOM
- State API
- Lifecycle API
- Helpers Function

## Configuration

### Typescript

```json5
{
  // ...
  "compilerOptions": {
    // ...
    "jsx": "react-jsx",
    "jsxImportSource": "@equal/equaljs",
  },
  // ...
}

```

## State API

```ts
const [counter, setCounter] = createStore(0);

// to access the value
counter.value

// to update the value
setCounter(1);
// or
setCounter((n) => n + 1);

// to sync when the value change
useSyncStore((value) => {
    console.log(value);
    // or
    console.log(counter.value);
}, counter);
// or
useSyncStore(([storeAValue, storeBValue]) => {
    // ...
}, [storeA, storeB]);
```

## Lifecycle API

```ts
export function Component(props: {}, ref: Ref<JSX.Element>) {
    onMount(ref, () => {
        // execute the code on mount the element

        return () => {
            // execute the code on unmount the element
        };
    });

    onUnmount(ref, () => {
        // execute the code on unmount the element
    });

    // ...
}
```

## Helpers Function

- `createRef`
- `appendChild`
- `removeChild`
- `addClass`
- `removeClass`
- `updateChildren`
- `updateTextContent`

## Examples

Go to the [examples](examples/) folder.

import { $TYPEOF_REF, type Ref } from './ref.type';

export function createRef<T extends JSX.Element>(element?: T): Ref<T> {
  const listeners = new Set<(prev: T, next: T) => void>();
  const state = {
    value: element as T,
  };

  return {
    $typeof: $TYPEOF_REF,
    get target() {
      return state.value;
    },
    set target(value: T) {
      let prev = state.value;
      state.value = value;

      for (const listener of listeners) {
        listener(prev, state.value);
      }
    },
    subscribe(fn: (prev: T, next: T) => void) {
      listeners.add(fn);
    },
  };
}

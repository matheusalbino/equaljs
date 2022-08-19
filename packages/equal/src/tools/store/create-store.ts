import { $TYPEOF_STORE, type Store, type StoreSubscribe } from './store.type';
import { isFunction } from '../../core/helpers';

export function createStore<T>(initialData: T | (() => T)): Store<T> {
  const listeners = new Set<StoreSubscribe<T>>();
  const state = {
    $typeof: $TYPEOF_STORE,
    value: structuredClone(isFunction(initialData) ? initialData() : initialData),
    subscribe(fn: StoreSubscribe<T>) {
      listeners.add(fn);
    },
  };

  return [
    state,
    (data) => {
      const nexValue = structuredClone(isFunction(data) ? data(state.value) : data);

      if (Object.is(state.value, nexValue)) {
        return;
      }

      state.value = nexValue;

      for (const listener of listeners) {
        listener(nexValue);
      }
    },
  ];
}

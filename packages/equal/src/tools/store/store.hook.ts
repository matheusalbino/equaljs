import type { StoreSubscribe, StoreValue, UnwrapStore } from './store.type';

export function useSyncStore<T extends StoreValue>(
  listener: StoreSubscribe<UnwrapStore<T>>,
  states: T | [T],
): void;

export function useSyncStore<T1 extends StoreValue, T2 extends StoreValue>(
  listener: StoreSubscribe<[UnwrapStore<T1>, UnwrapStore<T2>]>,
  states: [T1, T2],
): void;

export function useSyncStore<T1 extends StoreValue, T2 extends StoreValue, T3 extends StoreValue>(
  listener: StoreSubscribe<[UnwrapStore<T1>, UnwrapStore<T2>, UnwrapStore<T3>]>,
  states: [T1, T2, T3],
): void;

export function useSyncStore<
  T1 extends StoreValue,
  T2 extends StoreValue,
  T3 extends StoreValue,
  T4 extends StoreValue,
>(
  listener: StoreSubscribe<[UnwrapStore<T1>, UnwrapStore<T2>, UnwrapStore<T3>, UnwrapStore<T4>]>,
  states: [T1, T2, T3, T4],
): void;

export function useSyncStore(listener: StoreSubscribe, states: StoreValue | StoreValue[]): void {
  if (Array.isArray(states)) {
    for (const state of states) {
      state.subscribe(() => {
        listener(states.map((item) => item.value));
      });
    }

    return;
  }

  states.subscribe(listener);
}

export interface StoreValue<T = any> {
  /**
   * @core
   */
  readonly $typeof: symbol;

  readonly value: T;
  /**
   * @core
   */
  subscribe(fn: StoreSubscribe<T>): void;
}

export type UnwrapStore<T> = T extends StoreValue<infer D> ? D : never;

export type StoreSubscribe<T = any> = (value: T) => void;

export type StoreMutation<T = any> = (data: T | ((currentValue: T) => T)) => void;

export type Store<T = any> = [StoreValue<T>, StoreMutation<T>];

/**
 * @internal
 */
export const $TYPEOF_STORE = Symbol.for('equal.store');

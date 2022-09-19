/**
 * @internal
 */
export const $TYPEOF_REF = Symbol.for('equal.ref');

export interface Ref<T = any> {
  /**
   * @internal
   */
  readonly $typeof: symbol;
  target: T;
  /**
   * @internal
   */
  subscribe(fn: (prev: T, next: T) => void): void;
}

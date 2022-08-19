/**
 * @internal
 */
export const $TYPEOF_REF = Symbol.for('equal.ref');

export interface Ref<T = any> {
  /**
   * @core
   */
  readonly $typeof: symbol;
  /**
   * @core
   */
  target: T;
  /**
   * @core
   */
  subscribe(fn: (prev: T, next: T) => void): void;
}

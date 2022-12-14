import type { EqualElement } from '../element';

/**
 * @internal
 */
export const $TYPEOF_ROOT = Symbol.for('equal.root');

export interface Root {
  /**
   * @internal
   */
  readonly $typeof: symbol;
  /**
   * @internal
   */
  readonly target: EqualElement;
  render(element: JSX.Element): void;
  unmount(): void;
}

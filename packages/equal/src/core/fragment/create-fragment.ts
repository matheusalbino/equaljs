import type { EqualNode } from '../element';

export function createFragment(...children: EqualNode[]) {
  return children.flat(Infinity);
}

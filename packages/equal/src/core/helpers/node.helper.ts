import { isElement } from './element.helper';
import { isRef } from './ref.helper';
import { isRoot } from './root.helper';
import type { EqualNode } from '../element';
import type { Root } from '../root';

export function isValidNode(value: unknown): value is EqualNode | Root {
  if (Array.isArray(value)) {
    return value.every(isValidNode);
  }

  if (value === null || value === undefined) {
    return false;
  }

  return isRoot(value) || isRef(value) || isElement(value);
}

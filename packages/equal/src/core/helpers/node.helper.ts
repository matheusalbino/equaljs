import { isElement } from './element.helper';
import { isRef } from './ref.helper';
import { isRoot } from './root.helper';
import type { EqualElement } from '../element';
import type { Ref } from '../ref';
import type { Root } from '../root';

export function isValidNode(value: unknown): value is EqualElement | Ref<EqualElement> | Root {
  if (Array.isArray(value)) {
    return value.every(isValidNode);
  }

  if (value === null || value === undefined) {
    return false;
  }

  return isRoot(value) || isRef(value) || isElement(value);
}

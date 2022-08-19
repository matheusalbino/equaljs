import { $TYPEOF_REF, type Ref } from '../ref/ref.type';
import { isElement } from './element.helper';

export function isRef(value: unknown): value is Ref {
  if (value === null || value === undefined) {
    return false;
  }

  return (
    typeof value === 'object' &&
    (value as Ref).$typeof === $TYPEOF_REF &&
    isElement((value as Ref).target)
  );
}

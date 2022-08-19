import { $TYPEOF_ROOT, type Root } from '../root/root.type';

export function isRoot(value: unknown): value is Root {
  if (value === null || value === undefined) {
    return false;
  }

  return typeof value === 'object' && (value as Root).$typeof === $TYPEOF_ROOT;
}

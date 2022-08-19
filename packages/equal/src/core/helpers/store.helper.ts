import { $TYPEOF_STORE, type StoreValue } from '../../tools/store/store.type';

export function isStore(value: unknown): value is StoreValue {
  return value !== null && typeof value === 'object' && (value as any).$typeof === $TYPEOF_STORE;
}

import { createStore, StoreValue, useSyncStore } from '@equal/equaljs';

export interface VirtualizedListHook<T extends readonly unknown[]> {
  items: StoreValue<T>;
  index: StoreValue<number>;
  selectedIndex: StoreValue<number>;
  offset: StoreValue<number>;
  next: () => void;
  previous: () => void;
}

export function useVirtualizedList<
  T extends readonly unknown[],
  Config extends { maxItems: number; extraItems: number },
>(list: T, config: Config): VirtualizedListHook<T> {
  const maxIndex = list.length - 1;
  const totalMaxItems = config.maxItems + config.extraItems;

  const [index, setIndex] = createStore(0);
  const [selectedIndex, setSelectedIndex] = createStore(0);
  const [offset, setOffset] = createStore(0);
  const [items, setItems] = createStore(() => {
    const start = Math.max(0, offset.value - 1);
    const end = Math.min(list.length, start + totalMaxItems);

    return list.slice(start, end) as unknown as T;
  });

  useSyncStore((nextOffset) => {
    const start = Math.max(0, nextOffset - 1);
    const end = Math.min(list.length, start + totalMaxItems);

    setItems(list.slice(start, end) as unknown as T);
  }, offset);

  const next = () => {
    if (index.value === maxIndex) {
      return;
    }

    const nextIndex = index.value + 1;

    setIndex(nextIndex);

    const nextSelectedIndex = selectedIndex.value + 1;

    if (nextSelectedIndex <= config.maxItems) {
      setSelectedIndex(nextSelectedIndex);
    }

    const nextOffset = offset.value + 1;

    if (nextIndex - offset.value >= config.maxItems) {
      setOffset(nextOffset);
    }
  };

  const previous = () => {
    if (index.value === 0) {
      return;
    }

    const nextIndex = index.value - 1;

    setIndex(nextIndex);

    const nextSelectedIndex = selectedIndex.value - 1;

    if (nextSelectedIndex > 0 || nextIndex === 0) {
      setSelectedIndex(nextSelectedIndex);
    }

    if (offset.value === 0) {
      return;
    }

    if (nextIndex < offset.value) {
      const nextOffset = offset.value - 1;

      setOffset(nextOffset);
    }
  };

  return {
    items,
    index,
    selectedIndex,
    offset,
    next,
    previous,
  };
}

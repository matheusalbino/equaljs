import { createRef, updateChildren, useSyncStore } from '@equal/equaljs';
import { useVirtualizedList } from '../tools/virtualized-list.tool';
import { useInputController } from '../tools/input-controller.tool';

export function HorizontalList(props: { data: any[] }) {
  const { data } = props;

  const listRef = createRef();
  const { items, selectedIndex, offset, next, previous } = useVirtualizedList(data, {
    maxItems: 7,
    extraItems: 1,
  });

  useInputController({
    onRight: next,
    onLeft: previous,
  });

  useSyncStore(
    ([list, index]) => {
      updateChildren(listRef, renderItems(list, index));
    },
    [items, selectedIndex],
  );

  return (
    <>
      <text as="h2">List</text>
      <view as="button" onclick={previous} class="btn" style="display: inline-block;">
        {'<'}
      </view>
      <view as="ul" ref={listRef} style="display: inline-block;padding: 0;margin: 0 16px;">
        {renderItems(items.value, selectedIndex.value)}
      </view>
      <view as="button" onclick={next} class="btn" style="display: inline-block;">
        {'>'}
      </view>
    </>
  );

  function renderItems(list: any[], selectedIndex: number) {
    return list.map((item, index) => (
      <view
        as="li"
        style={`
        box-sizing: border-box;
        display: inline-block;
        list-decoration: none;
        width: 146px;
        height: 216px;
        margin-right: 16px;
        background-color: #1F1F1F;
        color: #EEEEEE;
        padding: 16px;
        ${selectedIndex === index ? 'border: 4px solid red;' : ''}
        `}
      >
        {item}
      </view>
    ));
  }
}

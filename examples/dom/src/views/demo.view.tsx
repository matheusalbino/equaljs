import {
  createStore,
  useSyncStore,
  addClass,
  removeClass,
  createRef,
  updateChildren,
} from '@equal/equaljs';
import { useInputController } from '../tools/input-controller.tool';

export function DemoView() {
  const [opened, setOpened] = createStore(false);
  const [activeIndex, setActiveIndex] = createStore(0);
  const [focusedIndex, setFocusedIndex] = createStore(0);
  const menuElement = createRef();
  const MenuItems = [
    { to: '/home', name: 'Home', icon: 'assets/home_icon.png' },
    { to: '/account', name: 'Account', icon: 'assets/account_icon.png' },
  ];

  useInputController({
    onLeft() {
      setOpened(true);
    },
    onRight() {
      setOpened(false);
    },
    onEnter() {
      setActiveIndex(focusedIndex.value);
      setOpened(false);
    },
    onUp() {
      setFocusedIndex(Math.max(0, focusedIndex.value - 1));
    },
    onDown() {
      setFocusedIndex(Math.min(MenuItems.length - 1, focusedIndex.value + 1));
    },
  });

  useSyncStore((value) => {
    if (value) addClass(menuElement, 'menu--opened');
    else removeClass(menuElement, 'menu--opened');
  }, opened);

  useSyncStore(
    ([active, focused]) => {
      updateChildren(
        menuElement,
        createMenuItems(MenuItems, {
          activeIndex: active,
          focusedIndex: focused,
          onFocus: onMenuItemFocus,
          onBlur: onMenuItemBlur,
        }),
      );
    },
    [activeIndex, focusedIndex],
  );

  return (
    <view class="demo-view">
      <image
        class="demo-view__background"
        src="https://photographylife.com/wp-content/uploads/2016/06/Mass.jpg"
      />
      <view as="nav" ref={menuElement} class="menu">
        {createMenuItems(MenuItems, {
          activeIndex: activeIndex.value,
          focusedIndex: focusedIndex.value,
          onFocus: onMenuItemFocus,
          onBlur: onMenuItemBlur,
        })}
      </view>
    </view>
  );

  function onMenuItemFocus(index: number) {
    setOpened(true);
    setFocusedIndex(index);
  }
  function onMenuItemBlur() {
    setOpened(false);
  }
}

function createMenuItems(
  items: any[],
  options: {
    activeIndex: number;
    focusedIndex: number;
    onFocus: (index: number) => void;
    onBlur: (index: number) => void;
  },
) {
  const { activeIndex, focusedIndex, onFocus, onBlur } = options;

  return items.map((item, index) => {
    return (
      <view
        as="button"
        class={getMenuItemClass(index, activeIndex, focusedIndex)}
        onclick={() => console.log(123)}
        onfocus={() => onFocus(index)}
        onblur={() => onBlur(index)}
      >
        <image src={item.icon} />
        <text as="span">{item.name}</text>
      </view>
    );
  });
}

function getMenuItemClass(index: number, activeIndex: number, focusedIndex: number): string {
  return [
    'menu__item',
    index === activeIndex && 'menu__item--active',
    index === focusedIndex && 'menu__item--focused',
  ]
    .filter(Boolean)
    .join(' ');
}

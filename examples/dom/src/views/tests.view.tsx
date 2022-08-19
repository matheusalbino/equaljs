import { createRef, createStore, removeChild, type Root, updateTextContent } from '@equal/equaljs';
import { HorizontalList } from '../components/horizontal-list.component';
import { DemoView } from './demo.view';
import { Clock } from '../components/clock.component';

export function TestsView(root: Root) {
  const [toggle, setToggle] = createStore(true);

  const toggleButton = createRef();
  const incrementButton = createRef();
  const decrementButton = createRef();
  const counterDisplay = createRef();

  let counter = 0;

  return (
    <>
      <text as="h1">Hello, world!</text>

      <Clock title="Relógio" />

      <text as="h2" style="display:inline-block;">
        Toggle:
      </text>
      <view
        as="button"
        ref={toggleButton}
        onclick={toggleAction}
        class="btn"
        style="display:inline-block;"
      >
        {toggle.value ? 'ON' : 'OFF'}
      </view>

      <text as="h2">Counter:</text>
      <view
        as="button"
        ref={decrementButton}
        onclick={decrement}
        class="btn"
        style="display:inline-block;"
      >
        {' - '}
      </view>
      <text as="span" ref={counterDisplay} style="margin: 12px;">
        {counter}
      </text>
      <view
        as="button"
        ref={incrementButton}
        onclick={increment}
        class="btn"
        style="display:inline-block;"
      >
        {' + '}
      </view>

      <text as="h2">Controls:</text>
      <view as="button" onclick={destroyApplication} class="btn">
        Destroy Application
      </view>
      <view as="button" onclick={changeApplication} class="btn">
        Change Application
      </view>

      <HorizontalList data={Array.from({ length: 10 }).map((_, i) => i)} />
    </>
  );

  function toggleAction() {
    setToggle(!toggle.value);
    updateTextContent(toggleButton, toggle.value ? 'ON' : 'OFF');
  }

  function decrement() {
    counter -= 1;

    updateTextContent(counterDisplay, counter);

    if (counter <= 0) {
      removeChild(root, decrementButton);
    }
  }

  function increment() {
    counter += 1;

    updateTextContent(counterDisplay, counter);

    if (counter >= 4) {
      removeChild(root, incrementButton);
    }
  }

  function changeApplication() {
    root.render(DemoView());
  }

  function destroyApplication() {
    root.unmount();
  }
}

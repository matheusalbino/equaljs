import type { Ref } from '../../core';
import { isFunction, isValidNode } from '../../core/helpers';
import { Renderer } from '../../dom';

export function onMount(ref: Ref<JSX.Element>, listener: () => void | (() => void)): void {
  let prevListener: () => void | undefined;

  ref.subscribe((prev, next) => {
    console.assert(isValidNode(next), 'The reference is not a valid node');

    if (prev !== undefined) {
      Renderer.removeEventListener(prev, 'mount', prevListener);
    }

    prevListener = () => {
      const destroy = listener();

      if (isFunction(destroy)) {
        Renderer.addEventListener(next, 'unmount', destroy, { once: true });
      }
    };

    Renderer.addEventListener(next, 'mount', prevListener, {
      once: true,
    });
  });
}

export function onUnmount(ref: Ref<JSX.Element>, listener: () => void): void {
  let prevListener: () => void | undefined;

  ref.subscribe((prev, next) => {
    console.assert(isValidNode(next), 'The reference is not a valid node');

    if (prev !== undefined) {
      Renderer.removeEventListener(prev, 'unmount', prevListener);
    }

    prevListener = listener;

    Renderer.addEventListener(next, 'unmount', prevListener, {
      once: true,
    });
  });
}

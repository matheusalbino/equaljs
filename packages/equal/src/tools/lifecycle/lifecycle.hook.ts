import type { Ref } from '../../core';
import { isFunction, isValidNode } from '../../core/helpers';

export function onMount(ref: Ref<JSX.Element>, listener: () => void | (() => void)): void {
  let prevListener: () => void | undefined;

  ref.subscribe((prev, next) => {
    console.assert(isValidNode(next), 'The reference is not a valid node');

    if (prev !== undefined) {
      prev.removeEventListener('mount', prevListener);
    }

    prevListener = () => {
      const destroy = listener();

      if (isFunction(destroy)) {
        next.addEventListener('unmount', destroy, { once: true });
      }
    };

    next.addEventListener('mount', prevListener, {
      once: true,
    });
  });
}

export function onUnmount(ref: Ref<JSX.Element>, listener: () => void): void {
  let prevListener: () => void | undefined;

  ref.subscribe((prev, next) => {
    console.assert(isValidNode(next), 'The reference is not a valid node');

    if (prev !== undefined) {
      prev.removeEventListener('unmount', prevListener);
    }

    prevListener = listener;
    next.addEventListener('unmount', prevListener, {
      once: true,
    });
  });
}

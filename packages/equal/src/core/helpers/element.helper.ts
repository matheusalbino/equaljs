import { $TYPEOF_ELEMENT, type ElementConfig, type EqualElement } from '../element/element.type';
import type { Ref } from '../ref/ref.type';
import type { Root } from '../root/root.type';

export function isText(value: unknown): value is string | number {
  if (Array.isArray(value)) {
    return value.every(isText);
  }

  if (value === null || value === undefined) {
    return false;
  }

  return typeof value === 'string' || typeof value === 'number';
}

export function isElement(value: unknown): value is EqualElement | Ref<EqualElement> | Root {
  if (Array.isArray(value)) {
    return value.every(isElement);
  }

  if (value === null || value === undefined) {
    return false;
  }

  return typeof value === 'object' && (value as EqualElement).$typeof === $TYPEOF_ELEMENT;
}

export function isValidElement(value: unknown): value is EqualElement | string | number {
  if (Array.isArray(value)) {
    return value.every(isValidElement);
  }

  return isElement(value) || isText(value);
}

export function setProperties(element: EqualElement, config: ElementConfig) {
  for (const [name, value] of Object.entries(config)) {
    if (name.startsWith('on') && name in window) {
      const event = name.substring(2);
      const listener = value as EventListener;

      element.$events[event] = listener;

      element.addEventListener(name.substring(2), listener);
    } else {
      element.setAttribute(name, String(value));
    }
  }
}

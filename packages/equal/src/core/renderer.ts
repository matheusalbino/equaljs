import { createFragment } from './fragment/create-fragment';
import {
  $TYPEOF_ELEMENT,
  type ElementConfig,
  type EqualElement,
  type EqualNode,
  type JSXElementConstructor,
} from './element';
import { createRoot, type Root } from './root';
import {
  type AnyFunction,
  internal_appendChild,
  internal_getTargetElement,
  internal_setProperties,
  internal_updateChildren,
  isFunction,
} from './helpers';
import { createRef, type Ref } from './ref';

export interface Renderer<T> {
  createRoot(container: T): Root;
  createElement(
    tag: string | JSXElementConstructor,
    config: ElementConfig,
    children: EqualNode[],
  ): EqualElement | undefined;
  createTextElement(value: string | number): EqualElement;
  createFragment(...children: EqualNode[]): EqualNode[];
  setProperty(
    target: EqualElement | Ref<EqualElement>,
    name: string,
    value: string | AnyFunction,
  ): void;
  removeProperty(
    target: EqualElement | Ref<EqualElement>,
    name: string,
    value: string | AnyFunction | undefined,
  ): void;
  updateTextContent(target: EqualElement | Ref<EqualElement>, value: string | number): void;
  appendChild(
    target: EqualElement | Ref<EqualElement> | Root,
    child: EqualElement | Ref<EqualElement>,
  ): void;
  insertBefore(
    target: EqualElement | Ref<EqualElement> | Root,
    child: EqualElement | Ref<EqualElement>,
    beforeChild: EqualElement | Ref<EqualElement>,
  ): void;
  removeChild(
    target: EqualElement | Ref<EqualElement> | Root,
    child: EqualElement | Ref<EqualElement>,
  ): void;
  replaceWith(
    target: EqualElement | Ref<EqualElement> | Root,
    child: EqualElement | Ref<EqualElement>,
    nextChild: EqualElement | Ref<EqualElement>,
  ): void;
  updateChildren(target: EqualElement | Ref<EqualElement> | Root, children: EqualNode[]): void;
  getNodeType(target: EqualElement | Ref<EqualElement> | Root): string | number;
  getAttributes(target: EqualElement | Ref<EqualElement>): { name: string; value: string }[];
  getChildren(target: EqualElement | Ref<EqualElement> | Root): EqualElement[];
  getTextContent(target: EqualElement | Ref<EqualElement>): string | undefined;
  addEventListener(
    target: EqualElement | Ref<EqualElement>,
    eventName: string,
    listener: AnyFunction,
    options?: AddEventListenerOptions,
  ): void;
  removeEventListener(
    target: EqualElement | Ref<EqualElement>,
    eventName: string,
    listener: AnyFunction,
  ): void;
  dispatchEvent(target: EqualElement | Ref<EqualElement> | Root, event: Event): boolean;
  addClass(target: EqualElement | Ref<EqualElement> | Root, value: string): void;
  removeClass(target: EqualElement | Ref<EqualElement> | Root, value: string): void;
}

export interface RendererOptions<T> {
  createElement(tag: string): T;
  createTextElement(value: string | number): T;
  setProperty(target: T, name: string, value: string | AnyFunction): void;
  removeProperty(target: T, name: string, value: string | AnyFunction | undefined): void;
  updateTextContent(target: T, value: string | number): void;
  appendChild(target: T, child: T): void;
  insertBefore(target: T, child: T, beforeChild: T): void;
  removeChild(target: T, child: T): void;
  replaceWith(target: T, child: T, nextChild: T): void;
  getNodeType(target: T): string | number;
  getAttributes(target: T): { name: string; value: string }[];
  getChildren(target: T): T[];
  getTextContent(target: T): string | undefined;
  addEventListener(
    target: T,
    eventName: string,
    listener: AnyFunction,
    options?: AddEventListenerOptions,
  ): void;
  removeEventListener(target: T, eventName: string, listener: AnyFunction): void;
  dispatchEvent(target: T, event: Event): boolean;
  addClass(target: T, value: string): void;
  removeClass(target: T, value: string): void;
}

export function createRenderer<T>(options: RendererOptions<T>): Renderer<T> {
  const {
    createElement,
    createTextElement,
    setProperty,
    removeProperty,
    updateTextContent,
    insertBefore,
    appendChild,
    removeChild,
    replaceWith,
    getNodeType,
    getAttributes,
    getChildren,
    getTextContent,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    addClass,
    removeClass,
  } = options;

  const renderer: Renderer<T> = {
    createRoot(container) {
      return createRoot(renderer, container as EqualElement);
    },
    createFragment,
    createElement(tag, config, children) {
      if (isFunction(tag)) {
        const { ref = createRef(), ...props } = config;

        const element = tag({ ...props, children }, ref);

        if (element === undefined || element === null) {
          return;
        }

        return element;
      }

      const { as: elementTag = tag, ref, ...props } = config;
      const element = createElement(elementTag) as EqualElement;

      element.$typeof = $TYPEOF_ELEMENT;
      element.$config = config;
      element.$events = {};

      if (ref) {
        ref.target = element;
      }

      internal_setProperties(renderer, element, props);

      internal_appendChild(renderer, element, children);

      return element;
    },
    createTextElement(value) {
      const element = createTextElement(value) as EqualElement;
      element.$typeof = $TYPEOF_ELEMENT;
      element.$config = {};
      element.$events = {};

      return element;
    },
    setProperty(target, name, value) {
      const element = internal_getTargetElement(target);

      setProperty(element as T, name, value);
    },
    removeProperty(target, name, value) {
      const element = internal_getTargetElement(target) as T;

      removeProperty(element, name, value);
    },
    updateTextContent(target, value) {
      const element = internal_getTargetElement(target) as T;

      updateTextContent(element, value);
    },
    appendChild(target, child) {
      const parent = internal_getTargetElement(target) as T;
      const element = internal_getTargetElement(child) as T;

      appendChild(parent, element);
    },
    insertBefore(target, child, beforeChild) {
      const parent = internal_getTargetElement(target) as T;
      const element = internal_getTargetElement(child) as T;
      const beforeElement = internal_getTargetElement(beforeChild) as T;

      insertBefore(parent, element, beforeElement);
    },
    removeChild(target, child) {
      const parent = internal_getTargetElement(target) as T;
      const element = internal_getTargetElement(child) as T;

      removeChild(parent, element);
    },
    replaceWith(
      target: EqualElement | Ref<EqualElement> | Root,
      child: EqualElement | Ref<EqualElement>,
      nextChild: EqualElement | Ref<EqualElement>,
    ) {
      const parent = internal_getTargetElement(target) as T;
      const element = internal_getTargetElement(child) as T;
      const nextElement = internal_getTargetElement(nextChild) as T;

      replaceWith(parent, element, nextElement);
    },
    updateChildren(target, children) {
      internal_updateChildren(renderer, target, children);
    },
    getNodeType(target) {
      const element = internal_getTargetElement(target) as T;

      return getNodeType(element);
    },
    getAttributes(target) {
      const element = internal_getTargetElement(target) as T;

      return getAttributes(element);
    },
    getChildren(target) {
      const element = internal_getTargetElement(target) as T;

      return getChildren(element) as EqualElement[];
    },
    getTextContent(target) {
      const element = internal_getTargetElement(target) as T;

      return getTextContent(element);
    },
    addEventListener(target, eventName, listener) {
      const element = internal_getTargetElement(target) as T;

      return addEventListener(element, eventName, listener);
    },
    removeEventListener(target, eventName, listener) {
      const element = internal_getTargetElement(target) as T;

      return removeEventListener(element, eventName, listener);
    },
    dispatchEvent(target, event) {
      const element = internal_getTargetElement(target) as T;

      return dispatchEvent(element, event);
    },
    addClass(target, value) {
      const element = internal_getTargetElement(target) as T;

      addClass(element, value);
    },
    removeClass(target, value) {
      const element = internal_getTargetElement(target) as T;

      removeClass(element, value);
    },
  };

  return renderer;
}

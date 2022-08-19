import type { Ref } from '../ref';

/**
 * @internal
 */
export const $TYPEOF_ELEMENT = Symbol.for('equal.element');

export type JSXElementConstructor<P = {}> = (
  props: P,
  ref?: Ref,
) => EqualElement<any, any> | null | undefined;

export type Key = string | number;

export interface Attributes {
  // key?: Key | undefined;
}

export interface EqualElement<
  P = any,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
> extends DOMElement {
  /**
   * @core
   */
  $typeof: symbol;
  /**
   * @core
   */
  $config: ElementConfig;
  /**
   * @core
   */
  $events: Record<string, EventListener>;
  // key: Key | undefined;
  type: T;
  props: P;
}

interface DOMElement {
  // Props
  attributes: NamedNodeMap;
  nodeType: number;
  textContent: string;
  children: EqualElement[];
  classList: DOMTokenList;

  // Methods
  isEqualNode(otherNode: EqualElement | null): boolean;
  isSameNode(otherNode: EqualElement | null): boolean;
  appendChild(node: EqualElement): void;
  removeChild(child: EqualElement): void;
  replaceWith(...nodes: (EqualElement | string)[]): void;
  replaceChild(node: EqualElement, child: EqualElement): void;
  replaceChildren(...nodes: (EqualElement | string)[]): void;
  setAttribute(name: string, value: string): void;
  hasAttribute(name: string): boolean;
  removeAttribute(name: string): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
  dispatchEvent(event: Event): boolean;
}

export type ElementConfig = BaseProps | ViewProps | TextProps | ImageProps;

export interface BaseProps {
  ref?: Ref;
  // key?: Key;
  as?: string;
  style?: string;
  class?: string;
}

export interface ViewProps extends BaseProps {
  children?: EqualNode;
  onclick?: () => void;
  onfocus?: () => void;
  onblur?: () => void;
}

export interface TextProps extends BaseProps {
  children:
    | string
    | number
    | EqualElement<TextProps>
    | Array<string | number | EqualElement<TextProps>>;
}

export interface ImageProps extends BaseProps {
  src: string;
}

export type EqualFragment = Iterable<EqualNode>;

export type EqualNode = EqualElement | string | number | EqualFragment | boolean | null | undefined;

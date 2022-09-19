import type { Ref } from '../ref';

/**
 * @internal
 */
export const $TYPEOF_ELEMENT = Symbol.for('equal.element');

export type JSXElementConstructor<P = {}> = (
  props: P,
  ref?: Ref,
) => EqualElement<any, any> | null | undefined;

export interface Attributes {}

export interface EqualElement<
  P = any,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
> {
  /**
   * @internal
   */
  $typeof: symbol;
  /**
   * @internal
   */
  $config: ElementConfig;
  /**
   * @internal
   */
  $events: Record<string, EventListener>;
  // key: Key | undefined;
  type: T;
  props: P;
}

/**
 * @internal
 */
export type ElementConfig = (
  | Omit<ViewProps, 'children'>
  | Omit<TextProps, 'children'>
  | ImageProps
) & {
  children?: EqualNode[];
};

/**
 * @internal
 */
export type ElementProps =
  | Omit<ViewProps, 'as' | 'ref' | 'children'>
  | Omit<TextProps, 'as' | 'ref' | 'children'>
  | Omit<ImageProps, 'as' | 'ref'>;

export interface BaseProps {
  id?: string;
  ref?: Ref;
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

export type EqualNode =
  | EqualElement
  | Ref<EqualElement>
  | string
  | number
  | EqualFragment
  | boolean
  | null
  | undefined;

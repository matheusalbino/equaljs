import type { Attributes, EqualElement, ImageProps, TextProps, ViewProps } from './core';

declare global {
  namespace JSX {
    interface Element extends EqualElement<any, any> {}

    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes extends Attributes {}

    interface IntrinsicElements {
      view: ViewProps;
      text: TextProps;
      image: ImageProps;
    }
  }
}

import { appendChild } from './element.helper';
import {
  $TYPEOF_ELEMENT,
  type ElementConfig,
  type EqualElement,
  type EqualNode,
  type JSXElementConstructor,
  Key,
} from './element.type';
import { isFunction, setProperties } from '../helpers';
import { createRef } from '../ref/create-ref';

const ElementTagByType: Record<string, string> = {
  view: 'div',
  text: 'p',
  image: 'img',
};

export function createElement(
  tag: string | JSXElementConstructor,
  config: ElementConfig,
  children: EqualNode[],
): EqualElement | undefined {
  if (isFunction(tag)) {
    const { ref = createRef(), ...props } = config;

    const element = tag({ ...props, children }, ref);

    if (element === undefined || element === null) {
      return;
    }

    return element;
  }

  const { ref, ...props } = config;

  const element = document.createElement(ElementTagByType[tag] ?? tag) as unknown as JSX.Element;

  element.$typeof = $TYPEOF_ELEMENT;
  element.$config = config;
  element.$events = {};

  if (ref) {
    ref.target = element;
  }

  setProperties(element, props);

  appendChild(element, children);

  return element;
}

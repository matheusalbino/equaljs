import { $TYPEOF_ELEMENT, type EqualElement } from './element.type';

export function createTextElement(value: string | number): EqualElement {
  const element = document.createTextNode(value.toString());

  // @ts-ignore: internal property
  element.$typeof = $TYPEOF_ELEMENT;

  return element as unknown as EqualElement;
}

import { $TYPEOF_ELEMENT, ElementProps, type EqualElement, EqualNode } from '../element';
import { type Ref } from '../ref';
import { type Root } from '../root';
import { Renderer } from '../renderer';
import { isValidNode } from './node.helper';
import { isStore } from './store.helper';
import { isRoot } from './root.helper';
import { isRef } from './ref.helper';

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

export function internal_appendChild(
  renderer: Renderer<any>,
  target: EqualElement | Ref<EqualElement> | Root,
  child: EqualNode,
) {
  console.assert(isValidNode(target), 'The parent is not a valid node');
  console.assert(isValidElement(child), 'The child is not a valid node');

  if (Array.isArray(child)) {
    for (const nestedChild of child) {
      internal_appendChild(
        renderer,
        target,
        isStore(nestedChild) ? nestedChild.value : nestedChild,
      );
    }

    return;
  }

  if (!isValidNode(target)) {
    return;
  }

  const node = isValidElement(child)
    ? isText(child)
      ? renderer.createTextElement(child)
      : internal_getTargetElement(child)
    : undefined;

  if (node === undefined) {
    return;
  }

  renderer.appendChild(target, node);
  renderer.dispatchEvent(target, new Event('mount'));

  if (isRoot(target)) {
    target.target.$config.children!.push(node);
  }
}

export function internal_removeChild(
  renderer: Renderer<any>,
  target: EqualElement | Ref<EqualElement> | Root,
  child: EqualElement | Ref<EqualElement>,
): void {
  console.assert(isValidNode(target), 'The parent is not a valid node');
  console.assert(isValidNode(child), 'The child is not a valid node');

  renderer.removeChild(target, child);
  renderer.dispatchEvent(target, new Event('unmount'));
}

export function internal_updateChildren(
  renderer: Renderer<any>,
  target: EqualElement | Ref<EqualElement> | Root,
  nextChildren: EqualNode[],
) {
  console.assert(isValidNode(target), 'The target is not a valid node');

  const children = Array.from(renderer.getChildren(target));

  if (nextChildren.length === 0) {
    for (const child of children) {
      internal_removeChild(renderer, target, child);
    }

    return;
  }

  for (let i = 0; i < children.length; i++) {
    const currentChild = children[i]!;
    let nextChild = nextChildren[i];

    if (!isElement(nextChild)) {
      nextChild = undefined;
    } else {
      nextChild = internal_getTargetElement(nextChild);
    }

    if (nextChild === undefined) {
      internal_removeChild(renderer, target, currentChild);

      continue;
    }

    if (currentChild === nextChild) {
      continue;
    }

    renderer.dispatchEvent(currentChild, new Event('unmount'));

    if (renderer.getNodeType(currentChild) !== renderer.getNodeType(nextChild)) {
      renderer.replaceWith(target, currentChild, nextChild);
      renderer.dispatchEvent(nextChild, new Event('mount'));

      continue;
    }

    internal_patchElement(renderer, currentChild, nextChild);
    renderer.dispatchEvent(currentChild, new Event('mount'));
  }
}

export function internal_getTargetElement(
  value: EqualElement | Ref<EqualElement> | Root,
): EqualElement {
  if (isRef(value) || isRoot(value)) {
    return value.target;
  }

  return value;
}

export function internal_patchElement(
  renderer: Renderer<any>,
  element: EqualElement,
  nextElement: EqualElement,
) {
  const nextAttributes = renderer.getAttributes(nextElement);

  for (const attribute of renderer.getAttributes(element)) {
    const existsAttribute = nextAttributes.findIndex((attr) => attr.name === attribute.name) >= 0;

    if (!existsAttribute) {
      renderer.removeProperty(element, attribute.name, undefined);
    }
  }

  for (const [event, listener] of Object.entries(element.$events)) {
    if (nextElement.$events[event] === undefined) {
      delete element.$events[event];

      renderer.removeProperty(element, event, listener);
    }
  }

  const { ref, ...props } = nextElement.$config;

  if (ref) {
    ref.target = element;
  }

  internal_setProperties(renderer, element, props);

  const nextChildren = Array.from(renderer.getChildren(nextElement));
  const nextTextContent = renderer.getTextContent(nextElement);

  if (nextChildren.length > 0) {
    internal_updateChildren(renderer, element, nextChildren);
  } else if (
    renderer.getTextContent(element) !== nextTextContent &&
    nextTextContent !== undefined
  ) {
    renderer.updateTextContent(element, nextTextContent);
  }
}

export function internal_setProperties(
  renderer: Renderer<any>,
  element: EqualElement,
  config: ElementProps,
) {
  for (const [name, value] of Object.entries(config)) {
    if (name.startsWith('on')) {
      element.$events[name] = value as EventListener;
    }

    renderer.setProperty(element, name, value);
  }
}

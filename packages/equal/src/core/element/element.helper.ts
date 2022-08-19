import { createTextElement } from './create-text-element';
import { type Root } from '../root';
import { type Ref } from '../ref';
import { type EqualElement, type EqualNode } from './element.type';
import {
  isRef,
  isRoot,
  isStore,
  isText,
  isValidNode,
  setProperties,
  isValidElement,
} from '../helpers';

export function appendChild(target: EqualElement | Ref<EqualElement> | Root, child: EqualNode) {
  console.assert(isValidNode(target), 'The parent is not a valid node');
  console.assert(isValidElement(child), 'The child is not a valid node');

  if (Array.isArray(child)) {
    for (const nestedChild of child) {
      appendChild(target, isStore(nestedChild) ? nestedChild.value : nestedChild);
    }

    return;
  }

  const element = internal_getTargetElement(target);

  if (!isValidElement(child)) {
    return;
  }

  const node = isText(child) ? createTextElement(child) : internal_getTargetElement(child);

  element.appendChild(node);
  node.dispatchEvent(new Event('mount'));
}

export function removeChild(
  target: EqualElement | Ref<EqualElement> | Root,
  child: EqualElement | Ref<EqualElement>,
): void {
  console.assert(isValidNode(target), 'The parent is not a valid node');
  console.assert(isValidNode(child), 'The child is not a valid node');

  const parent = internal_getTargetElement(target);
  const element = internal_getTargetElement(child);

  parent.removeChild(element);
  element.dispatchEvent(new Event('unmount'));
}

export function updateTextContent(
  target: EqualElement | Ref<EqualElement>,
  value: string | number,
) {
  console.assert(isValidNode(target), 'The target is not a valid node');

  const element = internal_getTargetElement(target);

  element.textContent = typeof value == 'number' ? value.toString() : value;
}

export function updateChildren(
  target: EqualElement | Ref<EqualElement> | Root,
  nextChildren: Array<EqualElement | Ref<EqualElement>>,
) {
  console.assert(isValidNode(target), 'The target is not a valid node');

  const element = internal_getTargetElement(target);
  const children = internal_getTargetElementChildren(element);

  if (nextChildren.length === 0) {
    const parent = isRoot(target) ? target : element;

    for (const child of children) {
      removeChild(parent, child);
    }

    return;
  }

  for (let i = 0; i < children.length; i++) {
    const currentChild = children[i]!;
    let nextChild = nextChildren[i];

    if (!isValidNode(nextChild)) {
      nextChild = undefined;
    } else {
      nextChild = internal_getTargetElement(nextChild);
    }

    if (nextChild === undefined) {
      removeChild(element, currentChild);

      continue;
    }

    if (currentChild.isEqualNode(nextChild)) {
      continue;
    }

    currentChild.dispatchEvent(new Event('unmount'));

    if (currentChild.nodeType !== nextChild.nodeType) {
      currentChild.replaceWith(nextChild);
      nextChild.dispatchEvent(new Event('mount'));

      continue;
    }

    internal_patchElement(currentChild, nextChild);

    currentChild.dispatchEvent(new Event('mount'));
  }
}

export function addClass(target: EqualElement | Ref<EqualElement>, name: string) {
  console.assert(isValidNode(target), 'The target is not a valid node');

  const element = internal_getTargetElement(target);

  element.classList.add(name);
}

export function removeClass(target: EqualElement | Ref<EqualElement>, name: string) {
  console.assert(isValidNode(target), 'The target is not a valid node');

  const element = internal_getTargetElement(target);

  element.classList.remove(name);
}

/**
 * @core
 */
export function internal_getTargetElement(
  value: EqualElement | Ref<EqualElement> | Root,
): EqualElement {
  if (isRef(value) || isRoot(value)) {
    return value.target;
  }

  return value;
}

export function internal_getTargetElementChildren(
  value: EqualElement | Ref<EqualElement> | Root,
): EqualElement[] {
  if (isRef(value) || isRoot(value)) {
    return [...value.target.children];
  }

  return [...value.children];
}

/**
 * @core
 */
export function internal_patchElement(element: EqualElement, nextElement: EqualElement) {
  for (const attribute of element.attributes) {
    if (!nextElement.hasAttribute(attribute.name)) {
      element.removeAttribute(attribute.name);
    }
  }

  for (const [event, listener] of Object.entries(element.$events)) {
    if (nextElement.$events[event] === undefined) {
      delete element.$events[event];

      element.removeEventListener(event, listener);
    }
  }

  const { ref, ...props } = nextElement.$config;

  if (ref) {
    ref.target = element;
  }

  setProperties(element, props);

  if (nextElement.children.length > 0) {
    updateChildren(element, Array.from(nextElement.children) as EqualElement[]);
  } else if (element.textContent !== nextElement.textContent) {
    element.textContent = nextElement.textContent;
  }
}

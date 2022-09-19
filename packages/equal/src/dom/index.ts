import { createRenderer } from '../core/renderer';

const ElementTypeByTag: Record<string, string> = {
  view: 'div',
  text: 'p',
  image: 'img',
};

export const Renderer = createRenderer<HTMLElement>({
  createElement(tag) {
    return document.createElement(ElementTypeByTag[tag] ?? tag);
  },
  createTextElement(value) {
    return document.createTextNode(value.toString()) as unknown as HTMLElement;
  },
  setProperty(target, name, value) {
    if (name === 'class') {
      target.className = value as string;
    } else if (name.startsWith('on')) {
      const eventName = name.substring(2);

      target.addEventListener(eventName, value as EventListener);
    } else {
      target.setAttribute(name, value as string);
    }
  },
  removeProperty(target, name, value) {
    if (name === 'class') {
      target.className = '';
    } else if (name.startsWith('on')) {
      const eventName = name.substring(2);

      target.removeEventListener(eventName, value as EventListener);
    } else {
      target.removeAttribute(name);
    }
  },
  updateTextContent(target, value) {
    target.textContent = value.toString();
  },
  appendChild(target, child) {
    target.appendChild(child);
  },
  insertBefore(target, child, beforeChild) {
    target.insertBefore(child, beforeChild);
  },
  removeChild(target, child) {
    target.removeChild(child);
  },
  replaceWith(target, child, nextChild) {
    target.replaceChild(child, nextChild);
  },
  getNodeType(target) {
    return target.nodeType;
  },
  getAttributes(target) {
    const data: Array<{ name: string; value: string }> = [];

    if (target.attributes === undefined) {
      return data;
    }

    for (const attribute of target.attributes) {
      data.push({ name: attribute.name, value: attribute.value });
    }

    return data;
  },
  getChildren(target) {
    return target.childNodes as unknown as HTMLElement[];
  },
  getTextContent(target) {
    return target.textContent ?? undefined;
  },
  addEventListener(target, eventName, listener, options) {
    target.addEventListener(eventName, listener, options);
  },
  removeEventListener(target, eventName, listener) {
    target.removeEventListener(eventName, listener);
  },
  dispatchEvent(target, event) {
    return target.dispatchEvent(event);
  },
  addClass(target, value) {
    target.classList.add(...value.split(' '));
  },
  removeClass(target, value) {
    target.classList.remove(...value.split(' '));
  },
});

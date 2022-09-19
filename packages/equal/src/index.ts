import { Renderer } from './dom';

export * from './jsx.type';
export * from './tools';
export {
  Fragment,
  createRef,
  type Ref,
  type EqualElement,
  type EqualNode,
  type Root,
  type ImageProps,
  type ViewProps,
  type TextProps,
  type JSXElementConstructor,
} from './core';

export const createRoot = Renderer.createRoot;
export const setProperty = Renderer.setProperty;
export const removeProperty = Renderer.removeProperty;
export const updateTextContent = Renderer.updateTextContent;
export const appendChild = Renderer.appendChild;
export const insertBefore = Renderer.insertBefore;
export const replaceWith = Renderer.replaceWith;
export const removeChild = Renderer.removeChild;
export const updateChildren = Renderer.updateChildren;
export const getAttributes = Renderer.getAttributes;
export const getTextContent = Renderer.getTextContent;
export const getChildren = Renderer.getChildren;
export const addEventListener = Renderer.addEventListener;
export const removeEventListener = Renderer.removeEventListener;
export const dispatchEvent = Renderer.dispatchEvent;
export const addClass = Renderer.addClass;
export const removeClass = Renderer.removeClass;

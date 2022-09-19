import type { JSXElementConstructor } from './core';
import { EQUAL_FRAGMENT_TYPE } from './core/fragment';
import { Renderer } from './dom';

export * from './jsx.type';

export { Fragment } from './core';

export function jsx(
  type: string | symbol | JSXElementConstructor,
  config: Record<string, unknown> & { as?: string },
): any {
  const { children, ...props } = config;

  if (typeof type === 'symbol') {
    if (type === EQUAL_FRAGMENT_TYPE) {
      return Renderer.createFragment(getChildren(children));
    }

    return;
  }

  if (props.as !== undefined) {
    return Renderer.createElement(props.as, props, getChildren(children));
  }

  return Renderer.createElement(type, props, getChildren(children));
}

export function jsxs(
  type: string | symbol | JSXElementConstructor,
  config: Record<string, unknown> & { as?: string },
): any {
  const { children, ...props } = config;

  if (typeof type === 'symbol') {
    if (type === EQUAL_FRAGMENT_TYPE) {
      return Renderer.createFragment(getChildren(children));
    }

    return;
  }

  if (props.as !== undefined) {
    return Renderer.createElement(props.as, props, getChildren(children));
  }

  return Renderer.createElement(type, props, getChildren(children));
}

function getChildren(value: unknown): any[] {
  return value === undefined || value === null
    ? []
    : Array.isArray(value)
    ? value.flat(Infinity)
    : [value];
}

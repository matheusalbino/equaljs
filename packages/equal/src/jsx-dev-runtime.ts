import type { JSXElementConstructor } from './core';
import { jsx, jsxs } from './jsx-runtime';

export * from './jsx.type';

export { Fragment } from './core';

export function jsxDEV(
  type: string | symbol | JSXElementConstructor,
  config: Record<string, unknown> & { as?: string },
  key: any | undefined,
  isStaticChildren: boolean,
  source: {
    columnNumber: number;
    fileName: string;
    lineNumber: number;
  },
  self: any,
) {
  if (isStaticChildren) {
    return jsxs(type, config);
  }

  return jsx(type, config);
}

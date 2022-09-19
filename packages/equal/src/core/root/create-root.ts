import { $TYPEOF_ROOT, type Root } from './root.type';
import { internal_appendChild, internal_updateChildren } from '../helpers';
import type { EqualElement } from '../element';
import type { Renderer } from '../renderer';

export function createRoot(renderer: Renderer<any>, container: EqualElement): Root {
  container.$config = { children: [] };

  const root: Root = {
    $typeof: $TYPEOF_ROOT,
    target: container as unknown as EqualElement,
    render(element: JSX.Element) {
      root.unmount();

      if (Array.isArray(element)) {
        for (const child of element) {
          internal_appendChild(renderer, root, child);
        }

        return;
      }

      internal_appendChild(renderer, root, element);
    },
    unmount() {
      internal_updateChildren(renderer, root, []);
    },
  };

  return root;
}

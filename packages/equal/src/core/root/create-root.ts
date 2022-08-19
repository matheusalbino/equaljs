import { appendChild, updateChildren } from '../element/element.helper';
import { $TYPEOF_ROOT, type Root } from './root.type';
import { type EqualElement } from '../element';

export function createRoot(id: string = 'root'): Root {
  const container = document.createElement('div');

  container.id = id;

  document.body.appendChild(container);

  const root: Root = {
    $typeof: $TYPEOF_ROOT,
    target: container as unknown as EqualElement,
    render(element: JSX.Element) {
      root.unmount();

      if (Array.isArray(element)) {
        for (const child of element) {
          appendChild(root, child);
        }

        return;
      }

      appendChild(root, element);
    },
    unmount() {
      updateChildren(root, []);
    },
  };

  return root;
}

import './main.css';
import { createRoot } from '@equal/equaljs';
import { TestsView } from './views/tests.view';
// import { DemoView } from './views/demo.view';

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);

root.render(
  TestsView(root),
  // DemoView(),
);

import './main.css';
import { createRoot } from '@equal/equaljs';
import { TestsView } from './views/tests.view';
// import { DemoView } from './views/demo.view';

const root = createRoot();

root.render(
  TestsView(root),
  // DemoView(),
);

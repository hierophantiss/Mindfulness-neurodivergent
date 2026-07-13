const fs = require('fs');
let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { InteractiveBackground } from './components/InteractiveBackground';\nimport Dashboard from './pages/Dashboard';\n",
  ""
);

content = content.replace(
  "const Chapters = React.lazy(() => import('./pages/Chapters'));",
  "const InteractiveBackground = React.lazy(() => import('./components/InteractiveBackground').then(m => ({ default: m.InteractiveBackground })));\nconst Dashboard = React.lazy(() => import('./pages/Dashboard'));\nconst Chapters = React.lazy(() => import('./pages/Chapters'));"
);

fs.writeFileSync(file, content);

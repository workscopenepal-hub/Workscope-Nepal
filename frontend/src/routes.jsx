import About from './pages/About.jsx';
import Companies from './pages/Companies.jsx';
import DirectoryPage from './pages/DirectoryPage.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Submissions from './pages/Submissions.jsx';

export const routes = {
  '/': Home,
  '/about': About,
  '/login': Login,
  '/companies': Companies,
  '/opportunities': () => <DirectoryPage resource="opportunities" />,
  '/events': () => <DirectoryPage resource="events" />,
  '/communities': () => <DirectoryPage resource="communities" />,
  '/submissions': Submissions,
};
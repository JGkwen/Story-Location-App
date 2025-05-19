import HomePage      from '../pages/home/home-page';
import AddPage       from '../pages/add/add-page';
import AboutPage     from '../pages/about/about-page';
import LoginPage     from '../pages/login/login-page';
import RegisterPage  from '../pages/register/register-page';
import DraftsPage from '../pages/drafts/drafts-page.js';

const routes = {
  '/':         LoginPage,
  '/home':     HomePage,
  '/add':      AddPage,
  '/about':    AboutPage,
  '/login':    LoginPage,
  '/register': RegisterPage,
  '/drafts':   DraftsPage,   
};

export default routes;

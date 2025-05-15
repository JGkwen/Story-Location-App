import HomePage from '../pages/home/home-page';
import AddPage from '../pages/add/add-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';

const routes = {
  '/': LoginPage,
  '/home': HomePage,
  '/add': AddPage,
  '/about': AboutPage,
  '/login': LoginPage,
  '/register': RegisterPage,
};

export default routes;

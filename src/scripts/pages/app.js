import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import ViewTransition from '../utils/view-transition';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const token = localStorage.getItem('auth_token');

    if (!token && url !== '/login' && url !== '/register') {
      location.hash = '/login';
      return;
    }

    const PageClass = routes[url] || routes['/'];

    try {
      const page = new PageClass();

      ViewTransition.start(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();

        this.#content.classList.add('show');
      });
    } catch (error) {
      console.error('Failed to render page:', error);
      this.#content.innerHTML = '<p>Page not found.</p>';
    }
  }
}

export default App;

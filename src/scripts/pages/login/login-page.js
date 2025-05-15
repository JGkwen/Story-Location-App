import LoginPresenter from './login-presenter';
import { login } from '../../data/api'; 

export default class LoginPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h2>Login</h2>
        <form id="login-form">
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register">Daftar</a></p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: { login } 
    });

    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      this.#presenter.login(email, password);  
    });
  }

  onLoginSuccess(token) {
    localStorage.setItem('auth_token', token);
    alert('Login berhasil!');
    location.hash = '/home';
  }

  onLoginError(message) {
    alert(message);
  }
}

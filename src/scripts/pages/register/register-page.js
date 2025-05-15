import RegisterPresenter from './register-presenter';
import { register } from '../../data/api';

export default class RegisterPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h2>Register</h2>
        <form id="register-form">
          <div>
            <label for="name">Nama</label>
            <input type="text" id="name" placeholder="Nama" required aria-required="true" />
          </div>
          
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Email" required aria-required="true" />
          </div>
          
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Password" required aria-required="true" />
          </div>
          
          <div>
            <button type="submit" aria-label="Daftar untuk membuat akun">Daftar</button>
          </div>
        </form>
        
        <p>Sudah punya akun? <a href="#/login" aria-label="Klik untuk masuk ke halaman login">Login</a></p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: { register },  
    });

    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      this.#presenter.register(name, email, password); 
    });
  }

  onRegisterSuccess() {
    alert('Registrasi berhasil! Silakan login.');
    location.hash = '/login'; 
  }

  onRegisterError(message) {
    alert(message);  
  }
}

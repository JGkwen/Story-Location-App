import { login } from '../../data/api'; 

export default class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;  
  }

  async login(email, password) {
    try {
      const result = await this.#model.login({ email, password }); 
      this.#view.onLoginSuccess(result.loginResult.token); 
    } catch (err) {
      this.#view.onLoginError(err.message);
    }
  }
}

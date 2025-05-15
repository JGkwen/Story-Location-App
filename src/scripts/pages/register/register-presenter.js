import { register } from '../../data/api'; 

export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;  
  }

  async register(name, email, password) {
    try {
      await this.#model.register({ name, email, password });
      this.#view.onRegisterSuccess(); 
    } catch (err) {
      this.#view.onRegisterError(err.message); 
    }
  }
}

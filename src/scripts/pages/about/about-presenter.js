export default class AboutPresenter {
    #view;
  
    constructor({ view }) {
      this.#view = view;
    }
  
    init() {
      this.#view.showAbout();
    }
  }
  
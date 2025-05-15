import AboutPresenter from './about-presenter.js';

export default class AboutPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h2>About This App</h2>
        <div id="about-content"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AboutPresenter({ view: this });
    this.#presenter.init();
  }

  showAbout() {
    document.getElementById('about-content').innerHTML = `
      <p>Aplikasi ini dibuat untuk berbagi cerita berbasis lokasi dan foto, menggunakan Story API dan teknologi Web API modern seperti kamera dan peta digital.</p>
    `;
  }
}

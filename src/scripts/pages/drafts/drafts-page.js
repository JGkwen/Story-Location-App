import DraftsPresenter from './drafts-presenter.js';
import * as dbUtils from '../../utils/db.js';

export default class DraftsPage {
  #presenter;
  #container;

  async render() {
    return `
      <section class="container">
        <h2>Draft Cerita</h2>
        <ul id="draft-list" class="draft-list"></ul>
      </section>
    `;
  }

  async afterRender() {
    this.#container = document.getElementById('draft-list');
    this.#presenter = new DraftsPresenter({
      view: this,
      model: {
        fetchAll: dbUtils.getAllDrafts,
        remove: dbUtils.deleteDraft,
      },
    });
    this.#presenter.init();
  }

  showDrafts(drafts) {
    this.#container.innerHTML = ''; 
    if (!drafts || drafts.length === 0) {
      this.#container.innerHTML = '<li>Tidak ada draft.</li>';
      return;
    }

    drafts.forEach(draft => {
      if (!draft || !draft.id) return;  

      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <img src="${draft.photoUrl || '/images/logo.png'}" alt="..." width="150">
          <h3>${draft.name || 'Tidak ada judul'}</h3>
          <p><strong>Deskripsi:</strong> ${draft.description || 'Tidak ada deskripsi'}</p>
          <p><strong>Tanggal:</strong> ${new Date(draft.createdAt).toLocaleString()}</p>
          <p><strong>Lokasi:</strong> ${draft.lat && draft.lon ? `${draft.lat.toFixed(5)}, ${draft.lon.toFixed(5)}` : 'Tidak ada lokasi'}</p>
          <button class="btn-delete" data-id="${draft.id}">Hapus</button>
        </div>
      `;
      this.#container.appendChild(li);
    });

    this.#container.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        console.log('ID draft yang akan dihapus:', id); 
        this.#presenter.deleteDraft(id); 
      });
    });
  }

  showError(message) {
    alert(message);
  }
}

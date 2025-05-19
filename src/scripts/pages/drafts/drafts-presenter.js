import { getAllDrafts, deleteDraft as dbDeleteDraft } from '../../utils/db.js';

export default class DraftsPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model ?? {
      fetchAll: getAllDrafts,
      remove: dbDeleteDraft,
    };
  }

  async init() {
    this.loadDrafts();
  }

  async loadDrafts() {
    try {
      const drafts = await this.#model.fetchAll();
      this.#view.showDrafts(drafts);
    } catch (error) {
      this.#view.showError('Gagal memuat daftar draft.');
      console.error(error);
    }
  }

  async deleteDraft(id) {
    try {
      await this.#model.remove(id);
      alert('Draft berhasil dihapus.');
      this.loadDrafts();
    } catch (error) {
      this.#view.showError('Gagal menghapus draft.');
      console.error(error);
    }
  }
}

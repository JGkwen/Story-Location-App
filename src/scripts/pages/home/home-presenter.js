import { getStories } from '../../data/api'; 
import { sleep } from '../../utils';  
import Map from '../../utils/map'; 
import { saveDraft } from '../../utils/db.js';

export default class HomePresenter {
  #view;
  #model; 
  #mapElement;

  constructor({ view, mapElement, model }) {
    this.#view = view;
    this.#model = model; 
    this.#mapElement = mapElement;
  }

  async showStories() {
    try {
      this.#view.showLoading();

      const token = localStorage.getItem('auth_token');
      const stories = await this.#model.getStories(token);

      await sleep();
      this.#view.showStories(stories);
      this.#view.hideLoading();

      if (typeof Map?.init === 'function') {
        Map.init(this.#mapElement, stories);
      } else {
        console.error('Map.init is not a function');
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      this.#view.showError('Gagal memuat cerita.');
    }
  }

  async saveStoryToDraft(storyId) {
    try {
      const token = localStorage.getItem('auth_token');
      const stories = await this.#model.getStories(token);
      const story = stories.find(s => s.id == storyId);
      if (!story) {
        alert('Cerita tidak ditemukan');
        return;
      }

      const { id, ...storyWithoutId } = story;

      const newId = await saveDraft(storyWithoutId);
      alert(`Cerita berhasil disimpan ke draft dengan id: ${newId}`);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan draft');
    }
  }

}

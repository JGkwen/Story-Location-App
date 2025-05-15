import HomePresenter from './home-presenter';
import { getStories } from '../../data/api';  

export default class HomePage {
  #presenter;

  async render() {
    return `
      <section id="home" class="container home-container">
        <h2>Daftar Cerita</h2>
        <div id="story-list-container">
          <button id="add-story-btn"><i class="fas fa-plus"></i> Tambah Cerita</button>
          <div id="loading-container"></div>
          <div id="story-list">Loading...</div>
        </div>
        <div id="map-container">
          <div id="map"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const mapElement = document.getElementById('map');
    const addStoryBtn = document.getElementById('add-story-btn');
    addStoryBtn.addEventListener('click', () => {
      location.hash = '/add';
    });

    this.#presenter = new HomePresenter({
      view: this,
      mapElement,
      model: { getStories }  
    });

    await this.#presenter.showStories();  
  }

  showStories(stories) {
    const storyList = document.getElementById('story-list');
    storyList.innerHTML = '';

    if (stories.length === 0) {
      storyList.innerHTML = '<p>Belum ada cerita</p>';
      return;
    }

    stories.forEach((story) => {
      const item = document.createElement('div');
      item.classList.add('story-item');
      item.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" width="100">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
      `;
      storyList.appendChild(item);
    });
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = `<div class="loader"></div>`;
  }

  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

  showError(message) {
    document.getElementById('story-list').innerHTML = `<p>${message}</p>`;
  }
}

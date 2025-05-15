import AddPresenter from './add-presenter';
import { addStory } from '../../data/api';  
import Camera from '../../utils/camera';  
import L from 'leaflet';  

export default class AddPage {
  #presenter;
  #cameraImage = null;  

  async render() {
    return `
      <section class="container">
        <h2>Tambah Cerita</h2>
        <form id="add-form">
          <div>
            <label for="description">Deskripsi</label><br>
            <textarea id="description" rows="4" cols="50" required></textarea>
          </div>
          <div>
            <label for="photo">Upload Foto</label><br>
            <input type="file" id="photo" accept="image/*">
          </div>
          <div>
            <label for="camera-photo">Ambil Foto dengan Kamera</label><br>
            <video id="camera-video" width="300" height="200" autoplay></video>
            <canvas id="camera-canvas" style="display:none;"></canvas>
            <button id="camera-take-button" type="button">Ambil Foto</button>
          </div>
          <div id="map-container">
            <div id="map" style="height: 300px;"></div>
          </div>
          <div>
            <label for="latitude">Latitude</label><br>
            <input type="number" id="latitude" name="latitude" readonly>
          </div>
          <div>
            <label for="longitude">Longitude</label><br>
            <input type="number" id="longitude" name="longitude" readonly>
          </div>
          <button type="submit"><i class="fas fa-plus"></i> Tambah Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Silakan login terlebih dahulu!');
      location.hash = '/login';
      return;
    }

    this.#presenter = new AddPresenter({ view: this, model: { addStory } });
    this.#presenter.init();
  }

  initializeMap(updateCallback) {
    const mapElement = document.getElementById('map');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const map = L.map(mapElement).setView([-6.9021856, 107.6187558], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const marker = L.marker([-6.175389, 106.827139], { draggable: true }).addTo(map);

    marker.on('move', (event) => {
      const { lat, lng } = event.target.getLatLng();
      latitudeInput.value = lat;
      longitudeInput.value = lng;
    });

    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      marker.setLatLng([lat, lng]);
      latitudeInput.value = lat;
      longitudeInput.value = lng;
    });
  }

  initializeCamera(cameraCallback) {
    const cameraTakeButton = document.getElementById('camera-take-button');
    cameraTakeButton.addEventListener('click', async () => {
      Camera.capture();
      this.#cameraImage = await Camera.getImageBlob();  
      cameraCallback();  
    });

    Camera.init();
  }

  initializeForm(formSubmitCallback) {
    const form = document.getElementById('add-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const description = document.getElementById('description').value;
      const uploadPhoto = document.getElementById('photo').files[0];
      const latitude = document.getElementById('latitude').value;
      const longitude = document.getElementById('longitude').value;

      formSubmitCallback(description, uploadPhoto, latitude, longitude, this.#cameraImage);  
    });
  }

  updateLatitudeLongitude(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  }

  showFormError(message) {
    alert(message);
  }

  onStoryAdded() {
    alert('Cerita berhasil ditambahkan!');
    location.hash = '/home';
  }

  onAddStoryError(error) {
    console.error('Gagal menambahkan cerita:', error);
    alert('Gagal menambahkan cerita');
  }

  handleCameraCapture() {
    Camera.getImageBlob().then(blob => {
      this.#cameraImage = blob;  
      console.log('Foto kamera berhasil diterima');
    });
  }
}

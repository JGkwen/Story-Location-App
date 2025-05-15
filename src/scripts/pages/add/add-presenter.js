import { addStory } from '../../data/api';
import Camera from '../../utils/camera';
import L from 'leaflet';

export default class AddPresenter {
  #view;
  #model;
  #cameraImage = null; 

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  init() {
    this.#view.initializeMap(this.handleMapUpdate.bind(this));
    this.#view.initializeCamera(this.handleCameraCapture.bind(this));
    this.#view.initializeForm(this.handleFormSubmit.bind(this));
  }

  handleMapUpdate(lat, lng) {
    this.#view.updateLatitudeLongitude(lat, lng);
  }

  handleCameraCapture() {
    console.log('Menangani foto dari kamera');
  }

  handleCameraImage(blob) {
    this.#cameraImage = blob;
    console.log('Gambar kamera berhasil diterima', blob);
  }

  async handleFormSubmit(description, uploadPhoto, latitude, longitude, cameraImage) {
    if (!description || !latitude || !longitude) {
      this.#view.showFormError('Harap lengkapi semua form!');
      return;
    }

    if (!uploadPhoto && !cameraImage) {
      this.#view.showFormError('Silakan unggah foto atau ambil gambar dari kamera!');
      return;
    }

    if (uploadPhoto && cameraImage) {
      this.#view.showFormError('Silakan pilih hanya satu: unggah foto ATAU kamera, bukan keduanya.');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('lat', latitude);
    formData.append('lon', longitude);

    if (uploadPhoto) {
      formData.append('photo', uploadPhoto);
    } else {
      formData.append('photo', cameraImage, 'camera-photo.jpg'); 
    }

    const token = localStorage.getItem('auth_token');
    await this.submitStory(formData, token);
  }

  async submitStory(formData, token) {
    try {
      await this.#model.addStory(formData, token); 
      this.#view.onStoryAdded();
    } catch (error) {
      this.#view.onAddStoryError(error);
    }
  }
}

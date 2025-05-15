let stream;
let videoElement;
let canvasElement;

const Camera = {
  init() {
    videoElement = document.getElementById('camera-video');
    canvasElement = document.getElementById('camera-canvas');

    // Meminta izin untuk mengakses kamera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        stream = mediaStream;
        console.log('Kamera berhasil diakses');
        window.currentStreams = [...(window.currentStreams || []), stream];
        videoElement.srcObject = stream;
      })
      .catch(err => {
        console.error('Gagal mengakses kamera', err);
      });
  },

  capture() {
    if (!stream) return;
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0);
    canvasElement.style.display = 'block';  // Menampilkan canvas setelah gambar diambil

    // Berhenti dan menghentikan semua stream setelah pengambilan gambar
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  },

  async getImageBlob() {
    return new Promise((resolve) => {
      canvasElement.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  },

  stopAllStreams() {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
      return;
    }

    window.currentStreams.forEach((stream) => {
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      }
    });

    window.currentStreams = [];
  }
};

export default Camera;

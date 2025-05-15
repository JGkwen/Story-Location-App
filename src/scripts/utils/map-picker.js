import L from 'leaflet';

const MapPicker = {
    init() {
        const map = L.map('map').setView([-6.2, 106.8], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        let marker;
        map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }

        document.getElementById('lat').value = lat;
        document.getElementById('lon').value = lng;
        });
    },
};

export default MapPicker;

import { Component, OnInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../data.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage implements OnInit {

  map!: L.Map;
  private dataService = inject(DataService);

  constructor() { }

  ngOnInit() {
    if (!this.map) {
      setTimeout(() => {
        this.map = L.map('map').setView([-7.7956, 110.3695], 13);

        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        });

        osm.addTo(this.map);

        // Konfigurasi custom icon Leaflet
        const iconRetinaUrl = 'assets/icon/marker-icon-2x.png';
        const iconUrl = 'assets/icon/marker-icon.png';
        const shadowUrl = 'assets/icon/marker-shadow.png';
        const iconDefault = L.icon({
          iconRetinaUrl,
          iconUrl,
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;

        // Jalankan fungsi loadPoints() setelah peta siap
        this.loadPoints();
      });
    }
  }

  // Buat function loadPoints() untuk memanggil dan menampilkan data points dari Firebase
  async loadPoints() {
    const points: any = await this.dataService.getPoints();
    for (const key in points) {
      if (points.hasOwnProperty(key)) {
        const point = points[key];
        const coordinates = point.coordinates.split(',').map((c: string) => parseFloat(c));
        const marker = L.marker(coordinates as L.LatLngExpression).addTo(this.map);

        // Bind popup dengan tombol Delete yang menyertakan data-key
        marker.bindPopup(`
          <div>
            <b>${point.name}</b><br>
            <a href="/editpoint/${key}">Edit</a> |
            <a href="#" class="delete-link" data-key="${key}">Delete</a>

            </div>
        `);
      }
    }

    // Listener saat popup dibuka untuk menangkap event klik pada link delete
    this.map.on('popupopen', (e) => {
      const popup = e.popup;
      const deleteLink = popup.getElement()?.querySelector('.delete-link');
      if (deleteLink) {
        deleteLink.addEventListener('click', (event) => {
          event.preventDefault();
          const key = (event.target as HTMLElement).dataset['key'];
          if (key) {
            this.deletePoint(key, popup.getLatLng());
          }
        });
      }
    });
  }

  // Function deletePoint() untuk menghapus data di Firebase dan menghapus marker di peta
  async deletePoint(key: string, latLng: L.LatLng | undefined) {
    await this.dataService.deletePoint(key);
    if (latLng) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          if (layer.getLatLng().equals(latLng)) {
            this.map.removeLayer(layer);
          }
        }
      });
    }
  }

}

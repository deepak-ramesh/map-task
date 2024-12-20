import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';  // Import isPlatformBrowser

@Component({
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: any;
  staticMarkers: any[] = [];
  dynamicMarkers: any[] = [];
  customIcons: any;
  defaultIconSize: any = [20, 20];
  isMenuVisible: boolean = false;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // Check if running on the browser
      this.loadLeaflet();
    }
  }

  // Load leaflet dynamically
  loadLeaflet(): void {
    import('leaflet').then((L) => {
      window['L'] = L.default || L; // Assign leaflet to the global window object
      this.initializeMap();
    }).catch((error) => {
      console.error('Error loading leaflet:', error);
    });
  }

  initializeMap(): void {
    if (typeof window['L'] !== 'undefined') {
      this.map = window['L'].map('map', {
        center: [53.3429, -6.2675],
        zoom: 25,
      });

      window['L'].tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      this.setStaticData();
      this.fetchLocationData();
    }
  }

  setStaticData() {
    this.customIcons = {
      hotel: window['L'].icon({
        iconUrl: 'assets/icons/hotel.png', 
        iconSize: this.defaultIconSize
      }),
      restaurant: window['L'].icon({
        iconUrl: 'assets/icons/restaurant.png', 
        iconSize: this.defaultIconSize
      }),
      tourist_spot: window['L'].icon({
        iconUrl: 'assets/icons/tourist.png', 
        iconSize: this.defaultIconSize
      }),
      map_icon: window['L'].icon({
        iconUrl: 'assets/icons/map_icon.png', 
        iconSize: this.defaultIconSize
      }),
    };
    this.insertStaticMarker();
  }

  insertStaticMarker() {
    const mk1 = window['L'].marker([53.3429, -6.2713147],{ icon: this.customIcons.hotel }).addTo(this.map)
      .bindPopup('Hotels').openPopup();
    this.staticMarkers.push(mk1);

    const mk2 = window['L'].marker([53.3430, -6.2513170],{ icon: this.customIcons.restaurant }).addTo(this.map)
      .bindPopup('Restaurants');
    this.staticMarkers.push(mk2);

    const mk3 = window['L'].marker([53.3431, -6.2613200],{ icon: this.customIcons.tourist_spot }).addTo(this.map)
      .bindPopup('Tourist Spot');
    this.staticMarkers.push(mk3);
  }

  fetchLocationData(): void {
    const map_icon = window['L'].icon({
      iconUrl: 'assets/icons/map_icon.png', 
      iconSize: this.defaultIconSize
    });
    const url = 'https://overpass-api.de/api/interpreter?data=[out:json];node(around:300,53.3429,-6.2675)["name"];out;';

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data && data.elements && Array.isArray(data.elements)) {
          data.elements.forEach((element: any) => {
            if (element.lat && element.lon) { 
              const name = element.tags?.name || 'Unnamed Location';
              const website = element.tags?.website
                ? `<br><a href="${element.tags.website}" target="_blank">Website</a>`
                : '';

              var mk = window['L'].marker([element.lat, element.lon],{ icon: map_icon })
                .addTo(this.map!)
                .bindPopup(`<b>${name}</b>${website}`);
              this.dynamicMarkers.push(mk);
            }
          });
        } else {
          console.error('Unexpected data structure:', data);
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  loadStaticData(event: any) {
    event.preventDefault();
    this.insertStaticMarker();
    alert('Static Location Data Loaded');
  }

  removeStaticMarkers(event: any) {
    event.preventDefault();
    this.staticMarkers.forEach((mk) => {
      mk.remove();
    });
    alert('Static Location Data Removed');
  }

  removeDynamicMarkers(event: any) {
    event.preventDefault();
    this.dynamicMarkers.forEach((mk) => {
      mk.remove();
    });
    alert('Dynamic Location Data Removed');
  }

  loadDynamicData(event: any) {
    event.preventDefault();
    this.fetchLocationData();
    alert('Dynamic Location Data Loaded');
  }
}

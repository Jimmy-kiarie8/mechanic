import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';

declare const mapboxgl: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements AfterViewInit {
  @Input() data: any;

  user: any;
  map: any;
  markers: any[] = [];
  geocoder: any;
  location = {
    lat: 0,
    lng: 0
  };
  @ViewChild('mapElement', { static: false }) mapElement: any;

  constructor(
    private firebaseService: FirebaseService, private loadingController: LoadingController, private alertController: AlertController, private auth: Auth
  ) {
    this.user = this.auth.currentUser;

  }
  ngAfterViewInit() {
    this.initializeMap();

  }

  async initializeMap() {
    // Load the map
    mapboxgl.accessToken = environment.mapPublicKey;

    this.map = await new mapboxgl.Map({
      container: this.mapElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: [36.81585262388069, -1.281312671309479], // starting center in [lng, lat]

      zoom: 12, // starting zoom
      // projection: 'globe' // display map as a 3D globe
    });

    const icon = document.getElementById('icon');

    icon?.addEventListener('click', (e) => {
      // this.map.setStyle('mapbox://styles/mapbox/light-v9');
    }, false);

    await this.map.on('style.load', () => {
      this.map.resize();
      this.map.setFog({}); // Set the default atmosphere style
    });

    const geolocate = await new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });


    this.map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body') }));
    // Add the control to the map.
    this.map.addControl(geolocate);
    await this.map.on('load', () => {
      geolocate.trigger(); // Automatically activates geolocation
    });


    geolocate.on('geolocate', (e: any) => {
      this.addMarker([this.data.longitude, this.data.latitude])
      this.getRoute([e.coords.longitude, e.coords.latitude], [this.data.longitude, this.data.latitude]);

      // this.start = [e.coords.longitude, e.coords.latitude];

    });

  }

  addMarker(coordinates: number[]) {
    const popup = new mapboxgl.Popup().setHTML(
      `<h3 style="color: #000">${this.data.email}</h3><p style="color: #000">11</p>`
    );

    const markerElement = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(this.map);

    // Store the marker reference for later use or removal
    this.markers.push(markerElement);

    // Add click event listener to the marker
    markerElement.getElement().addEventListener('click', () => {
      // Handle click event
    });
  }



  async getRoute(start: any, end: any) {
    // const start = this.start;

    // make a directions request using driving profile
    // an arbitrary start will always be the same
    if (end.length > 0 && start.length > 0) {

      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (this.map.getSource('route')) {
        this.map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }

      // this.instructionSteps = data;
    }

    // this.instuctions(data);
  }


}

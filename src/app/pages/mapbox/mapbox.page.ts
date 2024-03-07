import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as turf from '@turf/turf';
import { Observable } from 'rxjs';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TripmodalPage } from './tripmodal/tripmodal.page';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MapboxService } from 'src/app/services/mapbox.service';
import { RequestPage } from './request/request.page';

declare const mapboxgl: any;

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.page.html',
  styleUrls: ['./mapbox.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapboxPage implements AfterViewInit {

  order: any;

  instructionSteps = null;
  user = null;

  start: any;
  end: any;

  map: any;


  markers: any;

  public userLocation!: { latitude: number; longitude: number; bearing: number };
  private ws!: WebSocket;

  @ViewChild('mapElement', { static: false }) mapElement: any;

  constructor(
    private modalCtrl: ModalController, private loadingCtrl: LoadingController,
    private authService: AuthService, private alertController: AlertController
  ) {
    this.user = this.authService.user;

  }

  ngAfterViewInit() {
    this.loadMap();

  }

  // Load the map
  async loadMap() {
    mapboxgl.accessToken = environment.mapPublicKey;

    this.map = await new mapboxgl.Map({
      container: this.mapElement.nativeElement, // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: [36.81585262388069, -1.281312671309479], // starting center in [lng, lat]

      zoom: 1, // starting zoom
      // projection: 'globe' // display map as a 3D globe
    });

    const icon = document.getElementById('icon');

    icon?.addEventListener('click', (e) => {
      // this.map.setStyle('mapbox://styles/mapbox/light-v9');
      this.modal();
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
      this.getMarkers()
    });


    geolocate.on('geolocate', (e: any) => {
      console.log("🚀 ~ MapboxPage ~ geolocate.on ~ e:", e)
      this.start = [e.coords.longitude, e.coords.latitude];

      this.addMarkers();
    });

  }


  // Mapbox Get coordinates from client address
  async getCoordinates() {
    // const address = 'Nairobi, kenya';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.order.receiver.address}.json?country=KE&access_token=${environment.mapPublicKey}`;
    mapboxgl.accessToken = environment.mapPublicKey;

    const query = await fetch(
      url,
      { method: 'GET' }
    );
    const json = await query.json();

    this.end = json.features[0].center;

    const markerItem = new mapboxgl.Marker().setLngLat(this.end).addTo(this.map);


    markerItem.getElement().addEventListener('click', () => {
      this.detailModal(json.features[0].center);
    });
  }

  // Mapbox Load route path
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

      this.instructionSteps = data;
    }

    // this.instuctions(data);
  }


  // Modal
  async requestModal() {
    const modal = await this.modalCtrl.create({
      component: RequestPage,
      componentProps: { steps: this.instructionSteps },
      breakpoints: [0, 0.8],
      initialBreakpoint: 0.5
    });
    modal.present();
  }


  async modal() {
    const modal = await this.modalCtrl.create({
      component: TripmodalPage,
      componentProps: { steps: this.instructionSteps },
      breakpoints: [0, 0.8],
      initialBreakpoint: 0.5
    });
    modal.present();
  }

  // Modal
  async detailModal(coordArr: any) {
    const data = {
      latitude: coordArr[0],
      longitude: coordArr[1]
    };
  }


  // Alert
  async presentAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: 'Validation failed',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  getMarkers() {
    const baseCoordinates = [36.7292470215261, -1.1006648395070264]; // Nairobi CBD marker

    this.markers = Array.from({ length: 10 }, (_, index) => {
      const newCoordinates = [
        baseCoordinates[0] + (Math.random() - 0.5) * 0.5, // Vary latitude by up to 0.05
        baseCoordinates[1] + (Math.random() - 0.5) * 0.5  // Vary longitude by up to 0.05
      ];

      const address = `Address ${index + 1}, Kenya`;

      return {
        coordinates: newCoordinates,
        title: `Mechanic ${index + 1}`,
        address: address,
        description: 'This is Nairobi, Kenya!'
      };
    });
  }


  addMarkers() {

    this.markers.forEach((marker: any) => {
      const popup = new mapboxgl.Popup().setHTML(
        `<h3 style="color: #000">${marker.title}</h3><p style="color: #000">${marker.description}</p>`
      );

      const markerElement = new mapboxgl.Marker()
        .setLngLat(marker.coordinates)
        .setPopup(popup)
        .addTo(this.map);

      // Add click event listener to the marker
      markerElement.getElement().addEventListener('click', () => {
        this.getRoute(this.start, marker.coordinates);
        this.requestModal();
      });
    });
  }

}

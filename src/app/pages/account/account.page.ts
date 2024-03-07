import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';
// import MapboxGeocoder from 'mapbox/mapbox-gl-geocoder';

declare const mapboxgl: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements AfterViewInit {
  form = {
    name: '',
    phone: '',
    address: ''
  };
  user: any;
  map: any;
  marker: any;
  geocoder: any;
  location = {
    lat: 0,
    lng: 0
  };
  @ViewChild('mapElement', { static: false }) mapElement: any;

  constructor(
    private firebaseService: FirebaseService, private loadingController: LoadingController,
    private authService: AuthService, private alertController: AlertController,private auth: Auth
  ) {

  }
  ngAfterViewInit() {
    this.initializeMap();


    setTimeout(() => {
      this.getUserProfile();
    }, 5000);
  }

  async initializeMap() {
    const loading = await this.loadingController.create();
    await loading.present();
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
      this.addMarker([e.coords.longitude, e.coords.latitude]);

      this.location = {lat: e.coords.longitude, lng: e.coords.latitude};

    });

    setTimeout(() => {
    loading.dismiss();

    }, 3000);

  }


  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("🚀 ~ AccountPage ~ navigator.geolocation.getCurrentPosition ~ position:", position)
        const coordinates = [position.coords.longitude, position.coords.latitude];
        this.addMarker(coordinates);
      }, (error) => {
        console.error('Error getting current location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  addMarker(coordinates: number[]) {
    if (this.marker) {
      this.marker.remove();
    }
    this.marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat(coordinates)
      .addTo(this.map);

    // Event listener for marker dragend event
    this.marker.on('dragend', () => {
      const newCoordinates = this.marker.getLngLat();
      console.log('Marker dragged to:', newCoordinates);
      this.location = newCoordinates
    });
  }



  async update() {
    console.log("🚀 ~ AccountPage ~ update ~ email:", this.auth.currentUser)

    const loading = await this.loadingController.create();
    await loading.present();
    var data = {
      'company': this.form.name,
      'address':  this.form.address,
      'phone':  this.form.phone,
      'email':  this.auth.currentUser?.email,
      'latitude': this.location.lat,
      'longitude': this.location.lng
    }
    const result = await this.firebaseService.addMechanic(data);
    loading.dismiss();

    if (!result) {
      const alert = await this.alertController.create({
        header: 'Failed',
        message: 'Something went wrong.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }


  getUserProfile() {
    // this.firebaseService.getUsersWithProfile()

    this.authService.getUserProfile().subscribe((res:any) => {
      console.log("🚀 ~ MapboxPage ~ this.authService.getUserProfile ~ res:", res)
      // this.user = res
      this.form.name = res.name
      this.form.phone = res.phone
    });
  }
}

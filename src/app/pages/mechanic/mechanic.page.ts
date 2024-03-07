import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';
import { ModalPage } from './modal/modal.page';
import { ModalController } from '@ionic/angular';

declare const mapboxgl: any;
@Component({
  selector: 'app-mechanic',
  templateUrl: './mechanic.page.html',
  styleUrls: ['./mechanic.page.scss'],
})
export class MechanicPage implements OnInit {

  requests: any;
  firebaseSubscription!: Subscription;
  address: any;

  constructor(private firebaseService: FirebaseService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getRequests()
  }


  // Mapbox Get coordinates from client address
  async getAddress(lat: any, lng: any) {
    console.log("🚀 ~ MechanicPage ~ getAddress ~ lng:", lng)
    console.log("🚀 ~ MechanicPage ~ getAddress ~ lat:", lat)
    // const lat = -1.1748105;
    // const lng = 36.8304102;
    // const address = 'Nairobi, kenya';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?country=KE&access_token=${environment.mapPublicKey}`;
    mapboxgl.accessToken = environment.mapPublicKey;

    const query = await fetch(
      url,
      { method: 'GET' }
    );
    const json = await query.json();
    console.log("🚀 ~ MechanicPage ~ getCoordinates ~ json:", json.features[0].place_name)

      this.address = json.features[0].place_name;

  }


  getRequests() {
    this.firebaseSubscription = this.firebaseService.getItems('requests').subscribe({
      next: (res: any[]) => {
        this.requests = res

        this.getAddress(res[0].latitude, res[0].longitude)
      },
      error: (error: any) => {
        console.error("Error fetching user data:", error);
        // Handle error (e.g., show error message)
      },
      complete: () => {
        console.log("requests created:", this.requests);
        // Any additional logic after requests creation
      }
    });
  }

  // Modal
  async modal(data:any) {
    console.log("🚀 ~ MapboxPage ~ requestModal ~ data:", data)
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { data },
      breakpoints: [0, 1],
      initialBreakpoint: 0.8
    });
    modal.present();
  }

}

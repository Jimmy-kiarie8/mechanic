import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';
import { ModalPage } from './modal/modal.page';
import { ModalController, ToastController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

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


  maxRating = 5;
  rating = 4;
  ratingArr: any;

  constructor(private firebaseService: FirebaseService, private modalCtrl: ModalController, private auth: Auth, private toastCtrl: ToastController) {
    this.ratingArr = Array(this.maxRating).fill(0);
   }

  ngOnInit() {
    this.getRequests()
  }


  // Mapbox Get coordinates from client address
  async getAddress(lat: any, lng: any) {
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

      this.address = json.features[0].place_name;

  }


  async getRequests() {
    // const user = await this.auth.currentUser;
    const uid = localStorage.getItem('token');

    this.firebaseSubscription = this.firebaseService.getItemsByMechanicId('requests', uid).subscribe({
      next: (res: any[]) => {
        console.log("🚀 ~ MechanicPage ~ this.firebaseSubscription=this.firebaseService.getItemsByMechanicId ~ res:", res)
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
  status_update(status: any, item: any) {
    console.log("🚀 ~ MechanicPage ~ status_update ~ item:", item)
    this.firebaseService.updateRequestStatus(status, item.id).then((res) => {
    console.log("🚀 ~ MechanicPage ~ this.firebaseService.updateRequestStatus ~ res:", res)
      this.toastPresent('Status updated')
    }).catch((error) => {
      console.log("🚀 ~ MechanicPage ~ this.firebaseService.updateRequestStatus ~ error:", error)
      this.toastPresent('Something went wrong')

    })
  }

  // Modal
  async modal(data:any) {
    this.status_update('Accepted', data)
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { data },
      breakpoints: [0, 1],
      initialBreakpoint: 0.8
    });
    modal.present();
  }


  async toastPresent(message: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();

  }

}

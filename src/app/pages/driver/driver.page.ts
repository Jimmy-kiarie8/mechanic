import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FirebaseService, Request } from 'src/app/services/firebase.service';
import { ModalPage } from './modal/modal.page';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { RatingPage } from './rating/rating.page';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {


  requests: any;
  user: any;
  firebaseSubscription!: Subscription;


  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }



  constructor(private authService: AuthService, private firebaseService: FirebaseService, private cd: ChangeDetectorRef, private alertCtrl: AlertController, private modalCtrl: ModalController, private loadingController: LoadingController, private alertController: AlertController, private toastCtrl: ToastController) {
    this.firebaseService.getItems('users').subscribe(res => {
      this.requests = res;
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
    this.getRequests()
  }


  // async addMechanic() {
  //   const loading = await this.loadingController.create();
  //   await loading.present();

  //   const result = await this.firebaseService.addMechanic();
  //   loading.dismiss();

  //   if (!result) {
  //     const alert = await this.alertController.create({
  //       header: 'Upload failed',
  //       message: 'Something went wrong.',
  //       buttons: ['OK']
  //     });
  //     await alert.present();
  //   }
  // }

  async openRequest(request: Request) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: request.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });

    await modal.present();
  }


  getUserProfile() {
    this.user = this.authService.getUserProfile()
  }



  async getRequests() {
    const loading = await this.loadingController.create();
    await loading.present();
    const uid = localStorage.getItem('token');
    this.firebaseSubscription = this.firebaseService.getRequestById(uid).subscribe((res: any) => {
      loading.dismiss();
      console.log("🚀 ~ DriverPage ~ this.firebaseSubscription=this.firebaseService.getRequestById ~ res:", res)
      this.requests = res

    });
  }


  async status_update(status: any, item: any) {
    const uid = localStorage.getItem('token');
    const loading = await this.loadingController.create();
    await loading.present();
    console.log("🚀 ~ MechanicPage ~ status_update ~ item:", item)
    this.firebaseService.updateRequestStatus(status, uid).then((res) => {
      console.log("🚀 ~ MechanicPage ~ this.firebaseService.updateRequestStatus ~ res:", res)
      loading.dismiss();
      this.toastPresent('Status updated')
    }).catch((error) => {
      console.log("🚀 ~ MechanicPage ~ this.firebaseService.updateRequestStatus ~ error:", error)
      loading.dismiss();
      this.toastPresent('Something went wrong')

    })
  }

  // Modal
  async modal(data: any) {
    this.status_update('Completed', data)
    const modal = await this.modalCtrl.create({
      component: RatingPage,
      componentProps: {},
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

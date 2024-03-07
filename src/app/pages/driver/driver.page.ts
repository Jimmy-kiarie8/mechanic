import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FirebaseService, Request } from 'src/app/services/firebase.service';
import { ModalPage } from './modal/modal.page';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {


  requests: Request[] = [];
  user: any;

  constructor(private authService: AuthService, private firebaseService: FirebaseService,  private cd: ChangeDetectorRef, private alertCtrl: AlertController, private modalCtrl: ModalController, private loadingController: LoadingController,private alertController: AlertController) {
    this.firebaseService.getRequests().subscribe(res => {
      this.requests = res;
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
    console.log('Loaded')
  }



  async addRequest() {
    const alert = await this.alertCtrl.create({
      header: 'Add Request',
      inputs: [
        {
          name: 'title',
          placeholder: 'My cool request',
          type: 'text'
        },
        {
          name: 'text',
          placeholder: 'Learn Ionic',
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Add',
          handler: res => {
            this.firebaseService.addRequest({ text: res.text, title: res.title });
          }
        }
      ]
    });

    await alert.present();
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
    // .subscribe((data) => {
		// console.log("🚀 ~ DriverPage ~ this.authService.getUserProfile ~ data:", data)
		// });
	}
}

import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  @Input() data: any;
  @Input() coodinates: any;
  @Input() user: any;

  constructor(private firebaseService: FirebaseService, private loadingController: LoadingController, private alertController: AlertController, private auth: Auth) { }

  ngOnInit() {
    console.log('Loaded')
  }

  // this.start = [e.coords.longitude, e.coords.latitude];

  async requestMechanic() {

    const loading = await this.loadingController.create();
    await loading.present();

    const data = {
      longitude: this.coodinates[0],
      latitude: this.coodinates[1],
      email: this.auth.currentUser?.email,
      phone: this.user.phone,
      name: this.user.name,
      status: this.user.status
    }
    console.log("🚀 ~ RequestPage ~ requestMechanic ~ data:", data)

    const result = await this.firebaseService.addRequest(data, this.data.id);
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


}


import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FirebaseService, Request } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id!: string;
  request: any;
  // request: Request = null;

  constructor(private dataService: FirebaseService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.dataService.getRequestById(this.id).subscribe(res => {
      this.request = res;
    });
  }

  async deleteRequest() {
    await this.dataService.deleteRequest(this.request)
    this.modalCtrl.dismiss();
  }

  async updateRequest() {
    // await this.dataService.updateRequest(this.request);
    // const toast = await this.toastCtrl.create({
    //   message: 'Request updated!.',
    //   duration: 2000
    // });
    // toast.present();

  }
}

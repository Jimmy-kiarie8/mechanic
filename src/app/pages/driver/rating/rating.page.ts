import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {


  @Input() maxRating = 5;
  @Input() rating = 0;
  // @Output() ratingChange = new EventEmitter<number>();

  ratingArr: any;

  constructor( private loadingController: LoadingController, private toastCtrl: ToastController) {
    this.ratingArr = Array(this.maxRating).fill(0);
  }

  ngOnInit() {
    console.log(1)
  }


  async rate(index: number) {

    const loading = await this.loadingController.create();
    await loading.present();
    this.rating = index + 1;

    setTimeout(() => {
      loading.dismiss();

      this.toastPresent('Thank you for rating!')
    }, 2000);
    // this.ratingChange.emit(this.rating);


  }

  async toastPresent(message: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();

  }


}

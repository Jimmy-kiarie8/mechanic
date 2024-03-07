import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.page.html',
  styleUrls: ['./organization.page.scss'],
})
export class OrganizationPage implements OnInit {
  form = {
    domain: (localStorage.getItem('domain')) ? localStorage.getItem('domain') : ''
  };
  constructor(private authService: AuthService, private alertController: AlertController, private router: Router,
    private menuCtrl: MenuController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  async checkDomain() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      spinner: 'bubbles'
    });
    await loading.present();

    this.authService.org(this.form).subscribe(res => {
      console.log(res);
    }, error => {
      loading.dismiss();
      this.presentAlert(error.error.message);
    }, () => {
      loading.dismiss();
      localStorage.setItem('domain', this.form.domain);
      let url = '/';
      const navigation = this.router.getCurrentNavigation();
      if (navigation) {
        url = navigation.extractedUrl.toString();
      }
      console.log('🚀 ~ file: organization.page.ts ~ line 47 ~ OrganizationPage ~ this.authService.org ~ url', url);

      this.router.navigate(['/login'], { queryParams: { returnto: url }});
    });
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Warning',
      subHeader: 'Please check your domain',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }



}

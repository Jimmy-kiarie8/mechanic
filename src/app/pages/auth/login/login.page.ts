import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;

  loginUrl = '';
  form = {
    email: '',
    password: '',
  };


  constructor(private fb: FormBuilder, private loadingController: LoadingController, private alertController: AlertController, private authService: AuthService, private router: Router, private routerOutlet: IonRouterOutlet) {
    const isAuthenticated = localStorage.getItem('authenticated');
    const role = localStorage.getItem('role');
    if (isAuthenticated && role === 'driver') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/mechanic']);
    }
    // if (!this.routerOutlet.canGoBack()) {
    //   App.exitApp();
    // }
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (user) {
      localStorage.setItem('authenticated', '1');
      localStorage.setItem('token', user.uid);
      this.getUserProfile();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      console.log("🚀 ~ LoginPage ~ login ~ user:", user)
      localStorage.setItem('authenticated', '1');
      localStorage.setItem('token', user.user.uid);
      await this.getUserProfile();

      const role = localStorage.getItem('role');

      if (role === 'mechanic') {
        this.router.navigateByUrl('/mechanic', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
  }



  getUserProfile() {
    this.authService.getUserProfile().subscribe((res: any) => {
      if (res.isDriver) {
        localStorage.setItem('role', 'driver');
      } else {
        localStorage.setItem('role', 'mechanic');
      }
      localStorage.setItem('name', res.name);
      localStorage.setItem('phone', res.phone);
    });
  }

  async showAlert(header: any, message: any) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}

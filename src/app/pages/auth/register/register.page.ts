import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials!: FormGroup;

  registerUrl = '';
  form = {
    type: 'Driver',
    isMechanic: false,
    isDriver: true,
    email: '',
    name: '',
    phone: '',
    password: '',
  };


  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) { }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
  get phone() {
    return this.credentials.get('phone');
  }

  get password() {
    return this.credentials.get('password');
  }
  get name() {
    return this.credentials.get('name');
  }
  get type() {
    return this.credentials.get('type');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      isMechanic: [false, [Validators.required]],
      isDriver: [true, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();



    if (this.credentials.value.type == 'Mechanic') {
      this.credentials.patchValue({ isMechanic: true, isDriver: false });
    } else {
      this.credentials.patchValue({ isMechanic: false, isDriver: true });
    }

    const user = await this.authService.register(this.credentials.value);
    console.log("🚀 ~ RegisterPage ~ register ~ user:", user)
    await loading.dismiss();

    if (user) {
      if (this.credentials.value.type == 'Mechanic') {
        this.router.navigateByUrl('account', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    } else {
      // this.showAlert('Register failed', 'Please try again!');
    }
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

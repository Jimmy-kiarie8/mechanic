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
    email: '',
    password: '',
  };


	constructor(
		private fb: FormBuilder,
		private loadingController: LoadingController,
		private alertController: AlertController,
		private authService: AuthService,
		private router: Router
	) {}

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
		console.log("🚀 ~ RegisterPage ~ register ~ user:", user)
		await loading.dismiss();

		if (user) {
			this.router.navigateByUrl('/', { replaceUrl: true });
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
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Driver', url: '/driver', icon: 'speedometer' },
    { title: 'Mechanic', url: '/mechanic', icon: 'car' },
  ];
  user: any;
  public labels = [];
  // public labels = ['Share', 'Settings', 'Profile'];
  constructor(private authService: AuthService) {
    setTimeout(() => {
      this.getUserProfile()
    }, 5000);
  }
  // constructor(public auth: AngularFireAuth) {}



  // login() {
  //   this.auth.signInWithEmailAndPassword('email@example.com', 'password');
  // }

  // logout() {
  //   this.auth.signOut();
  // }

  getMenu() {

    if (this.user.isDriver) {
      this.appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        { title: 'Driver', url: '/driver', icon: 'speedometer' },
      ];
    } else {
      this.appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        { title: 'Mechanic', url: '/mechanic', icon: 'car' },
      ];

    }

  }


  getUserProfile() {
    console.log('-------------------------------------')
    // this.user = this.authService.getUserProfile()

    this.authService.getUserProfile().subscribe((res: any) => {
      console.log("🚀 ~ MapboxPage ~ this.authService.getUserProfile ~ res111111:", res)
      this.user = res
      this.getMenu()
    });

    console.log('-------------------------------------')
  }
}

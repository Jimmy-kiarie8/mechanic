import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Driver', url: '/driver', icon: 'speedometer' },
    { title: 'Login', url: '/login', icon: 'speedometer' },
    { title: 'Mechanic', url: '/mechanic', icon: 'car' },
  ];
  public labels = ['Share', 'Settings', 'Profile'];
  constructor() {}
  // constructor(public auth: AngularFireAuth) {}



  // login() {
  //   this.auth.signInWithEmailAndPassword('email@example.com', 'password');
  // }

  // logout() {
  //   this.auth.signOut();
  // }
}

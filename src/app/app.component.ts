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
  ];
  public labels = ['Share', 'Settings', 'Profile'];
  constructor() {}
}

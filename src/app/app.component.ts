import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

interface User {
  name: string;
  phone: string;
  role: string
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Driver', url: '/driver', icon: 'speedometer' },
    { title: 'Requests', url: '/mechanic', icon: 'car' },
    { title: 'Account', url: '/account', icon: 'car' },
  ];
  user: User = {
    name: '',
    phone: '',
    role: '',
  };
  public labels = [];

  constructor(private authService: AuthService, private router: Router) {
    // Populate user properties with data from localStorage if available
    const storedName = localStorage.getItem('name');
    const storedPhone = localStorage.getItem('phone');
    const storedRole = localStorage.getItem('role');

    // Check if storedName and storedPhone are not null before assigning
    if (storedName !== null) {
      this.user.name = storedName;
    }
    if (storedPhone !== null) {
      this.user.phone = storedPhone;
    }
    if (storedRole !== null) {
      this.user.role = storedRole;
    }

    setTimeout(() => {
      this.getMenu()
    }, 1000);
  }



  // login() {
  //   this.auth.signInWithEmailAndPassword('email@example.com', 'password');
  // }

  // logout() {
  //   this.auth.signOut();
  // }

  getMenu() {

    if (this.user.role === 'driver') {
      this.appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        { title: 'Driver', url: '/driver', icon: 'speedometer' },
      ];
    } else {
      this.appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        { title: 'Requests', url: '/mechanic', icon: 'car' },
        { title: 'Account', url: '/account', icon: 'car' },
      ];

    }

  }

  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/login', { replaceUrl: true });

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

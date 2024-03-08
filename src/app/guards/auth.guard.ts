import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router) {}

  async canLoad() {
    const isAuthenticated = localStorage.getItem('authenticated');
    // const isAuthenticated = !!(+localStorage.getItem('authenticated'));
    // const isAuthenticated = await Preferences.get({ key: 'authenticated' });
    console.log(isAuthenticated);


    if (isAuthenticated) {
      return true;
    } else {
      const navigation = this.router.getCurrentNavigation();
      let url = '/';
      if (navigation) {
        url = navigation.extractedUrl.toString();
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  // selector = 'slides-example';
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  constructor(private router: Router) { }

  ngOnInit() {
  }

  async login() {
    this.router.navigate(['/login']);
  }

  async register() {
    this.router.navigate(['/register']);
  }
}

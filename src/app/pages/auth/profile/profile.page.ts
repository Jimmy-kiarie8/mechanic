import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = null;
  // user = JSON.parse(localStorage.getItem('user'));
  randomSaying = '';
  greetings = '';
  sayings = [
    'Keep spreading positivity, wherever you go.',
    'May today bring you the joys of yesterday’s hopes!',
    'Think positive, stay happy and test negative',
   'Just think, today is another day to work toward achieving all of your goals.',
   'The day is awaiting you with rich and beautiful blessings. Accept and enjoy them as they come!',
   'If want to be happy, then start sharing your happiness with others, and try to make others happy. ',
   'Be yourself; everyone else is already taken.',
   'When you have a dream, you\'ve got to grab it and never let go.',
   'Nothing is impossible. The word itself says \'I\'m possible!',
   'The bad news is time flies. The good news is you\'re the pilot.',
   'Life has got all those twists and turns. You\'ve got to hold on tight and off you go.',
   '"Keep your face always toward the sunshine, and shadows will fall behind you.'
  ];

  constructor(private authService: AuthService) {
    setTimeout(() => {
      this.user = this.authService.user;
    }, 900);
  }

  ngOnInit() {
    this.getGreetings();
  }

  getGreetings() {
    const today = new Date();
    const curHr = today.getHours();
    // eslint-disable-next-line no-bitwise
    this.randomSaying  = this.sayings[(Math.random() * this.sayings.length) | 0];
    if (curHr < 12) {
      this.greetings = ('Good morning');
    } else if (curHr < 18) {
      this.greetings = ('Good afternoon');
    } else {
      this.greetings = ('Good evening');
    }
  }
}
